# 🏗️ معمارية المشروع - منصة الألعاب التعليمية

## هيكل المشروع الكامل

```
v0-project/
│
├── 📁 app/                          [تطبيق Next.js الرئيسي]
│   ├── layout.tsx                   ← التخطيط الأساسي (عربي + RTL)
│   ├── page.tsx                     ← الصفحة الرئيسية (نقطة الدخول)
│   ├── globals.css                  ← الأنماط العامة والحركات
│   ├── global-error.tsx             ← معالجة الأخطاء
│   └── favicon.ico
│
├── 📁 components/                   [المكونات القابلة لإعادة الاستخدام]
│   ├── Mascot.tsx                   ← الشخصيات الكرتونية (5 أنواع)
│   ├── DesignSystem.tsx             ← مكونات التصميم الأساسية
│   ├── index.ts                     ← تصدير المكونات
│   ├── theme-provider.tsx           ← مزود المظهر
│   │
│   ├── 📁 screens/                  [الشاشات الرئيسية (10 شاشات)]
│   │   ├── KidsHomeDashboard.tsx    ← 1️⃣ لوحة المعلومات الرئيسية
│   │   ├── LearningAdventureMap.tsx ← 2️⃣ خريطة التعلم
│   │   ├── ChooseLetterGame.tsx     ← 3️⃣ اختر الحرف
│   │   ├── CatchLettersGame.tsx     ← 4️⃣ اصطد الحروف
│   │   ├── MatchPictureGame.tsx     ← 5️⃣ طابق الصور
│   │   ├── LetterFormsGame.tsx      ← 6️⃣ أشكال الحرف
│   │   ├── HarakatGame.tsx          ← 7️⃣ الحركات
│   │   ├── GameResults.tsx          ← 8️⃣ النتائج والمكافآت
│   │   ├── ParentDashboard.tsx      ← 9️⃣ لوحة الوالدين
│   │   ├── TeacherDashboard.tsx     ← 🔟 لوحة المعلم
│   │   └── index.ts                 ← تصدير الشاشات
│   │
│   └── 📁 ui/                       [مكونات shadcn/ui]
│       ├── accordion.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── ... (مكونات إضافية)
│
├── 📁 public/                       [الملفات الثابتة]
│   ├── favicon.ico
│   ├── icon-light-32x32.png
│   └── apple-icon.png
│
├── 📁 node_modules/                 [الحزم المثبتة]
│   └── (تُنشأ بعد pnpm install)
│
├── 📁 .next/                        [ملفات البناء]
│   └── (تُنشأ بعد pnpm dev/build)
│
├── 📄 DOCUMENTATION FILES:
│   ├── START_HERE.md                ✨ ابدأ من هنا! (350 سطور)
│   ├── README_AR.md                 📖 دليل المشروع (390 سطور)
│   ├── DESIGN_SYSTEM.md             🎨 نظام التصميم (409 سطور)
│   ├── DEVELOPER_TIPS_AR.md         💡 نصائح المطورين (450 سطور)
│   ├── PROJECT_SUMMARY_AR.md        📊 ملخص المشروع
│   ├── INSTALLATION.md              ⚙️ دليل التثبيت (394 سطور)
│   ├── ARCHITECTURE.md              🏗️ معمارية المشروع (هذا الملف)
│   └── README.md                    (اللغة الإنجليزية)
│
├── 📄 CONFIGURATION FILES:
│   ├── package.json                 ← اعتماديات المشروع
│   ├── pnpm-lock.yaml               ← قفل الإصدارات
│   ├── tsconfig.json                ← إعدادات TypeScript
│   ├── next.config.mjs              ← إعدادات Next.js
│   ├── tailwind.config.ts           ← إعدادات Tailwind CSS
│   ├── postcss.config.mjs           ← إعدادات PostCSS
│   ├── components.json              ← إعدادات shadcn/ui CLI
│   └── .eslintrc.json               ← إعدادات ESLint
│
└── 📄 OTHER FILES:
    ├── .gitignore
    ├── .npmrc
    └── (ملفات النظام)
```

---

## 🔄 تدفق البيانات

```
User Browser
    ↓
app/page.tsx
    ↓
    ├──→ Navigation (التنقل)
    │
    └──→ CurrentComponent
         ↓
         screens/[ScreenName].tsx
         ↓
         ├──→ Mascot (شخصية)
         ├──→ Button (أزرار)
         ├──→ Card (بطاقات)
         ├──→ ProgressBar (شريط تقدم)
         └──→ ... (مكونات أخرى)
             ↓
         Rendered UI
             ↓
         Browser Displays
```

