# تقرير إصلاح خطأ IISNode مع ESM Modules

## 1. سبب الخطأ

### الخطأ:
```
ERR_REQUIRE_ASYNC_MODULE: require() cannot be used on an ESM graph with top-level await
```

### ما حدث:
IISNode (إضافة IIS لتشغيل Node.js) تستخدم دالة `require()` من CommonJS لتحميل ملف الدخول (entry point).

لكن ملف `server.js` كان يستخدم:
- `import` statements (ESM syntax)
- Top-level `await` على السطر 14: `const apiModule = await import('./api/index.mjs');`

### لماذا هذا يُسبب مشكلة:
- CommonJS `require()` لا يدعم ESM modules مباشرة
- Top-level await غير مدعوم في CommonJS
- IISNode مصمم للعمل مع CommonJS بشكل افتراضي

---

## 2. لماذا server.js فشل مع IISNode

### محتوى server.js (المشكلة):
```javascript
// ESM imports - NOT supported by require()
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Top-level await - NOT supported in CommonJS
const apiModule = await import('./api/index.mjs');
```

### ما يفعله IISNode:
```javascript
// IISNode internally does:
const app = require('server.js');  // ❌ FAILS with ESM
```

### النتيجة:
IISNode لا يستطيع تحميل `server.js` لأنه يحتوي على:
1. `import` statements (ESM syntax)
2. Top-level `await`
3. `export default` (ESM export)

---

## 3. ما تم تغييره

### الحل: CommonJS Bridge Pattern

بدلاً من أن يحاول IISNode تحميل `server.js` مباشرة، نُنشئ ملف وسيط:

**`server.cjs`** - CommonJS Entry Point:
```javascript
// CommonJS syntax - supported by IISNode require()
const path = require("path");
const { pathToFileURL } = require("url");

// Dynamically import the ESM module
const serverPath = path.join(__dirname, "server.js");
const serverUrl = pathToFileURL(serverPath).href;

// This works because dynamic import() can load ESM
import(serverUrl)
  .then((module) => {
    console.log("ESM server loaded successfully");
  })
  .catch((error) => {
    console.error("Failed to load ESM server:", error);
    process.exit(1);
  });
```

### لماذا هذا الحل يعمل:

| الجانب | CommonJS (server.cjs) | ESM (server.js) |
|--------|-------------------------|-----------------|
| IISNode `require()` | ✅ يعمل | ❌ يفشل |
| `import()` dynamic | ✅ يعمل | ✅ يعمل |
| Top-level await | ❌ غير موجود | ✅ موجود داخلياً |

### سير العمل:
```
IISNode → require('server.cjs') [CommonJS ✅]
            ↓
        import('server.js') [Dynamic ESM ✅]
            ↓
        Server.js loads with top-level await [ESM ✅]
            ↓
        Express app starts
```

---

## 4. الملفات التي تم تعديلها

### الملف الجديد: `server.cjs`
**الموقع:** `monster-deploy/server.cjs`

**الوظيفة:**
- CommonJS bridge entry point
- يستخدم `require()` المتوافق مع IISNode
- يستورد `server.js` ديناميكياً عبر `import()`
- يعالج الأخطاء ويسجلها

### الملف المُحدّث: `web.config`
**الموقع:** `monster-deploy/web.config`

**التغييرات:**
```xml
<!-- قبل -->
<add name="iisnode" path="server.js" ... />

<!-- بعد -->
<add name="iisnode" path="server.cjs" ... />
```

وتحديث جميع rewrite rules:
- `server.js/api/{R:1}` → `server.cjs/api/{R:1}`
- `server.js/uploads/{R:1}` → `server.cjs/uploads/{R:1}`
- `server.js` → `server.cjs`

### لماذا `.cjs` extension:
- يُخبر Node.js بوضوح أن هذا CommonJS
- يعمل حتى لو `package.json` تحتوي على `"type": "module"`
- يضمن التوافق مع IISNode

---

## 5. خطوات إعادة الرفع على Monster

### الخطوات المُحدّثة:

1. **احذف الملفات القديمة من wwwroot:**
   ```
   server.js  (القديم - إذا كان هناك)
   web.config (القديم)
   ```

2. **ارفع الملفات الجديدة:**
   ```
   server.cjs          ← NEW - IISNode entry
   server.js           ← ESM server (يُستورد من server.cjs)
   web.config          ← UPDATED - يشير إلى server.cjs
   ```

3. **تأكد من وجود:**
   ```
   node_modules/       ← يجب أن يكون مُثبتاً
   api/index.mjs       ← Backend build
   ```

4. **اضبط Entry Point في MonsterASP Control Panel:**
   - القيمة الجديدة: `server.cjs`
   - وليس: `server.js`

5. **شغّل التطبيق:**
   - اضغط Start/Restart في Control Panel

6. **تحقق من logs:**
   ```
   logs/
   └── iisnode/...
   ```

---

## 6. اختبارات بعد الرفع

### قائمة التحقق:

| الاختبار | المسار | النتيجة المتوقعة |
|----------|--------|------------------|
| ✅ IISNode يبدأ | - | لا يوجد خطأ `ERR_REQUIRE_ASYNC_MODULE` |
| ✅ Bridge يعمل | - | Log: "ESM server loaded successfully" |
| ✅ الموقع يعمل | `/` | يظهر Frontend |
| ✅ API يعمل | `/api/health` | JSON response |
| ✅ Admin يعمل | `/admin` | صفحة تسجيل الدخول |
| ✅ صفحات SPA | `/about` | يعمل fallback |

### الأخطاء التي يجب عدم رؤيتها:

```
❌ ERR_REQUIRE_ASYNC_MODULE
❌ Cannot find module 'server.cjs'
❌ Cannot find module './api/index.mjs'
```

### الأخطاء المقبولة (إذا حدثت):

```
⚠️ Database not found - will create on first run
⚠️ Missing environment variable (يُصلح بإضافة .env)
```

---

## 7. القرار النهائي

### ✅ المشكلة مُحلّلة

تم إصلاح خطأ `ERR_REQUIRE_ASYNC_ASYNC_MODULE` عبر:

1. **إنشاء `server.cjs`** - CommonJS bridge
2. **تحديث `web.config`** - يشير إلى `server.cjs`
3. **الحفاظ على `server.js`** - لا تغيير في منطق التطبيق

### 🔒 لم يتم تغيير:
- ❌ منطق API backend
- ❌ منطق Frontend
- ❌ ملفات VPS deployment
- ❌ package.json ("type": "module" ما زال موجود)

### ✅ ما تم تغييره فقط:
- `server.cjs` جديد (IISNode entry)
- `web.config` محدّث (يستخدم server.cjs)

---

## ملخص تقني

| الملف | الدور | IISNode |
|-------|-------|---------|
| `server.cjs` | CommonJS Bridge | ✅ `require()` يعمل |
| `server.js` | ESM Application | ✅ يُستورد ديناميكياً |

الحل يحافظ على:
- ✅ كود ESM نظيف في `server.js`
- ✅ توافق IISNode عبر `server.cjs`
- ✅ عدم تعديل business logic

---

*تم الإصلاح: يونيو 2026*
*الحالة: جاهز للرفع على MonsterASP.NET*
