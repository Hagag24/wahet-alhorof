# تعليمات رفع الملفات على MonsterASP

**تاريخ الإنشاء:** 2026-06-09  
**اسم ملف النشر:** `kids-monsterasp-static-upload.zip`

---

## خطوات الرفع

### 1. فتح File Manager
افتح **MonsterASP File Manager** من لوحة التحكم.

### 2. الانتقال إلى wwwroot
ادخل على المجلد `/wwwroot`.

### 3. حذف الملفات القديمة (مهم!)
خذ نسخة احتياطية من الملفات القديمة أو احذفها كلها من `/wwwroot`.

### 4. رفع ملف ZIP
ارفع ملف `kids-monsterasp-static-upload.zip` مباشرة داخل `/wwwroot`.

### 5. فك الضغط
فك الضغط على الملف داخل `/wwwroot` مباشرة.  
**ملاحظة:** يجب أن يكون `index.html` في `/wwwroot/index.html` وليس في مجلد فرعي.

### 6. التحقق من الملفات
تأكد من وجود الملفات التالية:

```
/wwwroot/index.html          ✅
/wwwroot/web.config          ✅
/wwwroot/_next/              ✅
/wwwroot/audio/              ✅
/wwwroot/images/             ✅
/wwwroot/lessons/            ✅
```

### 7. اختبار الموقع
افتح الموقع واختبر:

1. ✅ الصفحة الرئيسية (`/`)
2. ✅ المقدمة الرسمية (`/character-select`)
3. ✅ صوت المقدمة (اضغط على أيقونة الصوت)
4. ✅ الدرس الأول (`/lessons/lesson-1`)
5. ✅ الدرس الثاني (`/lessons/lesson-2`)
6. ✅ الدرس الثالث (`/lessons/lesson-3`)
7. ✅ الدرس الرابع (`/lessons/lesson-4`)
8. ✅ لعبة واحدة من كل درس

---

## معلومات الملف

| البيان | القيمة |
|--------|--------|
| اسم الملف | `kids-monsterasp-static-upload.zip` |
| حجم الملف | 24.7 MB |
| عدد الملفات | 610 |
| ملفات الصوت | 192 |

---

## مسار الملف للرفع

```
deployment/kids-monsterasp-static-upload.zip
```

---

## ملاحظات مهمة

- ⚠️ لا ترفع الملفات بدون فك الضغط - يجب فك الضغط داخل `/wwwroot`
- ⚠️ تأكد أن `index.html` في الجذر مباشرة (`/wwwroot/index.html`)
- ⚠️ لا تحذف مجلد `audio/` - يحتوي على 192 ملف صوتي
- ⚠️ ملف `web.config` مهم لعمل IIS

---

## في حالة وجود مشاكل

1. تأكد من أن جميع ملفات الصوت موجودة في `/wwwroot/audio/`
2. تأكد من وجود `web.config` في الجذر
3. تأكد من صلاحيات الملفات (Permissions)
4. راجع سجلات الأخطاء (Error Logs) في لوحة التحكم
