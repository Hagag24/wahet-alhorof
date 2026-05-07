# نصائح للمطورين - منصة الألعاب التعليمية العربية

## 🚀 البدء السريع

### 1. التثبيت والتشغيل
```bash
cd /vercel/share/v0-project
pnpm install
pnpm dev
```
ثم افتح `http://localhost:3000`

### 2. اختيار شاشة للعرض
استخدم الأزرار في أعلى الصفحة للتنقل بين الشاشات الـ 10.

---

## 📦 استخدام المكونات

### الزر (Button)
```tsx
<Button variant="primary" size="lg">
  اضغط هنا
</Button>
```

**المتغيرات**: `primary`, `secondary`, `danger`, `success`
**الأحجام**: `sm`, `md`, `lg`, `xl`

### البطاقة (Card)
```tsx
<Card color="purple">
  <h3>العنوان</h3>
  <p>المحتوى</p>
</Card>
```

**الألوان**: `purple`, `blue`, `yellow`, `mint`, `pink`

### شريط التقدم (ProgressBar)
```tsx
<ProgressBar value={65} color="primary" showLabel={true} />
```

**الألوان**: `primary`, `secondary`, `success`

### الشخصية (Mascot)
```tsx
<Mascot type="rabbit" size="lg" animate={true} />
```

**الأنواع**: `rabbit`, `cat`, `bird`, `robot`, `star`
**الأحجام**: `sm`, `md`, `lg`

### شارة الحالة (Badge)
```tsx
<Badge status="completed" />
```

**الحالات**: `completed`, `locked`, `new`, `needs-review`

---

## 🎨 نظام الألوان

### الوصول إلى الألوان
```tsx
// في Tailwind مباشرة
<div className="bg-primary text-primary-foreground">
  محتوى بنفسجي
</div>

// يعمل تلقائياً مع:
bg-primary, bg-secondary, bg-accent
text-primary, text-secondary, text-accent
border-primary, border-secondary, border-accent
```

### قائمة الألوان
```
الأساسي:
- bg-primary (بنفسجي)
- bg-secondary (أزرق)
- bg-accent (أصفر)
- bg-accent-mint (أخضر نعناعي)
- bg-accent-pink (وردي)

الحالات:
- bg-success (أخضر)
- bg-destructive (أحمر)

الخلفيات:
- bg-background (كريمي فاتح)
- bg-muted (أزرق فاتح جداً)
```

---

## 🎬 الحركات والتأثيرات

### استخدام الحركات
```tsx
<div className="animate-bounce-gentle">
  عنصر بحركة ارتفاع وانخفاض
</div>

<div className="animate-scale-in">
  عنصر يظهر بشكل تدريجي
</div>

<div className="animate-shake-small">
  عنصر يهتز (للأخطاء)
</div>
```

### الحركات المتاحة
```
animate-bounce-gentle      // ارتفاع وانخفاض
animate-scale-in          // ظهور تدريجي
animate-pulse-glow        // نبض ناعم
animate-shake-small       // اهتزاز خفيف
animate-stars             // ظهور نجوم
animate-slide-up          // انزلاق من الأسفل
animate-confetti          // تساقط احتفالات
```

---

## 📝 إضافة شاشة جديدة

### الخطوات:

1. **إنشاء ملف جديد** في `components/screens/MyNewScreen.tsx`:
```tsx
'use client'

import React from 'react'
import { Button, Card } from '../DesignSystem'
import { Mascot } from '../Mascot'

export function MyNewScreen() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-5xl font-bold text-primary">
        شاشة جديدة
      </h1>
      <Mascot type="star" size="lg" />
      <Button variant="primary" size="lg">
        اضغط هنا
      </Button>
    </div>
  )
}
```

2. **إضافة إلى التصدير** في `components/screens/index.ts`:
```tsx
export { MyNewScreen } from './MyNewScreen'
```

3. **إضافة للصفحة الرئيسية** في `app/page.tsx`:
```tsx
import { MyNewScreen } from '@/components/screens'

// في مصفوفة screens:
{ id: 'my-screen', name: '⭐ شاشتي الجديدة', group: 'تجريبي', component: MyNewScreen }
```

---

## 🎮 إضافة لعبة جديدة

### نموذج أساسي:
```tsx
'use client'

import React, { useState } from 'react'
import { Button, ProgressBar, Feedback } from '../DesignSystem'
import { Mascot } from '../Mascot'

export function MyGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)

  const questions = [
    { question: 'سؤال 1', options: ['أ', 'ب', 'ج', 'د'], correct: 1 },
    // أضف المزيد من الأسئلة
  ]

  const handleAnswer = (index: number) => {
    const correct = index === questions[currentQuestion].correct
    setShowFeedback(true)
    if (correct) setScore(score + 1)

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      }
      setShowFeedback(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-primary">
        🎮 لعبتي الجديدة
      </h1>
      
      <ProgressBar 
        value={currentQuestion + 1} 
        max={questions.length} 
        color="primary" 
      />

      {/* المحتوى */}
      <Mascot type="cat" size="lg" animate={true} />

      {/* الأسئلة */}
      <div className="grid grid-cols-2 gap-4">
        {questions[currentQuestion].options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className="p-4 rounded-3xl bg-white border-4 border-primary"
          >
            {option}
          </button>
        ))}
      </div>

      {/* التغذية الراجعة */}
      {showFeedback && (
        <Feedback 
          type="success" 
          message="🎉 ممتاز يا بطل!" 
        />
      )}
    </div>
  )
}
```

