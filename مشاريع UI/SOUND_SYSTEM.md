# نظام المؤثرات الصوتية 🎵

هذا الملف يوضح كيفية عمل نظام المؤثرات الصوتية في منصة تعلم العربية.

## نظرة عامة

تستخدم المنصة مكتبة **Tone.js** لتوليد المؤثرات الصوتية التفاعلية. جميع الأصوات يتم توليدها برمجياً وليست ملفات خارجية، مما يقلل حجم التطبيق.

## أنواع الأصوات المتاحة

### 1. صوت النجاح ✓ (`success`)
- **الوصف**: ثلاث نغمات صعودية عند الإجابة الصحيحة
- **الاستخدام**: عند تصحيح الإجابة في الألعاب

```typescript
await play('success')
```

### 2. صوت الكلك 🖱️ (`click`)
- **الوصف**: نقرة صوتية قصيرة
- **الاستخدام**: عند الضغط على الأزرار

```typescript
await play('click')
```

### 3. صوت الإجابة الصحيحة ✅ (`correct`)
- **الوصف**: ثلاث نغمات مرتفعة متلاحقة
- **الاستخدام**: عند الإجابة الصحيحة في الاختبارات

```typescript
await play('correct')
```

### 4. صوت الخطأ ❌ (`wrong`)
- **الوصف**: نغمتان منخفضتان
- **الاستخدام**: عند الإجابة الخاطئة

```typescript
await play('wrong')
```

### 5. صوت صعود المستوى 🎉 (`levelUp`)
- **الوصف**: خمس نغمات صعودية متدرجة
- **الاستخدام**: عند الوصول إلى مستوى جديد

```typescript
await play('levelUp')
```

### 6. صوت الجمع/النجم ⭐ (`collect`)
- **الوصف**: نغمتان عاليتان
- **الاستخدام**: عند جمع نجم أو عنصر

```typescript
await play('collect')
```

### 7. صوت نهاية اللعبة 🏁 (`gameOver`)
- **الوصف**: ثلاث نغمات منخفضة
- **الاستخدام**: عند انتهاء اللعبة

```typescript
await play('gameOver')
```

### 8. صوت الحرف 🔤 (`letterSound`)
- **الوصف**: نغمة تختلف حسب الحرف العربي
- **الاستخدام**: عند تشغيل صوت الحرف

```typescript
await play('letterSound', 'ب')  // حرف الباء
await play('letterSound', 'ت')  // حرف التاء
```

### 9. صوت الانزلاق 🌊 (`swoosh`)
- **الوصف**: ثلاث نغمات صاعدة سريعة
- **الاستخدام**: عند الانتقال بين الشاشات

```typescript
await play('swoosh')
```

### 10. صوت الاحتفال 🎊 (`celebrate`)
- **الوصف**: ستة نغمات احتفالية
- **الاستخدام**: عند النجاح الكامل أو الإنجاز

```typescript
await play('celebrate')
```

## كيفية الاستخدام

### استيراد Hook الصوت

```typescript
import { useSound } from '@/hooks/useSound'

export function MyComponent() {
  const { play, setVolume, getVolume } = useSound()
  
  // استخدام الأصوات
  await play('success')
}
```

### التحكم بالصوت

```typescript
// تعيين مستوى الصوت (0 إلى 1)
setVolume(0.5)  // 50% صوت

// الحصول على مستوى الصوت الحالي
const currentVolume = getVolume()  // returns 0.5
```

## مكون التحكم بالصوت

يوجد مكون `SoundControl` يوفر واجهة لتحكم المستخدم بالصوت:

```typescript
import { SoundControl } from '@/components/SoundControl'

export default function Home() {
  return (
    <div>
      <SoundControl position="top-right" />
      {/* محتوى التطبيق */}
    </div>
  )
}
```

### خيارات الموقع (`position`)
- `'top-right'` - أعلى يمين (الافتراضي)
- `'top-left'` - أعلى يسار
- `'bottom-right'` - أسفل يمين
- `'bottom-left'` - أسفل يسار

## أمثلة الاستخدام في الألعاب

### مثال 1: لعبة الاختيار

```typescript
const handleAnswer = async (isCorrect: boolean) => {
  if (isCorrect) {
    await play('correct')
    setScore(score + 1)
  } else {
    await play('wrong')
  }
}
```

### مثال 2: لعبة الصيد

```typescript
const handleLetterClick = async (isTarget: boolean) => {
  if (isTarget) {
    await play('collect')
    setScore(score + 1)
  } else {
    await play('wrong')
  }
}
```

### مثال 3: شاشة النتائج

```typescript
useEffect(() => {
  if (percentage === 100) {
    play('celebrate')
  } else if (percentage >= 80) {
    play('levelUp')
  }
}, [])
```

## معلومات فنية

### المكتبة المستخدمة
- **Tone.js 15.1.22**: مكتبة موسيقى تفاعلية ويب

### الأنواع المستخدمة
- **Sine Wave**: أصوات ناعمة (معظم الأصوات)
- **Triangle Wave**: أصوات دافئة (للنجاح)
- **Square Wave**: أصوات قوية (للأصوات المهمة)

### معاملات الصوت
- **Attack**: 0.002 - 0.02 ثانية
- **Decay**: 0.05 - 0.2 ثانية
- **Release**: 0.05 - 0.1 ثانية

## الخيارات المتقدمة

### تغيير مستوى الصوت العام

```typescript
import { setVolume } from '@/lib/sounds'

// ضبط صوت عام لكل الأصوات
setVolume(0.3)  // 30%
```

### إضافة صوت جديد

أضف صوتاً جديداً في `/lib/sounds.ts`:

```typescript
export const sounds = {
  myNewSound: async () => {
    await initTone()
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 },
    }).toDestination()

    synth.triggerAttackRelease('C4', '8n')
  },
}
```

ثم استخدمه:

```typescript
await play('myNewSound')
```

## توافقية المتصفح

النظام الصوتي يعمل على جميع المتصفحات الحديثة:
- Chrome/Edge 14+
- Firefox 25+
- Safari 14.1+
- Opera 11+

## الأداء والتحسينات

- جميع الأصوات يتم توليدها برمجياً (لا توجد ملفات صوتية خارجية)
- استهلاك ذاكرة منخفض جداً
- تأخير التشغيل: < 50ms
- مناسب للأجهزة المحمولة وسطح المكتب

## التعطيل/التفعيل

المستخدمون يمكنهم كتم الصوت من خلال مكون `SoundControl`:
- زر رئيسي للكتم السريع
- منزلق للتحكم بمستوى الصوت
- زر اختبار الصوت

## استكشاف الأخطاء

### الصوت لا يعمل على iOS
- تتطلب iOS 14.5+ اعتماداً على رسالة المستخدم الأولى
- قد تحتاج إلى النقر على عنصر بصري أولاً

### عدم سماع الصوت
1. تحقق من مستوى الصوت (استخدم SoundControl)
2. تأكد من أن الصوت ليس مكتوماً في النظام
3. تحقق من وحدة التحكم (console) عن رسائل الخطأ

## الموارد الإضافية

- [Tone.js Documentation](https://tonejs.org/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web_API/Web_Audio_API)
- [React Hooks Best Practices](https://react.dev/reference/react/hooks)
