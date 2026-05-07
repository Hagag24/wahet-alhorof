import asyncio
import json
import edge_tts
from pathlib import Path
import sys
import re

FEMININE_EXCEPTIONS = {
    "أميرة", "مريم", "أمي", "أسرة", "حديقة", "حقيبة", "زهرة",
    "شجرة", "مدرسة", "معلمة", "ممحاة", "نملة", "غابة",
    "مهندسة", "جميلة", "رسمة", "لوحة"
}

FEMALE_HINTS = {"مريم", "أميرة", "أمي", "أمها", "المعلمة", "معلمتي", "فتاة", "بنت"}
MALE_HINTS = {"يوسف", "سامي", "كريم", "طارق", "أبي", "أبوها", "الأب", "جدي", "ولد"}

STORY_SPEAKER_BY_PREFIX = {
    "story-01": "female",  # مريم
    "story-02": "female",  # أميرة
    "story-03": "male",    # سامي
    "story-04": "male",    # كريم
}

HARAKAT_RE = re.compile(r"[\u064b-\u0652]+$")
ENDING_PUNCT_RE = re.compile(r"[!؟?.:,،؛]+$")
LONG_VOWEL_ENDINGS = {"ا", "و", "ي", "ى"}

WORD_TTS_OVERRIDES = {
    "أمي": "أُمِّي",
    "أبي": "أَبِي",
    "يوسف": "يُوسُفْ",
    "أميرة": "أَمِيرَة",
    "أسرة": "أُسْرَة",
    "أرنب": "أَرْنَب",
    "أسد": "أَسَد",
}

NAME_TTS_OVERRIDES = {
    "يوسف": "يُوسُف",
    "مريم": "مَرْيَم",
    "أميرة": "أَمِيرَة",
    "سامي": "سَامِي",
    "كريم": "كَرِيم",
    "طارق": "طَارِق",
}

def normalize_name_pronunciation(tts_text: str) -> str:
    tts = (tts_text or "").strip()
    if not tts:
        return tts

    for raw_name, vocalized_name in NAME_TTS_OVERRIDES.items():
        tts = re.sub(
            fr"(?<![\u0621-\u064A]){re.escape(raw_name)}(?![\u0621-\u064A])",
            vocalized_name,
            tts
        )
    return tts

def normalize_waqf_tts(word_text: str, tts_text: str) -> str:
    txt = (word_text or "").strip()
    tts = (tts_text or "").strip()
    if not txt or not tts:
        return tts

    if txt in WORD_TTS_OVERRIDES:
        tts = WORD_TTS_OVERRIDES[txt]

    # Strip ending punctuation before pause normalization.
    tts = ENDING_PUNCT_RE.sub("", tts)

    # Remove final case-ending harakat for pause/waqf style pronunciation.
    tts = HARAKAT_RE.sub("", tts)
    if not tts:
        return tts

    last_char = tts[-1]

    # Ta marbuta should be pronounced as final "ha" in pause.
    if last_char == "ة":
        return f"{tts[:-1]}هْ"

    # For long vowel endings, keep natural stop without adding sukun.
    if last_char in LONG_VOWEL_ENDINGS:
        return tts

    # Otherwise pause on sukun.
    return f"{tts}ْ"

def is_feminine_word(word: str) -> bool:
    w = (word or "").strip()
    if not w:
        return False
    if w in FEMININE_EXCEPTIONS:
        return True
    # Arabic ta marbuta is the strongest feminine signal.
    return w.endswith("ة")

def detect_gender_from_text(text: str, default_gender: str = "male") -> str:
    t = (text or "").strip()
    if not t:
        return default_gender

    female_score = sum(1 for token in FEMALE_HINTS if token in t)
    male_score = sum(1 for token in MALE_HINTS if token in t)

    if female_score > male_score:
        return "female"
    if male_score > female_score:
        return "male"
    return default_gender

async def process_file(file_info, settings, semaphore):
    async with semaphore:
        file_id = file_info.get("id")
        text = file_info.get("ttsText") or file_info.get("text")
        output_path = file_info.get("path")
        force_global_voice = settings.get("forceGlobalVoice", False)
        global_voice = settings.get("recommendedVoice", "ar-EG-ShakirNeural")
        female_voice = settings.get("femaleVoice", "ar-SA-ZariyahNeural")
        male_voice = settings.get("maleVoice", "ar-EG-ShakirNeural")
        voice_policy = settings.get("voicePolicy", "manifest")
        narrator_voice = settings.get("narratorVoice", male_voice)

        if force_global_voice:
            voice = global_voice
        elif voice_policy == "genderedWords":
            if file_info.get("kind") == "word":
                voice = female_voice if is_feminine_word(file_info.get("text", "")) else male_voice
            else:
                voice = narrator_voice
        elif voice_policy == "speakerAware":
            kind = file_info.get("kind")
            text_for_gender = file_info.get("text", "")
            gender_default = "male"

            if kind == "word":
                gender = "female" if is_feminine_word(text_for_gender) else "male"
            elif kind == "storyScene":
                group = file_info.get("group", "")
                group_gender = STORY_SPEAKER_BY_PREFIX.get(group)
                if group_gender:
                    gender = detect_gender_from_text(text_for_gender, group_gender)
                else:
                    gender = detect_gender_from_text(text_for_gender, gender_default)
            else:
                gender = detect_gender_from_text(text_for_gender, gender_default)

            voice = female_voice if gender == "female" else male_voice
        else:
            voice = file_info.get("voice") or global_voice
        rate = settings.get("rate", "-5%")
        pitch = settings.get("pitch", "+0Hz")
        volume = settings.get("volume", "+0%")

        if not text or not output_path:
            print(f"Skipping {file_id}: Missing text or path.")
            return

        text = normalize_name_pronunciation(text)

        if file_info.get("kind") == "word":
            text = normalize_waqf_tts(file_info.get("text", ""), text)

        # إنشاء المجلدات إذا لم تكن موجودة
        full_path = Path(output_path)
        full_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            print(f"Generating [{file_id}]: {output_path}")
            communicate = edge_tts.Communicate(
                text=text,
                voice=voice,
                rate=rate,
                pitch=pitch,
                volume=volume
            )
            await communicate.save(output_path)
            
            if full_path.exists():
                # print(f"Success: {output_path}")
                pass
            else:
                print(f"Error: Failed to create {output_path}")
        except Exception as e:
            print(f"Exception for {file_id}: {str(e)}")

async def main():
    manifest_path = "audio-manifest.json"
    
    if not Path(manifest_path).exists():
        print(f"Error: {manifest_path} not found.")
        return

    try:
        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)
    except Exception as e:
        print(f"Error reading JSON: {e}")
        return

    settings = manifest.get("ttsSettings", {})
    files = manifest.get("files", [])
    
    print(f"Found {len(files)} files to generate.")
    
    semaphore = asyncio.Semaphore(5)
    
    tasks = []
    for file_info in files:
        tasks.append(process_file(file_info, settings, semaphore))
    
    await asyncio.gather(*tasks)
    
    # Check what actually exists
    success_count = 0
    missing_files = []
    for file_info in files:
        p = Path(file_info.get("path"))
        if p.exists():
            success_count += 1
        else:
            missing_files.append(file_info.get("id"))
            
    print(f"\nSummary:")
    print(f"Total entries in manifest: {len(files)}")
    print(f"Successfully generated: {success_count}")
    
    if missing_files:
        print(f"Failed/Missing IDs: {', '.join(missing_files[:10])} ...")
    
    print("\nAll tasks completed!")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
