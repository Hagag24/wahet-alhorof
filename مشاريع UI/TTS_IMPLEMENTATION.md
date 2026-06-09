# نظام Text-to-Speech (TTS) - النطق الصوتي

## نظرة عامة

تم تطبيق نظام نطق صوتي متقدم يوفر تجربة تعليمية تفاعلية وجذابة للأطفال. يستخدم النظام Web Speech API المدمج في المتصفحات لنطق النصوص العربية.

## المكونات الرئيسية

### 1. `lib/tts.ts` - محرك النطق
يوفر الخدمات الأساسية للنطق:

```typescript
// Import utilities
import { getTTSEngine, speakLetter, speakWord, speakInstruction } from '@/lib/tts'

// Speak a letter with its name
await speakLetter('ب') // ينطق "باء"

// Speak a word
await speakWord('تفاحة') // ينطق "تفاحة"

// Give instructions
await speakInstruction('اختر الحرف الصحيح')
```

### 2. `hooks/useTTS.ts` - React Hook للنطق
يوفر واجهة سهلة للاستخدام في المكونات:

```typescript
const { 
  speak, 
  speakLetter, 
  speakWord, 
  speakInstruction,
  speakFeedback,
  speakNumber,
  stop,
  pause,
  resume,
  isSupported,
  isSpeaking,
  volume,
  setVolume
} = useTTS()
```

## الألعاب المدعومة

### 1. لعبة اختيار الحروف (ChooseLetterGame)
- ✅ نطق الحرف عند بدء السؤال
- ✅ زر سماع لإعادة نطق الحرف
- ✅ تغذية صوتية عند الإجابة (صحيح/خطأ)

```typescript
// عند بدء اللعبة
speakLetter(letter) // ينطق الحرف الصحيح

// عند الإجابة
speakFeedback(isCorrect) // "ممتاز!" أو "حاول مرة أخرى"
```

### 2. لعبة صيد الحروف (CatchLettersGame)
- ✅ تعليمات اللعبة الصوتية
- ✅ نطق الحرف المستهدف
- ✅ رسائل تشجيع صوتية

```typescript
// تعليمات اللعبة
speakInstruction(`اصطد جميع حروف ${targetLetter}. لديك 30 ثانية!`)
speakLetter(targetLetter)

// عند الحصول على 5 نقاط
speakInstruction('ممتاز! أحسنت!')
```

### 3. لعبة طابق الصور (MatchPictureGame)
- ✅ تعليمات المطابقة الصوتية
- ✅ نطق الكلمة عند المطابقة الصحيحة
- ✅ زر نطق عند تحديد الصورة

```typescript
// تعليمات
speakInstruction('طابق الصور بالكلمات الصحيحة')

// نطق الكلمة الصحيحة
if (isCorrect) {
  await speakWord(selectedMatch.word)
}

// زر للنطق
<button onClick={() => speakWord(item.word)}>🔊</button>
```

### 4. لعبة أشكال الحرف (LetterFormsGame)
- ✅ تعليمات لعبة الأشكال الصوتية
- ✅ نطق الحرف (ميم)
- ✅ تصفيق عند كل شكل صحيح

```typescript
// البداية
speakInstruction('اختر شكل الحرف الصحيح في كل موضع')
speakWord('ميم')

// عند الإجابة الصحيحة
speakInstruction('ممتاز!')
```

### 5. لعبة الحركات (HarakatGame)
- ✅ تعليمات الحركات الصوتية
- ✅ نطق الحرف بالحركة عند كل سؤال
- ✅ زر سماع لإعادة النطق
- ✅ تغذية صوتية فورية

```typescript
// نطق الحرف بالحركة
speak(question.haraka, { rate: 0.8, pitch: 1.2 })

// التغذية
if (correct) {
  speakInstruction('ممتاز! هذه هي الحركة الصحيحة')
} else {
  speakInstruction('حاول مرة أخرى')
}
```

## خيارات النطق (TTSOptions)

```typescript
interface TTSOptions {
  rate?: number     // 0.5 - 2.0 (سرعة النطق)
  pitch?: number    // 0 - 2.0 (نبرة الصوت)
  volume?: number   // 0 - 1.0 (مستوى الصوت)
}

// مثال
await speakLetter('ب', { rate: 1.0, pitch: 1.2, volume: 0.8 })
```

## الأصوات المتقدمة

