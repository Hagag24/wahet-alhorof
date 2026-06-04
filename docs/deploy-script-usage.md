# تعليمات استخدام سكريبت النشر على MonsterASP

## كيفية تشغيل السكريبت

لتشغيل سكريبت النشر، استخدم الأمر التالي في PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy-monsterasp-static.ps1
```

## ماذا يخلق السكريبت؟

السكريبت يقوم بالخطوات التالية:

1. التحقق من وجود `package.json`
2. تثبيت التبعيات إذا لم تكن موجودة (`npm install`)
3. تشغيل عمليات التحقق:
   - `npm run lint`
   - `npm test`
   - `npx tsc --noEmit`
   - `npm run build`
4. التحقق من وجود مجلد `out/` بعد البناء
5. نسخ محتويات `out/` إلى `deployment/monsterasp-upload/`
6. نسخ `web.config` إلى مجلد النشر
7. إنشاء ملف ZIP جاهز للرفع

## ماذا ترفع إلى MonsterASP؟

بعد تشغيل السكريبت، ستجد ملف ZIP في:
```
deployment/kids-monsterasp-static-upload.zip
```

هذا الملف يحتوي على كل الملفات اللازمة للنشر.

## أين تستخرج الملف؟

على MonsterASP، استخرج ملف ZIP في المجلد:
```
/wwwroot
```

## الملفات التي يجب أن تظهر بعد الاستخراج

بعد الاستخراج، يجب أن تجد الملفات التالية في `/wwwroot`:

- `index.html` - الصفحة الرئيسية
- `_next/` - مجلد Next.js
- `lessons/` - مجلد الدروس
- `audio/` - مجلد الصوتيات
- `images/` - مجلد الصور
- `web.config` - ملف إعدادات IIS

## ملاحظات مهمة

- السكريبت لا يرفع الملفات تلقائياً إلى MonsterASP
- يجب رفع ملف ZIP يدوياً عبر FTP أو File Manager
- تأكد من استخراج الملفات في `/wwwroot` وليس في مجلد فرعي
- ملف `web.config` ضروري لعمل الصوتيات والصور بشكل صحيح
