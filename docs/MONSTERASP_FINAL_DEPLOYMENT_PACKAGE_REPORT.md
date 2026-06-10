# تقرير حزمة نشر MonsterASP.NET النهائية

## 1. الملخص التنفيذي

تم إنشاء حزمة نشر كاملة لـ MonsterASP.NET في مجلد `dist-monster/`.

**الحالة:** ✅ جاهزة مع فحص يدوي مطلوب

---

## 2. هدف حزمة Monster

نشر موقع الجامعة الإلكتروني (React + Express + SQLite) على استضافة MonsterASP.NET بدلاً من VPS.

**مميزات MonsterASP:**
- استضافة مجانية/رخيصة
- دعم Node.js عبر IISNode
- قاعدة بيانات SQLite محلية
- لا حاجة لـ PM2 أو Nginx

---

## 3. الملفات التي سيتم رفعها إلى wwwroot

```
dist-monster/
├── web.config              ✅ (إعدادات IISNode)
├── server.cjs              ✅ (CommonJS entry)
├── server-smoke.cjs        ✅ (للاختبار)
├── package.json            ✅ (تبعيات npm)
├── api/
│   └── index.mjs           ⚠️ (يتطلب نسخ يدوي من artifacts/api-server/dist/)
├── public/
│   ├── index.html          ⚠️ (يتطلب نسخ من artifacts/university/dist/public/)
│   ├── assets/             ⚠️ (يتطلب نسخ)
│   └── uploads/            ✅ (مجلد فارغ)
├── App_Data/               ✅ (مجلد فارغ)
├── .env.example            ✅ (قالب)
└── README_MONSTER_DEPLOYMENT.md ✅ (دليل)
```

---

## 4. دور server.cjs

**الوظيفة:** CommonJS bridge بين IISNode والـ Backend ESM

**ما يفعله:**
1. يُنشئ مجلدات `App_Data/` و `public/uploads/`
2. يضبط `DATABASE_URL` قبل تحميل الـ API
3. **لا يُعيد تعريف** `process.env.PORT` (يتركه لـ IISNode)
4. يحمل الـ Backend bundle عبر `import()` ديناميكيًا

**لماذا CommonJS:**
- IISNode لا يدعم ESM مباشرة
- `require()` يعمل دائمًا
- `import()` الديناميكي يسمح بتحميل ESM

---

## 5. دور server-smoke.cjs

**الوظيفة:** اختبار بسيط لـ IISNode بدون Express أو Database

**استخدامه:**
1. اختبار أولي للتأكد من أن MonsterASP يعمل
2. عزل المشاكل (هل المشكلة في IISNode أم في التطبيق؟)
3. يُرجع JSON بسيط

**كيفية الاستخدام:**
1. عدّل `web.config` ليشاور على `server-smoke.cjs`
2. اضغط Restart
3. افتح `/` → يجب أن يظهر JSON
4. إذا نجح، ارجع إلى `server.cjs`

---

## 6. دور web.config

**الوظيفة:** ربط IISNode بـ Node.js

**المكونات:**
1. **Handler:** يُخبر IIS بأن `server.cjs` يُشغَّل بواسطة IISNode
2. **Rewrite Rules:** توجيه الطلبات:
   - الملفات الثابتة → تُخدم مباشرة
   - الطلبات الأخرى → تذهب إلى `server.cjs`

**التبديل لـ Smoke Test:**
```xml
<!-- تغيير في Handler -->
<add name="iisnode" path="server-smoke.cjs" ... />

<!-- تغيير في Rewrite -->
<action type="Rewrite" url="server-smoke.cjs" />
```

---

## 7. مسار قاعدة البيانات SQLite

**المسار:** `App_Data/db.sqlite`

**لماذا `App_Data`:**
- مجلد خاص في IIS محمي من الوصول الخارجي
- يُحتفظ به عند إعادة النشر
- لا يُحذف تلقائيًا

**الإعداد:**
```env
DATABASE_URL=file:./App_Data/db.sqlite
```

**النسخ الاحتياطي:**
- قم بنسخ `App_Data/db.sqlite` قبل أي تحديث

---

## 8. مسار uploads

**المسار:** `public/uploads/`

**الحماية:**
- المجلد `public/` يُخدم كـ static files
- `uploads/` داخله يحتوي على الملفات المرفوعة
- يجب إنشاء `.gitkeep` للحفاظ على المجلد

**النسخ الاحتياطي:**
- قم بنسخ `public/uploads/` قبل أي تحديث

---

## 9. دعم IISNode named pipe PORT

**المشكلة التي تم حلها:**
IISNode يُعطي `PORT` كـ named pipe مثل `\\.\pipe\xxxx` بدلاً من رقم.

**الحل في `index.ts`:**
```typescript
const isIisNodePipe =
  rawPort.startsWith("\\.\pipe\\") ||
  rawPort.startsWith("\\.\pipe/");

if (isIisNodePipe) {
  listenTarget = rawPort;  // استخدم كـ string
} else {
  listenTarget = Number.parseInt(rawPort, 10);  // رقم عادي
}
```

**الحالة:** ✅ مُطبق في الكود المصدر

---

## 10. إصلاح Express 5 wildcard

**المشكلة:** Express 5 لا يقبل `app.get("*", ...)`

**الحل:** استخدام `app.use()` بدون path