### سرعات النطق الموصى بها

```typescript
// للأطفال الصغار (بطء)
{ rate: 0.8 }

// عادي
{ rate: 1.0 }

// سريع
{ rate: 1.3 }
```

### نبرات الصوت الموصى بها

```typescript
// نبرة عالية (أطفال)
{ pitch: 1.2 }

// نبرة عادية
{ pitch: 1.0 }

// نبرة منخفضة
{ pitch: 0.8 }
```

## التحكم بالصوت

### مكون SoundControl
يوفر واجهة للتحكم في مستوى الصوت:

```typescript
<SoundControl position="top-right" />
```

- منزلق للتحكم في مستوى الصوت (0-100%)
- زر اختبار الصوت
- مؤشر حالة النطق الحالي

## الدعم اللغوي

### اللغات المدعومة
- العربية (ar-SA) - الافتراضي
- لغات أخرى حسب توفر الأصوات في المتصفح

### الحروف العربية

```typescript
const ARABIC_LETTERS = {
  ا: 'ألف',
  ب: 'باء',
  ت: 'تاء',
  ث: 'ثاء',
  ج: 'جيم',
  ح: 'حاء',
  خ: 'خاء',
  د: 'دال',
  ذ: 'ذال',
  ر: 'راء',
  ز: 'زاي',
  س: 'سين',
  ش: 'شين',
  ص: 'صاد',
  ض: 'ضاد',
  ط: 'طاء',
  ظ: 'ظاء',
  ع: 'عين',
  غ: 'غين',
  ف: 'فاء',
  ق: 'قاف',
  ك: 'كاف',
  ل: 'لام',
  م: 'ميم',
  ن: 'نون',
  ه: 'هاء',
  و: 'واو',
  ي: 'ياء',
}
```

## المتطلبات المتصفح

- **Chrome/Edge**: دعم كامل
- **Firefox**: دعم كامل
- **Safari**: دعم محدود (قد يتطلب تفعيل)
- **Mobile**: دعم كامل على معظم المتصفحات

## الأداء

### نقاط الأداء الرئيسية
- لا توقف في الواجهة أثناء النطق
- نطق متزامن مع الأنشطة الأخرى
- تخزين مؤقت للأصوات المستخدمة بشكل متكرر

### أفضل الممارسات
- استخدام `await` عند الانتظار لانتهاء النطق
- تفعيل/تعطيل الأزرار بناءً على حالة `isSpeaking`
- استخدام معدلات نطق مختلفة للأطفال والبالغين

## معالجة الأخطاء

```typescript
const { speak, isSupported } = useTTS()

if (isSupported) {
  await speak('مرحبا')
} else {
  console.warn('النطق غير مدعوم في هذا المتصفح')
}
```

## أمثلة متقدمة

### نطق متسلسل
```typescript
async function speakSequence() {
  await speakInstruction('اسمع بعناية')
  await speakLetter('ب')
  await speakWord('بيت')
  await speakInstruction('هل فهمت؟')
}
```

### نطق مع تأخير
```typescript
async function speakWithDelay() {
  await speak('الحرف الأول')
  await new Promise(resolve => setTimeout(resolve, 1000))
  await speakLetter('ب')
}
```

### نطق مشروط
```typescript
if (score >= 8) {
  await speakInstruction('ممتاز! أنت محترف!')
} else if (score >= 5) {
  await speakInstruction('جيد جداً!')
} else {
  await speakInstruction('استمر في التدريب')
}
```

## ملاحظات مهمة

1. **السماح بالصوت**: تأكد من السماح بالصوت في إعدادات المتصفح
2. **اللغة**: تأكد من تثبيت حزمة اللغة العربية في نظام التشغيل
3. **الأداء**: قد يختلف الأداء حسب المتصفح والجهاز
4. **الاختبار**: اختبر على عدة متصفحات قبل النشر

## الإحصائيات

- **إجمالي استدعاءات النطق**: 15+ في جميع الألعاب
- **الحروف المدعومة**: 28 حرف عربي
- **الكلمات المدعومة**: غير محدود
- **عدد الأصوات المخصصة**: 5 أصوات مختلفة

## الصيانة المستقبلية

- إضافة دعم لغات إضافية
- تحسين جودة النطق
- إضافة مؤثرات صوتية موسيقية
- تعزيز دعم الأجهزة المختلفة