---

## 💡 نصائح التصميم

### ✅ افعل هذا
- استخدم الألوان المحددة في النظام
- استخدم المكونات القابلة لإعادة الاستخدام
- أضف رسائل تحفيزية إيجابية
- استخدم حركات ناعمة وجميلة
- اجعل النصوص كبيرة وواضحة
- استخدم المسافات البيضاء

### ❌ لا تفعل هذا
- لا تستخدم ألوان خارج النظام
- لا تكتب نصوص قاسية ("خطأ")
- لا تستخدم حركات سريعة أو مزعجة
- لا تزدحم الشاشة بالعناصر
- لا تستخدم نصوص صغيرة
- لا تنسَ RTL

---

## 🐛 استكشاف الأخطاء

### المشكلة: الحروف العربية لا تظهر بشكل صحيح
**الحل**: تأكد من أن `lang="ar"` و `dir="rtl"` موجودة في `<html>`

### المشكلة: الزر لا يتفاعل
**الحل**: تأكد من أن `onClick` معرّفة بشكل صحيح

### المشكلة: الألوان لا تظهر
**الحل**: استخدم أسماء الألوان من النظام (مثل `bg-primary` وليس `bg-purple`)

### المشكلة: التخطيط مشوه على الموبايل
**الحل**: استخدم `grid-cols-1 md:grid-cols-2` للشاشات المختلفة

---

## 📱 الاستجابة (Responsive)

### أحجام الشاشة
```tsx
// موبايل فقط
<div className="md:hidden">
  محتوى الموبايل
</div>

// تابلت فوما
<div className="hidden md:block lg:hidden">
  محتوى التابلت
</div>

// ديسكتوب فقط
<div className="hidden lg:block">
  محتوى الديسكتوب
</div>

// شريط سفلي على الموبايل
<div className="md:hidden fixed bottom-0 left-0 right-0">
  التنقل السفلي
</div>
```

---

## 🔤 العمل مع النصوص العربية

### القواعد:
- النصوص دائماً من اليمين لليسار
- المحاذاة: `text-right` في الحالات العادية
- العناوين الكبيرة قد تحتاج `text-balance`
- استخدم خطوط عربية محددة

### مثال:
```tsx
<h1 className="text-5xl font-bold text-primary text-right">
  مرحباً بك في اللعبة
</h1>

<p className="text-lg text-muted-foreground text-right">
  هذا وصف النشاط التعليمي
</p>
```

---

## 🎯 الرسائل التحفيزية

### نماذج جاهزة:
```tsx
// النجاح
<Feedback type="success" message="🎉 ممتاز يا بطل!" />

// الخطأ
<Feedback type="error" message="😅 حاول مرة أخرى يا بطل" />

// المعلومات
<Feedback type="info" message="ℹ️ تذكر أن الحروف مهمة!" />

// التحذير
<Feedback type="warning" message="⚠️ تنبيه: الوقت ينفد!" />
```

### رسائل إضافية:
```
النجاح:
"🎉 ممتاز! ممتاز جداً!"
"⭐ نجم حقيقي أنت!"
"👑 أداء مثالي!"

الخطأ:
"😅 حاول مرة أخرى يا بطل"
"💪 تقدم جيد، حاول مرة ثانية"
"🔄 دعنا نحاول من جديد"

التشجيع:
"💪 استمر هكذا!"
"🌟 تقدم رائع!"
"🎊 إنك تفعل عملاً رائعاً!"
```

---

## 📊 معالجة البيانات

### الحفظ والاسترجاع (في المستقبل):
```tsx
// حفظ التقدم
const saveProgress = (playerId, levelId, score) => {
  // حفظ في قاعدة البيانات
}

// الحصول على التقدم
const getProgress = (playerId) => {
  // الحصول من قاعدة البيانات
}

// تحديث النقاط
const updateScore = (playerId, points) => {
  // تحديث في قاعدة البيانات
}
```

---

## 🧪 الاختبار

### اختبار الحروف العربية
```bash
# في المتصفح:
1. اكتب الحروف العربية
2. تأكد من ظهورها بشكل صحيح
3. تحقق من الاتجاه RTL
```

### اختبار الأداء
```bash
# في DevTools:
1. F12 → Performance
2. ابدأ التسجيل
3. تفاعل مع اللعبة
4. تحقق من FPS (60 هو الأمثل)
```

### اختبار الأجهزة
```
الموبايل: 390px
التابلت: 768px
الديسكتوب: 1440px
```

---

## 📚 الموارد المفيدة

### التوثيق المحلي:
- `DESIGN_SYSTEM.md` - نظام التصميم الكامل
- `README_AR.md` - دليل المشروع
- `PROJECT_SUMMARY_AR.md` - ملخص المشروع

### المتغيرات البيئية (قادمة):
```
NEXT_PUBLIC_API_URL=...
DATABASE_URL=...
AUTH_SECRET=...
```

---

## 🚀 النشر

### الإنتاج:
```bash
pnpm build
pnpm start
```

### على Vercel:
1. دفع الكود إلى GitHub
2. ربط المستودع ب Vercel
3. سيتم النشر تلقائياً

---

**آخر تحديث**: أبريل 2026
**النسخة**: 1.0
