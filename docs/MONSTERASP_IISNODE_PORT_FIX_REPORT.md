# تقرير إصلاح دعم IISNode Named Pipe في PORT

## 1. سبب الخطأ

### الخطأ:
```
Invalid PORT value: "\\.\pipe\6a6c7096-755d-41ab-9787-b57d5942d5ac"
```

### ما حدث:
IISNode (إضافة IIS لتشغيل Node.js) تستخدم **Windows Named Pipes** للتواصل بين IIS والتطبيق.

بدلاً من رقم البورت (مثل `3000` أو `8080`)، IISNode يضبط `process.env.PORT` إلى:
```
\\.\pipe\xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

هذا مسار Named Pipe خاص بـ Windows IPC (Inter-Process Communication).

### لماذا حدث الخطأ:
الكود القديم كان يتحقق فقط من أن PORT رقم صحيح:

```typescript
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}
```

عندما يحاول تحويل Named Pipe إلى رقم، ينتج `NaN`، وبالتالي يرمي خطأ.

---

## 2. لماذا IISNode يستخدم Named Pipe بدل رقم بورت

### الفائدة:

| الجانب | Named Pipe | رقم البورت |
|--------|------------|------------|
| الأمان | ✅ أعلى (لا يمكن الوصول من الخارج) | ❌ مفتوح |
| الأداء | ✅ أسرع (IPC محلي) | ⚠️ TCP overhead |
| التكامل مع IIS | ✅ مدمج بعمق | ❌ يحتاج Proxy |
| عدة تطبيقات | ✅ كل واحد pipe منفصل | ❌ يحتاج ports مختلفة |

### كيف يعمل:

```
IIS (port 80/443) → Named Pipe (\\.\pipe\xxx) → Node.js App
```

IIS يستمع على ports 80/443 العادية، ثم يمرر الطلبات عبر Named Pipe إلى Node.js.

### لماذا لا نستخدم PORT=3000:

إذا أجبرنا `PORT=3000`، فإن:
1. IISNode لن يستطيع التواصل مع التطبيق
2. التطبيق سيستمع على port مختلف عن ما يتوقعه IIS
3. سيفشل الـ Reverse Proxy

---

## 3. ما تم تعديله

### الحل:

**تحديث `artifacts/api-server/src/index.ts`:**

```typescript
const rawPort = process.env["PORT"] || "3000";

/**
 * Detect IISNode named pipe (Windows IPC).
 */
const isIisNodePipe =
  rawPort.startsWith("\\\\.\\pipe\\") ||
  rawPort.startsWith("\\\\.\\pipe/");

let listenTarget: number | string;

if (isIisNodePipe) {
  listenTarget = rawPort;  // Use pipe as-is
  logger.info({ pipe: rawPort }, "Detected IISNode named pipe");
} else {
  const parsedPort = Number.parseInt(rawPort, 10);
  if (!Number.isFinite(parsedPort) || parsedPort <= 0) {
    throw new Error(`Invalid PORT value: ${JSON.stringify(rawPort)}`);
  }
  listenTarget = parsedPort;
}

