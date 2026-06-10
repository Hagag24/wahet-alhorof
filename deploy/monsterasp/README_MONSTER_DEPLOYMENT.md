# دليل نشر موقع الجامعة على MonsterASP.NET

## 1. ما هو MonsterASP.NET؟

MonsterASP.NET هو استضافة ويب تستخدم IIS/IISNode لتشغيل تطبيقات Node.js على خوادم Windows.

## 2. الملفات المطلوبة في wwwroot

```
wwwroot/
├── web.config          (إعدادات IISNode)
├── server.cjs          (ملف الدخول الرئيسي)
├── server-smoke.cjs    (للاختبار - اختياري)
├── package.json        (تبعيات npm)
├── api/
│   └── index.mjs       (الـ Backend المبني)
├── public/
│   ├── index.html      (الواجهة الأمامية)
│   ├── assets/         (CSS, JS, الصور)
│   └── uploads/        (ملفات مرفوعة - فارغ في البداية)
├── App_Data/           (قاعدة البيانات - فارغ في البداية)
└── .env                (متغيرات البيئة - أنشئه يدوياً)
```

## 3. خطوات النشر

### الخطوة 1: إنشاء حزمة النشر

افتح PowerShell وشغل:

```powershell
cd C:\Users\Mohamed Hagag\Desktop\EUST.uk-Official-Website-main\EUST.uk-Official-Website-main
powershell -ExecutionPolicy Bypass -File scripts\prepare-monster-deploy.ps1
```

### الخطوة 2: رفع الملفات

1. ادخل إلى MonsterASP Control Panel
2. افتح File Manager
3. ارفع محتويات `dist-monster/` (ليس المجلد نفسه، بل محتوياته) إلى `wwwroot/`

### الخطوة 3: تثبيت التبعيات

في MonsterASP Control Panel:

1. اذهب إلى "Node.js"
2. تأكد من أن الإصدار 18.x أو أحدث
3. اضغط "Install npm packages" أو افتح Terminal وشغل:

```bash
npm install --omit=dev
```

### الخطوة 4: إنشاء ملف .env

في `wwwroot/`، أنشئ ملف `.env`:

```env
NODE_ENV=production
DATABASE_URL=file:./App_Data/db.sqlite
AUTH_TOKEN_SECRET=your-secret-key-here-change-this
VITE_API_BASE_URL=
```

⚠️ **غيّر AUTH_TOKEN_SECRET لكلمة سر عشوائية!**

### الخطوة 5: اختبار Smoke Server (موصى به)

قبل تشغيل التطبيق الحقيقي، جرب Smoke Server للتأكد من أن IISNode يعمل:

في `web.config`، غيّر:
```xml
path="server.cjs"
```
إلى:
```xml
path="server-smoke.cjs"
```

في قاعدة Rewrite أيضاً:
```xml
<action type="Rewrite" url="server-smoke.cjs" />
```

اضغط Restart، ثم افتح:
```
https://yourdomain.runasp.net/
```

**المفروض يظهر JSON:**
```json
{
  "ok": true,
  "message": "Monster IISNode smoke server is working"
}
```

إذا ظهر JSON، ارجع `web.config` إلى `server.cjs`.

### الخطوة 6: تشغيل التطبيق الحقيقي

1. تأكد أن `web.config` يشاور على `server.cjs`
2. اضغط Restart
3. انتظر 30 ثانية

### الخطوة 7: الاختبار

افتح هذه الروابط:

| الرابط | النتيجة المتوقعة |
|--------|------------------|
| `/` | صفحة الجامعة |
| `/api/health` | `{"ok": true}` |
| `/admin` | صفحة تسجيل الدخول |
| `/programs` | صفحة البرامج |
| `/sitemap.xml` | خريطة الموقع |

### بيانات الدخول الافتراضية

- **Email:** `admin@university.edu`
- **Password:** `admin123`

⚠️ **غيّر كلمة المرور فوراً بعد أول تسجيل دخول!**

## 4. الأخطاء الشائعة وحلها

### خطأ: Cannot find package 'express'

**الحل:**
```bash
npm install --omit=dev
```

### خطأ: ERR_REQUIRE_ASYNC_MODULE

**الحل:** `web.config` يجب أن يشاور على `server.cjs` (CommonJS) وليس `server.js` (ESM).

### خطأ: Unable to open connection to local database

**الحل:** تأكد أن `DATABASE_URL` يستخدم مسار مطلق أو `file:./App_Data/db.sqlite`.

### خطأ: Invalid PORT value: "\\.\pipe\..."

**الحل:** تأكد أن الـ Backend يدعم named pipes (تم إصلاحه في الكود المصدر).

### خطأ: 1013

**الحل:**
1. تحقق من Logs في MonsterASP
2. جرب Smoke Server أولاً
3. تأكد من أن `process.env.PORT` لا يُعاد تعريفه

### خطأ: 404 على جميع الصفحات

**الحل:** تأكد أن `web.config` موجود ويحتوي على rewrite rules.

## 5. النسخ الاحتياطي

### قاعدة البيانات
```
wwwroot/App_Data/db.sqlite
```
### الملفات المرفوعة
```
wwwroot/public/uploads/
```

## 6. ملاحظات مهمة

- لا تشغل `seed` في الإنتاج إلا إذا كنت متأكداً
- احتفظ بنسخة من `web.config` قبل أي تعديل
- لا تُعدل ملفات التطبيق مباشرة في المنتج، عدّل في localhost ثم أعد الرفع

---

**تاريخ الإعداد:** يونيو 2026
**الإصدار:** 1.0.0