---

## 📦 الحزم الرئيسية

```json
{
  "dependencies": {
    "next": "16.2.4",              // إطار عمل React
    "react": "^19",                // مكتبة واجهات المستخدم
    "react-dom": "^19",            // DOM للـ React
    "@radix-ui/*": "latest",       // مكونات Radix
    "lucide-react": "latest",      // أيقونات
    "recharts": "latest",          // رسوم بيانية
    "tailwindcss": "^4.2.0",       // نظام التصميم
    "next-themes": "^0.4.6"        // دعم المظهر
  },
  
  "devDependencies": {
    "typescript": "5.7.3",         // اللغة الأساسية
    "tailwindcss": "^4.2.0",       // Build tool
    "postcss": "^8.5",             // CSS processor
    "@types/react": "^19",         // Types للـ React
    "@types/node": "^22"           // Types للـ Node
  }
}
```

---

## 🎨 نظام الألوان - معمارية

```
Design System
    ↓
app/globals.css
    ↓
    ├── :root (Light Mode)
    │   ├── --primary: #7C5CFF (البنفسجي)
    │   ├── --secondary: #39BDF8 (الأزرق)
    │   ├── --accent: #FFD166 (الأصفر)
    │   ├── --background: #FFF8EE (الكريمي)
    │   └── ... (16 متغير إضافي)
    │
    └── .dark (Dark Mode)
        ├── --primary: #9B7FFF
        ├── --secondary: #5CD4FF
        ├── --accent: #FFE599
        └── ... (16 متغير إضافي)
        ↓
Tailwind Utility Classes
    ├── bg-primary, text-primary, border-primary
    ├── bg-secondary, text-secondary, border-secondary
    ├── bg-accent, text-accent, border-accent
    └── ... (مئات المتغيرات)
```

---

## 🎬 نظام الحركات

```
CSS Animations (app/globals.css)
    ↓
@keyframes bounce-gentle { ... }
@keyframes scale-in { ... }
@keyframes pulse-glow { ... }
@keyframes shake-small { ... }
@keyframes stars-appear { ... }
@keyframes slide-up { ... }
@keyframes confetti-fall { ... }
    ↓
Utility Classes
    ├── animate-bounce-gentle
    ├── animate-scale-in
    ├── animate-pulse-glow
    ├── animate-shake-small
    ├── animate-stars
    ├── animate-slide-up
    └── animate-confetti
        ↓
Components (استخدام مباشر)
    ├── <Mascot /> ← animate-bounce-gentle
    ├── <Card /> ← animate-scale-in
    ├── <Button /> ← active:scale-95
    └── ... (مكونات أخرى)
```

---

## 🎮 نمط المشروع

### Client-Side Rendering
```tsx
'use client'  // جميع الشاشات هي مكونات Client

export function ScreenName() {
  const [state, setState] = useState()
  
  return <div>...</div>
}
```

### Server-Side Features (في المستقبل)
```
سيتم إضافة:
- API Routes (/app/api/...)
- Database Queries
- Authentication
- Backend Logic
```

---

## 📊 هيكل الشاشات

```
كل شاشة تتبع النمط:

┌─ ScreenName.tsx ─────────────────────┐
│                                       │
│ ├── 'use client'                      │
│ ├── Imports                           │
│ │   ├── React hooks                   │
│ │   ├── Components                    │
│ │   ├── DesignSystem                  │
│ │   └── Mascot                        │
│ │                                     │
│ ├── export function ScreenName()      │
│ │   ├── useState hooks                │
│ │   ├── JSX structure                 │
│ │   │   ├── Header                    │
│ │   │   ├── Main Content              │
│ │   │   └── Footer                    │
│ │   └── return (...)                  │
│                                       │
└───────────────────────────────────────┘
```

---

## 🔌 التوافقات والاتصالات

### محليّاً (Development):
```
Browser (localhost:3000)
    ↓ HTTP Request
Next.js Dev Server
    ↓ File Changes (Hot Reload)
Your Code Files
    ↓ Compilation
Browser (Re-render)
```

### في الإنتاج (Production):
```
Browser (vercel.app/user/project)
    ↓ HTTPS Request
Vercel Server (Edge Network)
    ↓
Static Files (.next)
    ↓
Browser (renders)
```

---

## 🧩 العلاقات بين المكونات

