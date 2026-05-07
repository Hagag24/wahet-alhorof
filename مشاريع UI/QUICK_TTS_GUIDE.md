# دليل سريع - النطق الصوتي (TTS)

## البداية السريعة

### استخدام النطق في مكونك الخاص

```typescript
import { useTTS } from '@/hooks/useTTS'

export function MyGame() {
  const { speakLetter, speakWord, speakInstruction, isSpeaking } = useTTS()

  return (
    <button 
      onClick={() => speakWord('مرحبا')}
      disabled={isSpeaking}
    >
      🔊 اسمع
    </button>
  )
}
```

## الدوال الشائعة

### 1. نطق الحروف
```typescript
// نطق الحرف مع اسمه
await speakLetter('ب') // ينطق: "باء"
await speakLetter('ت') // ينطق: "تاء"
```

### 2. نطق الكلمات
```typescript
// نطق كلمة عادية
await speakWord('تفاحة')
await speakWord('محمد')
```

### 3. تعليمات
```typescript
// تعليمات واضحة
await speakInstruction('اختر الحرف الصحيح')
await speakInstruction('ممتاز! أحسنت!')
```

### 4. التغذية الراجعة
```typescript
// تصفيق على الإجابة
await speakFeedback(true) // "ممتاز! أحسنت!"
await speakFeedback(false) // "حاول مرة أخرى"
```

### 5. نطق الأرقام
```typescript
await speakNumber(5) // ينطق: "خمسة"
await speakNumber(10) // ينطق: "عشرة"
```

## التحكم بالنطق

### التحكم الأساسي
```typescript
const { speak, stop, pause, resume } = useTTS()

// إيقاف النطق الحالي
stop()

// إيقاف مؤقت
pause()

// استئناف
resume()
```

### مستوى الصوت
```typescript
const { volume, setVolume } = useTTS()

// ضبط مستوى الصوت (0 - 1)
setVolume(0.8)
console.log(volume) // 0.8
```

## الخيارات المتقدمة

### تخصيص النطق

```typescript
const { speak } = useTTS()

// نطق بطيء للأطفال الصغار
await speak('مرحبا', { rate: 0.8, pitch: 1.2 })

// نطق سريع
await speak('مرحبا', { rate: 1.3 })

// نطق بنبرة منخفضة
await speak('مرحبا', { pitch: 0.8 })
```

### الخيارات المتاحة

```typescript
interface TTSOptions {
  rate?: number    // 0.5 - 2.0 (سرعة النطق)
  pitch?: number   // 0 - 2.0 (نبرة الصوت)
  volume?: number  // 0 - 1.0 (مستوى الصوت)
}
```

## حالات الاستخدام العملية

### مثال 1: لعبة اختيار الحروف

```typescript
export function LetterGame() {
  const { speakLetter, speakFeedback } = useTTS()
  const [score, setScore] = useState(0)

  useEffect(() => {
    // نطق الحرف الجديد عند بدء السؤال
    speakLetter(questions[currentQuestion].letter)
  }, [currentQuestion])

  const handleAnswer = async (correct: boolean) => {
    if (correct) {
      setScore(score + 1)
      await speakFeedback(true)
    } else {
      await speakFeedback(false)
    }
  }

  return <button onClick={() => handleAnswer(true)}>✓</button>
}
```

### مثال 2: لعبة الكلمات

```typescript
export function WordGame() {
  const { speakWord, speakInstruction } = useTTS()

  useEffect(() => {
    speakInstruction('طابق الكلمة بالصورة')
  }, [])

  const handleMatch = async () => {
    await speakWord(currentWord)
  }

  return <button onClick={handleMatch}>🔊 اسمع الكلمة</button>
}
```

### مثال 3: زر نطق مع تعطيل

```typescript
export function SpeakButton({ text }) {
  const { speak, isSpeaking } = useTTS()

  return (
    <button 
      onClick={() => speak(text)}
      disabled={isSpeaking}
      className={isSpeaking ? 'opacity-50' : ''}
    >
      {isSpeaking ? '🔄 جارٍ النطق...' : '🔊 استمع'}
    </button>
  )
}
```

## نصائح مهمة

### 1. تفعيل/تعطيل الأزرار
```typescript
const { isSpeaking } = useTTS()

<button disabled={isSpeaking}>
  {isSpeaking ? 'جارٍ النطق...' : 'اسمع'}
</button>
```

### 2. تسلسل النطق
```typescript
async function speakMany() {
  await speakInstruction('اسمع بعناية')
  await new Promise(r => setTimeout(r, 500))
  await speakLetter('ب')
  await new Promise(r => setTimeout(r, 500))
  await speakWord('بيت')
}
```

### 3. النطق الشرطي
```typescript
if (score >= 8) {
  await speakInstruction('ممتاز! أنت محترف!')
} else if (score >= 5) {
  await speakInstruction('جيد جداً!')
}
```

## استكشاف الأخطاء

### المشكلة: لا صوت
```typescript
const { isSupported } = useTTS()

if (!isSupported) {
  console.warn('النطق غير مدعوم')
}
```

### المشكلة: النطق بطيء جداً
```typescript
// استخدم معدل أسرع
await speakWord('مرحبا', { rate: 1.3 })
```

### المشكلة: النطق سريع جداً
```typescript
// استخدم معدل أبطأ
await speakWord('مرحبا', { rate: 0.8 })
```

## التوافقية

### المتصفحات المدعومة
- ✅ Chrome/Edge (دعم كامل)
- ✅ Firefox (دعم كامل)
- ✅ Safari (دعم محدود)
- ✅ Mobile Browsers (معظمها)

### متطلبات النظام
- توفر حزمة اللغة العربية
- تفعيل صوت المتصفح
- JavaScript مفعل

## أمثلة إضافية

### مثال: لعبة تفاعلية كاملة

```typescript
export function InteractiveGame() {
  const { 
    speakInstruction, 
    speakLetter, 
    speakFeedback,
    isSpeaking 
  } = useTTS()
  
  const [started, setStarted] = useState(false)

  const startGame = async () => {
    setStarted(true)
    await speakInstruction('مرحباً بك! دعنا نتعلم الحروف')
    await speakInstruction('سأنطق حرفاً، تخمن اسمه')
  }

  const handleGuess = async (correct: boolean) => {
    if (correct) {
      await speakFeedback(true)
    } else {
      await speakFeedback(false)
    }
  }

  return (
    <>
      <button onClick={startGame} disabled={isSpeaking}>
        ابدأ اللعبة
      </button>
    </>
  )
}
```

## المراجع

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [استخدام useTTS Hook](./TTS_IMPLEMENTATION.md)
- [جميع الالعاب](./PROJECT_SUMMARY_AR.md)