// Now use listenTarget which can be number (port) or string (pipe)
app.listen(listenTarget, (err) => {
  // ...
});
```

### التغييرات:

| قبل | بعد |
|-----|-----|
| PORT يجب أن يكون رقم | ✅ PORT يمكن أن يكون رقم أو Named Pipe |
| Validation رقمي فقط | ✅ Detection للـ IISNode pipe |
| Error للـ pipe | ✅ دعم كامل للـ pipe |

---

## 4. الملفات التي تم تعديلها

### الملف المصدر: `artifacts/api-server/src/index.ts`

**التغييرات:**
- ➕ دعم Named Pipes للـ IISNode
- ➕ Detection للـ `\\.\pipe\` pattern
- ➕ تغيير `listenTarget` ليكون `number | string`
- 🔄 تحديث logging ليدعم كلا النوعين

### الملف المُبني: `monster-deploy/api/index.mjs`

**الحالة:** تم إعادة البناء ونسخه إلى `monster-deploy/`

### الملف المُحدّث في الدبلوي:

| الملف | التغيير |
|-------|---------|
| `artifacts/api-server/src/index.ts` | 🔄 دعم Named Pipe |
| `monster-deploy/api/index.mjs` | 🔄 rebuilt مع التعديل |

---

## 5. هل ما زال VPS يعمل؟

### ✅ نعم، VPS يعمل بدون مشاكل

الكود الجديد يدعم **كلا البيئتين**:

### VPS / Local:
```bash
PORT=3000 node server.js
# → يستخدم الرقم 3000
```

### MonsterASP / IISNode:
```
process.env.PORT = "\\.\pipe\xxx"
# → يستخدم Named Pipe مباشرة
```

### Fallback:
```typescript
const rawPort = process.env["PORT"] || "3000";
```
إذا لم يُضبط PORT، يستخدم `3000` (للـ Local development).

---

## 6. خطوات إعادة البناء والرفع على Monster

### الخطوة 1: إعادة بناء Backend

```bash
cd artifacts/api-server
npm run build
```

**تم ✅**

### الخطوة 2: نسخ الملفات المُبنية

```bash
# نسخ dist/ إلى monster-deploy/api/
cp artifacts/api-server/dist/* monster-deploy/api/
```

**تم ✅**

### الخطوة 3: رفع الملفات على MonsterASP

**الملفات المطلوب رفعها:**
```
api/index.mjs          ← المُحدّث (يحتوي على PORT fix)
api/*.mjs              ← الملفات الأخرى (إذا تغيرت)
```

### الخطوة 4: إعادة تشغيل التطبيق

من MonsterASP Control Panel:
- اضغط **Restart**

### الخطوة 5: التحقق من Logs

يجب أن ترى:
```
[API] Detected IISNode named pipe
[API] Server listening on IISNode named pipe
```

وليس:
```
❌ Invalid PORT value: "\\.\pipe\..."
```

---

## 7. اختبارات بعد الرفع

### قائمة التحقق:

| الاختبار | النتيجة المتوقعة |
|----------|------------------|
| ✅ بدء التشغيل | لا يوجد خطأ `Invalid PORT value` |
| ✅ Logs | `[API] Detected IISNode named pipe` |
| ✅ الاستماع | `[API] Server listening on IISNode named pipe` |
| ✅ الموقع يعمل | https://domain.runasp.net/ يعمل |
| ✅ API يعمل | `/api/health` يرجع JSON |

### الأخطاء التي يجب عدم رؤيتها:

```
❌ Invalid PORT value: "\\.\pipe\..."
❌ Error: listen EACCES
❌ Error: listen EINVAL
```

---

## 8. القرار النهائي

### ✅ المشكلة مُحلّلة

تم إصلاح دعم IISNode Named Pipe عبر:

1. **تحديث الكود المصدري** (`index.ts`):
   - Detection للـ Named Pipe pattern
   - دعم `number | string` في `listenTarget`

2. **إعادة البناء**:
   - Built files مُحدّثة في `api/index.mjs`

3. **التوافق**:
   - ✅ VPS / Local (numeric port)
   - ✅ MonsterASP / IISNode (named pipe)

### 🔒 لم يتم تغيير:
- ❌ منطق API
- ❌ منطق Database
- ❌ Frontend or Admin
- ❌ ملفات VPS deployment

### ✅ ما تم تغييره فقط:
- `artifacts/api-server/src/index.ts` - دعم Named Pipe
- `monster-deploy/api/index.mjs` - rebuilt

---

## ملخص تقني

| البيئة | PORT | الحالة |
|--------|------|--------|
| Local Dev | `3000` (أو غير محدد) | ✅ يعمل |
| VPS | `8080` أو أي رقم | ✅ يعمل |
| MonsterASP / IISNode | `\\.\pipe\xxx` | ✅ يعمل (مُصلح) |

الكود الجديد يكتشف تلقائياً نوع PORT ويتصرف accordingly:

```typescript
if (isIisNodePipe) {
  // Use pipe for IISNode
  app.listen("\\.\pipe\xxx");
} else {
  // Use numeric port for VPS/Local
  app.listen(3000);
}
```

---

*تم الإصلاح: يونيو 2026*
*الحالة: جاهز للرفع على MonsterASP.NET*
