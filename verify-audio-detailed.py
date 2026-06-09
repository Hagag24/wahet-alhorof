import json
import re

# Load manifest
with open('audio-manifest.json', 'r', encoding='utf-8-sig') as f:
    manifest = json.load(f)

# Load mapping
with open('lib/audio-mapping.ts', 'r', encoding='utf-8') as f:
    mapping_content = f.read()

# Create manifest ID to text mapping
manifest_id_to_text = {}
for entry in manifest['files']:
    manifest_id_to_text[entry['id']] = entry['text']

# Extract mapping
mapping_ids = re.findall(r'"([^"]+)":\s*"([^"]+)"', mapping_content)
mapping_dict = {text: audio_id for text, audio_id in mapping_ids}

print("=" * 80)
print("DETAILED AUDIO CROSS-REFERENCE CHECK")
print("=" * 80)

# Check each mapping entry
errors = []
warnings = []

for text, audio_id in sorted(mapping_dict.items()):
    if audio_id not in manifest_id_to_text:
        errors.append(f"❌ '{text}' -> {audio_id} (ID NOT IN MANIFEST)")
    else:
        manifest_text = manifest_id_to_text[audio_id]
        # Check if the mapped text matches the manifest text
        if text != manifest_text:
            # Check if it's a close match (same meaning)
            if text.replace('،', '').replace('.', '') == manifest_text.replace('،', '').replace('.', ''):
                warnings.append(f"⚠️  '{text}' -> {audio_id} (manifest: '{manifest_text}') - Punctuation difference")
            else:
                errors.append(f"❌ '{text}' -> {audio_id} (manifest: '{manifest_text}') - TEXT MISMATCH")

if errors:
    print("\n❌ ERRORS FOUND:")
    for error in errors:
        print(f"   {error}")
else:
    print("\n✅ No errors found - all mappings are correct")

if warnings:
    print("\n⚠️  WARNINGS (minor differences):")
    for warning in warnings:
        print(f"   {warning}")
else:
    print("\n✅ No warnings found")

# Check for questions using word IDs instead of phrase IDs
question_keywords = ['ما الصوت', 'أين يوجد', 'استمع إلى', 'أين حرف']
question_errors = []

for text, audio_id in mapping_dict.items():
    if any(keyword in text for keyword in question_keywords):
        if audio_id.startswith('word-'):
            question_errors.append(f"❌ Question '{text}' uses word ID: {audio_id}")

if question_errors:
    print("\n❌ QUESTIONS USING WORD IDs (should use phrase IDs):")
    for error in question_errors:
        print(f"   {error}")
else:
    print("\n✅ All questions use correct phrase IDs")

# Check for words using phrase IDs
word_errors = []
for text, audio_id in mapping_dict.items():
    # Single words or short phrases
    if len(text.split()) <= 2 and not any(char in text for char in ['؟', '،', '.']):
        if audio_id.startswith('phrase-'):
            word_errors.append(f"⚠️  Word '{text}' uses phrase ID: {audio_id}")

if word_errors:
    print("\n⚠️  WORDS USING PHRASE IDs (might be intentional):")
    for error in word_errors[:10]:  # Show first 10
        print(f"   {error}")
    if len(word_errors) > 10:
        print(f"   ... and {len(word_errors) - 10} more")
else:
    print("\n✅ Words use correct word IDs")

print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
print(f"Total mappings checked: {len(mapping_dict)}")
print(f"Errors: {len(errors)}")
print(f"Warnings: {len(warnings)}")
print(f"Questions with wrong IDs: {len(question_errors)}")
print(f"Words with phrase IDs: {len(word_errors)}")

if len(errors) == 0 and len(question_errors) == 0:
    print("\n✅ AUDIO SYSTEM IS CORRECT - NO CROSS-REFERENCE ERRORS")
else:
    print("\n❌ AUDIO SYSTEM HAS ERRORS")
