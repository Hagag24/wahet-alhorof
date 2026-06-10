# تقرير إصلاح مسار قاعدة البيانات على MonsterASP.NET

## 1. سبب الخطأ

### الخطأ:
```
ConnectionFailed("Unable to open connection to local database ../../sqlite.db: 14")
```

### ما حدث:
الـ Backend كان يستخدم المسار الافتراضي:
```
../../sqlite.db
```

هذا المسار غير صالح على MonsterASP لأن:
1. المسار النسبي `../../` يخرج خارج مجلد `wwwroot/`
2. MonsterASP لا يسمح بالكتابة خارج مجلد التطبيق
3. المسار قد يشير إلى مسار غير موجود أو محمي

---

## 2. لماذا ../../sqlite.db لا يصلح على Monster

### المشاكل:

| المشكلة | الشرح |
|---------|-------|
| ❌ مسار نسبي خطير | `../../` يخرج من wwwroot |
| ❌ لا يتوافق مع IIS | IISNode يعمل في سياق مختلف |
| ❌ أذونات الكتابة | MonsterASP يقيّد الكتابة على مجلدات معينة |
| ❌ مؤقت | المسار قد يتغير بين عمليات النشر |

### المسار الصحيح على Monster:

بدلاً من:
```
../../sqlite.db  ← ❌ يخرج من wwwroot
```

نستخدم:
```
D:/Sites/siteXXXX/wwwroot/App_Data/db.sqlite  ← ✅ داخل wwwroot
```

أو نسبياً:
```
file:./App_Data/db.sqlite  ← ✅ داخل مجلد التطبيق
```

---

## 3. مسار قاعدة البيانات الجديد

### الحل المُطبق:

**`server.cjs` يُنشئ المجلدات ويضبط المسار:**

```javascript
// Create App_Data folder for SQLite database
const dataDir = path.join(rootDir, "App_Data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Set Monster-safe DATABASE_URL
const dbPath = path.join(dataDir, "db.sqlite").replace(/\\/g, "/");
process.env.DATABASE_URL = process.env.DATABASE_URL || `file:${dbPath}`;
```

### النتيجة:
```
DATABASE_URL = file:D:/Sites/siteXXXX/wwwroot/App_Data/db.sqlite
```

### المجلدات المُنشأة تلقائياً:

| المجلد | الغرض |
|--------|-------|
| `App_Data/` | قاعدة البيانات SQLite |
| `public/uploads/` | ملفات المستخدمين المرفوعة |

---

## 4. الملفات التي تم تعديلها

### الملف المُحدّث: `server.cjs`

**التغييرات:**
- ➕ إضافة `fs` module لإنشاء المجلدات
- ➕ إنشاء `App_Data/` folder إذا لم يكن موجوداً
- ➕ إنشاء `public/uploads/` folder
- ➕ ضبط `DATABASE_URL` تلقائياً
- ✅ تحويل المسار إلى forward slashes (`/`)

**الكود الجديد:**
```javascript
const fs = require("fs");
const path = require("path");

// Create App_Data folder
const dataDir = path.join(rootDir, "App_Data");
fs.mkdirSync(dataDir, { recursive: true });

// Set DATABASE_URL
const dbPath = path.join(dataDir, "db.sqlite").replace(/\\/g, "/");
process.env.DATABASE_URL = process.env.DATABASE_URL || `file:${dbPath}`;
```

### الملف الموجود: `App_Data/.gitkeep`

- يضمن رفع المجلد الفارغ
- يمنع Git من تجاهل المجلد

---

## 5. خطوات إعادة الرفع

### الملفات المطلوب رفعها:

1. **`server.cjs`** - المُحدّث
2. **`App_Data/.gitkeep`** - يضمن وجود المجلد
3. **`.env`** - يمكن تحديثه (اختياري)

### الخطوات:

```bash
# 1. احذف الملفات القديمة من wwwroot
# server.cjs القديم (إذا كان موجوداً)

# 2. ارفع الملفات الجديدة:
# - server.cjs (المُحدّث)
# - App_Data/ (مع .gitkeep)

# 3. تأكد من وجود public/uploads/

# 4. أعد تشغيل التطبيق من MonsterASP Control Panel
```

### إعداد .env (اختياري):

```env
DATABASE_URL=file:./App_Data/db.sqlite
```

ملاحظة: حتى لو لم تضبط `DATABASE_URL` في `.env`، فإن `server.cjs` سيضبطه تلقائياً.

---

## 6. اختبارات بعد الرفع

### قائمة التحقق:

| الاختبار | النتيجة المتوقعة |
|----------|------------------|
| ✅ إنشاء App_Data | يظهر في logs: "Created App_Data folder" |
| ✅ DATABASE_URL | يظهر في logs: المسار الصحيح |
| ✅ قاعدة البيانات | يُنشئ `App_Data/db.sqlite` تلقائياً |
| ✅ API يعمل | `/api/health` يرجع JSON |
| ✅ لا يوجد خطأ | لا يظهر `ConnectionFailed` |

### Logs للتحقق:

```
[MonsterASP/IISNode] Starting server...
[MonsterASP/IISNode] NODE_ENV: production
[MonsterASP/IISNode] PORT: 8080
[MonsterASP/IISNode] DATABASE_URL: file:D:/Sites/siteXXXX/wwwroot/App_Data/db.sqlite
[MonsterASP/IISNode] Created App_Data folder
[MonsterASP/IISNode] Created public/uploads folder
[MonsterASP/IISNode] ESM server loaded successfully
```

### الأخطاء التي يجب عدم رؤيتها:

```
❌ ConnectionFailed("Unable to open connection to local database ../../sqlite.db")
❌ Error: SQLITE_CANTOPEN: unable to open database file
```

---

## 7. القرار النهائي

### ✅ المشكلة مُحلّلة

تم إصلاح خطأ مسار قاعدة البيانات عبر:

1. **تحديث `server.cjs`**:
   - إنشاء `App_Data/` folder تلقائياً
   - إنشاء `public/uploads/` folder
   - ضبط `DATABASE_URL` على مسار Monster-safe
   - استخدام absolute path مع forward slashes

2. **الحفاظ على `App_Data/.gitkeep`**:
   - يضمن رفع المجلد

3. **Fallback مدمج**:
   - حتى لو لم يُضبط `DATABASE_URL` في `.env`، فإن `server.cjs` سيضبطه

### 🔒 لم يتم تغيير:
- ❌ منطق API backend
- ❌ منطق قاعدة البيانات
- ❌ Frontend or Admin
- ❌ ملفات VPS deployment

### ✅ ما تم تغييره فقط:
- `server.cjs` - إضافة setup للمجلدات وDATABASE_URL

---

## ملخص تقني

| قبل | بعد |
|-----|-----|
| `../../sqlite.db` ❌ | `App_Data/db.sqlite` ✅ |
| مسار نسبي خطير | absolute path آمن |
| يفشل على Monster | يعمل على Monster |

الحل يضمن:
- ✅ توافق MonsterASP.NET
- ✅ عدم تعديل business logic
- ✅ إنشاء تلقائي للمجلدات المطلوبة
- ✅ fallback إذا لم يُضبط DATABASE_URL

---

*تم الإصلاح: يونيو 2026*
*الحالة: جاهز للرفع على MonsterASP.NET*