**الحالة:** ✅ Backend لا يحتوي على wildcard routes
- الـ API routes مُعرفة بـ `app.use("/api", router)`
- SPA fallback يكون في `server.cjs` أو يُدار عبر `web.config`

---

## 11. طريقة إنشاء dist-monster

### يدوياً (بما أن الملفات مبنية):

```bash
# Frontend محفوظ في:
artifacts/university/dist/public/

# Backend محفوظ في:
artifacts/api-server/dist/index.mjs
```

### الخطوات:
1. أنشئ `dist-monster/` (تم)
2. انسخ `server.cjs`, `web.config`, `package.json` (تم)
3. **انسخ يدوياً:**
   - `artifacts/api-server/dist/index.mjs` → `dist-monster/api/`
   - `artifacts/university/dist/public/*` → `dist-monster/public/`
4. أنشئ `.env` من `.env.example`

### أو استخدم PowerShell Script:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\prepare-monster-deploy.ps1
```

**ملاحظة:** الملفات المبنية (`dist/`) في `.gitignore` ولا تُنسخ تلقائيًا.

---

## 12. طريقة الرفع إلى Monster

### الخطوة 1: إعداد
- ادخل إلى MonsterASP Control Panel
- اذهب إلى File Manager
- تأكد من أن Node.js ≥ 18.x

### الخطوة 2: الرفع
- ارفع **محتويات** `dist-monster/` (ليس المجلد نفسه)
- إلى `wwwroot/`

### الخطوة 3: npm install
- في Control Panel → Node.js
- اضغط "Install npm packages"
- أو شغل في Terminal:
  ```bash
  npm install --omit=dev
  ```

### الخطوة 4: .env
- أنشئ ملف `.env` في `wwwroot/`
- املأ القيم المطلوبة

### الخطوة 5: Restart
- اضغط Restart
- انتظر 30 ثانية

---

## 13. أوامر ما بعد الرفع

```bash
# تثبيت التبعيات (دون devDependencies)
npm install --omit=dev

# إنشاء ملف البيئة
cp .env.example .env

# اختبار API
curl https://yourdomain.runasp.net/api/health
```

---

## 14. اختبارات بعد الرفع

| # | الاختبار | الأمر/الرابط | النتيجة المتوقعة |
|---|----------|--------------|------------------|
| 1 | Smoke Test | `/` | JSON: `{"ok": true}` |
| 2 | API Health | `/api/health` | `{"ok": true}` |
| 3 | Frontend | `/` | صفحة HTML |
| 4 | Admin | `/admin` | صفحة تسجيل الدخول |
| 5 | Static | `/assets/main.js` | ملف JavaScript |
| 6 | Sitemap | `/sitemap.xml` | XML |

### بيانات الدخول:
- **Email:** `admin@university.edu`
- **Password:** `admin123`

---

## 15. الأخطاء الشائعة وحلها

| الخطأ | السبب | الحل |
|-------|-------|------|
| `Cannot find package 'express'` | npm install غير مكتمل | شغل `npm install --omit=dev` |
| `ERR_REQUIRE_ASYNC_MODULE` | web.config يشاور على ESM | تأكد من `server.cjs` (CommonJS) |
| `Unable to open connection` | مسار SQLite غلط | تأكد من `DATABASE_URL` |
| `Invalid PORT value` | Backend لا يدعم named pipe | الكود مُصلح، أعد البناء |
| `Missing parameter name at index 1: *` | Express 5 wildcard | لا تستخدم `app.get("*")` |
| `1013` | IISNode لم يستلم رد | جرب Smoke Server أولاً |
| `404` على كل شيء | `web.config` ناقص أو غلط | أعد رفع `web.config` |

---

## 16. القرار النهائي

### ✅ Monster Deployment Package Ready with manual checks

**ما هو جاهز:**
- ✅ `server.cjs` (CommonJS bridge)
- ✅ `server-smoke.cjs` (اختبار)
- ✅ `web.config` (IISNode config)
- ✅ `package.json` (تبعيات)
- ✅ README (دليل عربي كامل)
- ✅ `.env.example` (قالب)

**ما يحتاج فحص/نسخ يدوي:**
- ⚠️ `api/index.mjs` → انسخ من `artifacts/api-server/dist/`
- ⚠️ `public/*` → انسخ من `artifacts/university/dist/public/`

**الخطوات النهائية للمستخدم:**
1. نسخ `index.mjs` إلى `dist-monster/api/`
2. نسخ ملفات Frontend إلى `dist-monster/public/`
3. رفع `dist-monster/` إلى `wwwroot/`
4. `npm install --omit=dev`
5. إنشاء `.env`
6. Restart

---

## ملخص تنفيذي

| المكون | الحالة |
|--------|--------|
| Backend PORT handling | ✅ صحيح (يدعم named pipes) |
| Express 5 wildcard | ✅ لا يوجد مشكلة |
| server.cjs | ✅ جاهز |
| web.config | ✅ جاهز |
| حزمة كاملة | ⚠️ جاهزة مع نسخ يدوي للـ bundles |

**الموقع:** `C:\Users\Mohamed Hagag\Desktop\EUST.uk-Official-Website-main\EUST.uk-Official-Website-main\dist-monster\`

---

*تم الإعداد: يونيو 2026*
*الإصدار: 1.0.0*
