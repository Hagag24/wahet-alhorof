# تقرير تشخيص خطأ IISNode 1013

## 1. معنى خطأ 1013

### الخطأ:
```
HRESULT: 0x6d
HTTP subStatus: 1013
```

### المعنى:
IISNode **شغّل** عملية Node.js، ولكن:
- العملية لم تستجيب على named pipe
- أو خرجت بصمت (silent exit)
- أو فيها error لم يُعرض

### لماذا لا يظهر Exception:
الـ stderr يظهر فقط:
```
DeprecationWarning: Buffer() is deprecated
```

لكن لا يوجد uncaught exception واضح.

### الأسباب المحتملة:
1. التطبيق لم يستدعِ `listen()` على `process.env.PORT`
2. الـ Backend bundle لم يُبنى بالتعديلات الجديدة
3. حدوث error قبل `listen()` ولكن بعد `import`
4. الـ API bundle يُنشئ server منفصل ويستمع على port مختلف

---

## 2. لماذا لا يظهر Exception واضح

### المشكلة:
- `console.log` يذهب إلى stdout
- IISNode يظهر stderr فقط بشكل واضح
- الأخطاء قد تكون في stdout ولا تُرى

### الحل:
استخدم `console.error` لكل شيء:
```javascript
console.error("[MonsterASP/IISNode] Booting...");
console.error("[MonsterASP/IISNode] PORT:", process.env.PORT);
```

---

## 3. هل Smoke Server يعمل؟

### الملف: `server-smoke.cjs`

هذا ملف اختبار بسيط:
- لا يحتاج Express
- يحتاج فقط `http` module
- يُظهر إذا كانت IISNode تعمل

### كيفية الاستخدام:

**1. عدّل `web.config` مؤقتاً:**
```xml
<add name="iisnode" path="server-smoke.cjs" ... />
```

**2. ارفع الملفات:**
- `server-smoke.cjs`
- `web.config` (المُحدّث)

**3. شغّل التطبيق**

**4. اختبر:**
```
https://yourdomain.runasp.net/
```

### النتائج المتوقعة:

| الحالة | النتيجة | المعنى |
|--------|---------|--------|
| ✅ JSON response | Smoke server يعمل | IISNode و web.config صحيحة |
| ❌ 1013 error | Smoke server لا يعمل | المشكلة في IISNode أو web.config |

### إذا عمل Smoke Server:
المشكلة في `server.cjs` أو الـ API bundle.

### إذا لم يعمل:
المشكلة في MonsterASP Node.js setup أو web.config.

---

## 4. هل المشكلة من IISNode أم من التطبيق؟

### اختبار Smoke Server:

```bash
# إذا عمل Smoke Server → IISNode OK
# إذا لم يعمل → IISNode/Config problem
```

### إذا كان IISNode OK:
المشكلة في:
1. `server.cjs`
2. الـ API bundle
3. `process.env.PORT`

---

## 5. هل التطبيق يستمع على process.env.PORT؟

### المطلوب في Backend Source:

```typescript
const rawPort = process.env.PORT || "3000";

const isIisNodePipe =
  rawPort.startsWith("\\.\pipe\\") ||
  rawPort.startsWith("\\.\pipe/");

const listenTarget = isIisNodePipe ? rawPort : Number.parseInt(rawPort, 10);

app.listen(listenTarget, () => {
  console.error("[API] listening on", 
    typeof listenTarget === "string" ? "named pipe" : "port " + listenTarget);
});
```

### ⚠️ مهم جداً:
- **لا** تُعيد تعريف `process.env.PORT`
- **لا** تفرض `3000` على MonsterASP
- استخدم `process.env.PORT` كما هو (قد يكون named pipe)

---

## 6. هل الـ bundle المرفوع حديث؟

### التحقق:
ابحث في `api/index.mjs` عن:
```
IISNode named pipe
Detected.*named.*pipe
listenTarget
```

### إذا لم تجده:
الـ Bundle قديم ويحتاج إعادة بناء:
```bash
cd artifacts/api-server
npm run build
```

ثم انسخ إلى `monster-deploy/api/`.

---

## 7. الملفات التي تم تعديلها

### ملفات جديدة للتشخيص:

| الملف | الغرض |
|-------|-------|
| `server-smoke.cjs` | اختبار IISNode بسيط |
| `server-diagnostic.cjs` | نسخة مفصلة مع logs |

### ملفات مُحدّثة:

| الملف | التغيير |
|-------|---------|
| `server.cjs` | إضافة error handlers و logs |

---

## 8. خطوات إعادة الرفع

### الخطة المقترحة:

**الخطوة 1: اختبار Smoke Server**

1. عدّل `web.config`:
   ```xml
   path="server-smoke.cjs"
   ```

2. ارفع:
   - `server-smoke.cjs`
   - `web.config`

3. شغّل واختبر `/`

4. إذا عمل → انتقل للخطوة 2

**الخطوة 2: اختبار Diagnostic Server**

1. عدّل `web.config`:
   ```xml
   path="server-diagnostic.cjs"
   ```

2. ارفع:
   - `server-diagnostic.cjs`
   - `web.config`

3. شغّل واختبر:
   - `/`
   - `/api/health`

**الخطوة 3: الرفع النهائي**

1. عدّل `web.config`:
   ```xml
   path="server.cjs"
   ```

2. ارفع كل الملفات النهائية

---

## 9. اختبارات بعد الرفع

### قائمة التحقق:

| # | الاختبار | الرابط | النتيجة |
|---|----------|--------|---------|
| 1 | Smoke test | `/` | JSON |
| 2 | Diagnostic | `/api/health` | JSON مع "diagnostic": true |
| 3 | Production | `/api/health` | JSON من API |
| 4 | Frontend | `/` | Website |
| 5 | Admin | `/admin` | Login page |

### الأخطاء التي يجب عدم رؤيتها:

```
❌ 1013
❌ 0x6d
❌ uncaughtException
❌ Cannot find module
```

---

## 10. القرار النهائي

### ✅ الخطوات التشخيصية جاهزة

تم إنشاء:
1. `server-smoke.cjs` - اختبار بسيط
2. `server-diagnostic.cjs` - تشخيص مفصل
3. تقرير شامل للخطوات

### 🔧 إذا استمر الخطأ:

**الأولوية:**
1. شغّل `server-smoke.cjs` أولاً
2. إذا فشل → المشكلة في MonsterASP/IISNode
3. إذا نجح → المشكلة في `server.cjs` أو API bundle

### ⚠️ تحقق من الـ Bundle:
```bash
grep -n "named pipe" monster-deploy/api/index.mjs
```

إذا لم تجد شيئاً → أعد بناء الـ Backend.

---

## ملخص سريع

| الخطوة | الملف | الهدف |
|--------|-------|-------|
| 1 | `server-smoke.cjs` | التأكد من IISNode |
| 2 | `server-diagnostic.cjs` | التشخيص المفصل |
| 3 | `server.cjs` النهائي | الإنتاج |

---

*تم التشخيص: يونيو 2026*
*الحالة: جاهز للاختبار التدريجي*
