const DIACRITICS_REGEX = /[\u064B-\u065F\u0670]/g

// Curated pronunciation map for core lesson vocabulary and UI words.
// We keep this list explicit to avoid introducing wrong auto-diacritics.
const TASHKEEL_MAP: Record<string, string> = {
  "مريم": "مَرْيَم",
  "يوسف": "يُوسُف",
  "أميرة": "أَمِيرَة",
  "سامي": "سَامِي",
  "كريم": "كَرِيم",
  "طارق": "طَارِق",
  "أمي": "أُمِّي",
  "أبي": "أَبِي",
  "جدي": "جَدِّي",
  "بيت": "بَيْت",
  "حديقة": "حَدِيقَة",
  "متجر": "مَتْجَر",
  "دراجة": "دَرَّاجَة",
  "أسرة": "أُسْرَة",
  "غابة": "غَابَة",
  "شجرة": "شَجَرَة",
  "حيوان": "حَيَوَان",
  "بلبل": "بُلْبُل",
  "أسد": "أَسَد",
  "أرنب": "أَرْنَب",
  "نملة": "نَمْلَة",
  "مدرسة": "مَدْرَسَة",
  "معلمة": "مُعَلِّمَة",
  "قلم": "قَلَم",
  "زهرة": "زَهْرَة",
  "ممحاة": "مِمْحَاة",
  "حقيبة": "حَقِيبَة",
  "القصة": "القِصَّة",
  "المشهد": "المَشْهَد",
  "الألعاب": "الأَلْعَاب",
  "صحيح": "صَحِيح",
  "خاطئ": "خَاطِئ",
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function stripArabicDiacritics(text: string): string {
  return text.replace(DIACRITICS_REGEX, "")
}

export function addTashkeelForTTS(text: string): string {
  if (!text.trim()) return text

  let output = text

  // Apply longest phrases/words first to avoid partial collisions.
  const entries = Object.entries(TASHKEEL_MAP).sort((a, b) => b[0].length - a[0].length)
  for (const [plainWord, vocalizedWord] of entries) {
    const plainPattern = new RegExp(`(^|\\s|[،.?!:؛])${escapeRegExp(plainWord)}(?=\\s|[،.?!:؛]|$)`, "g")
    output = output.replace(plainPattern, `$1${vocalizedWord}`)
  }

  return output
}