```
App Structure:
    
    app/layout.tsx (Root)
        ├── <html lang="ar" dir="rtl">
        │   └── <body>
        │       └── app/page.tsx
        │           ├── Navigation Buttons
        │           └── CurrentScreen
        │               ├── screens/Screen1.tsx
        │               ├── screens/Screen2.tsx
        │               ├── screens/Screen3.tsx
        │               ├── screens/Screen4.tsx
        │               ├── screens/Screen5.tsx
        │               ├── screens/Screen6.tsx
        │               ├── screens/Screen7.tsx
        │               ├── screens/Screen8.tsx
        │               ├── screens/Screen9.tsx
        │               └── screens/Screen10.tsx
        │                   ├── Mascot
        │                   ├── Button
        │                   ├── Card
        │                   ├── ProgressBar
        │                   ├── Badge
        │                   ├── Feedback
        │                   └── ... (مكونات أخرى)
```

---

## 📈 مسارات الملفات الشهيرة

```
البدء:
/app/layout.tsx         ← التخطيط الأساسي
/app/page.tsx           ← الصفحة الرئيسية
/app/globals.css        ← الأنماط

المكونات:
/components/Mascot.tsx
/components/DesignSystem.tsx
/components/screens/

الإعدادات:
/package.json           ← الحزم
/next.config.mjs        ← إعدادات Next.js
/tailwind.config.ts     ← إعدادات Tailwind
/tsconfig.json          ← إعدادات TypeScript

التوثيق:
/START_HERE.md          ← ابدأ من هنا
/README_AR.md           ← الدليل الكامل
/DESIGN_SYSTEM.md       ← نظام التصميم
/DEVELOPER_TIPS_AR.md   ← نصائح المطورين
```

---

## 🔀 مسارات الشاشات

عند النقر على زر:

```
User Clicks Button (Desktop)
    ↓
setCurrentScreen(screenId)
    ↓
State Updates (React)
    ↓
Re-render (page.tsx)
    ↓
Render Screen Component
    ↓
Browser Shows New Screen
    ↓ (with animations)
Smooth Transition
```

---

## 🗂️ تنظيم البيانات

```
State Management (ستُضاف لاحقاً):
    ├── User Data
    │   ├── Name
    │   ├── Level
    │   ├── Score
    │   └── Progress
    │
    ├── Game Data
    │   ├── Current Game
    │   ├── Questions
    │   ├── Answers
    │   └── Results
    │
    └── Parent Data
        ├── Child Info
        ├── Statistics
        ├── Activities
        └── Achievements
```

---

## 🎯 الملفات التي قد تعدّل في المستقبل

```
للتطوير الإضافي:

1. إضافة قاعدة بيانات:
   /app/api/                    ← Route Handlers
   /lib/db.ts                   ← Database Connection
   /models/                     ← Data Models

2. إضافة المصادقة:
   /app/auth/                   ← Auth Routes
   /lib/auth.ts                 ← Auth Logic
   /middleware.ts               ← Auth Middleware

3. إضافة منطق اللعبة:
   /lib/games/                  ← Game Logic
   /lib/scoring.ts              ← Scoring System
   /lib/progress.ts             ← Progress Tracking

4. إضافة API:
   /app/api/games/              ← Game APIs
   /app/api/users/              ← User APIs
   /app/api/progress/           ← Progress APIs
```

---

## 🌐 البيئات

```
Development:
    localhost:3000
    pnpm dev
    Hot Reload ✅
    Source Maps ✅
    Console Logs ✅

Production:
    yourdomain.com
    pnpm build && pnpm start
    Optimized ✅
    Minified ✅
    No Console Logs
```

---

## ✅ مقائمة المراجعة المعمارية

- ✅ هيكل المشروع منظم وواضح
- ✅ المكونات قابلة لإعادة الاستخدام
- ✅ الملفات منفصلة ومنظمة حسب الوظيفة
- ✅ الأنماط مركزية في globals.css
- ✅ الحركات معرّفة بشكل منظم
- ✅ التوثيق شامل
- ✅ معايير TypeScript مطبقة
- ✅ RTL مدعوم بالكامل
- ✅ متوافق مع الأجهزة المختلفة
- ✅ جاهز للتطوير الإضافي

---

## 🚀 الخطوات التالية للمطورين

1. **فهم البنية**: اقرأ هذا الملف
2. **استكشاف الملفات**: افتح الملفات وادرس الكود
3. **اختبار المشروع**: `pnpm dev` و تفاعل مع الشاشات
4. **دراسة المكونات**: افهم كيفية عمل المكونات
5. **إضافة ميزات جديدة**: ابدأ بإضافة شاشات ولعب جديدة
6. **الربط بقاعدة البيانات**: أضف backend عند الحاجة

---

**آخر تحديث**: أبريل 2026
**الإصدار**: 1.0
