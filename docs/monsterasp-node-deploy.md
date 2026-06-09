# تعليمات رفع المشروع على MonsterASP (Node Server)

هذا الدليل يشرح كيفية رفع مشروع Kids Arabic Educational Games على MonsterASP باستخدام Node.js server.

**ملاحظة:** هذا الخيار أثقل من static export. استخدمه فقط إذا فشل static export.

## المتطلبات

- حساب على MonsterASP مع دعم Node.js
- وصول FTP أو File Manager
- Node.js مثبت على السيرفر (أو تفعيله من لوحة التحكم)

## الخطوات

### 1. بناء المشروع محليًا

```bash
# تثبيت التبعيات
npm install

# بناء المشروع للإنتاج
npm run build
```

بعد اكتمال البناء، تأكد من وجود مجلد `.next/` في جذر المشروع.

### 2. رفع الملفات على MonsterASP

#### الملفات المطلوبة رفعها إلى `/wwwroot`:

- `.next/` (مجلد البناء)
- `public/` (الملفات الثابتة: صور، صوتيات)
- `node_modules/` (التبعيات - قد يستغرق وقتاً طويلاً)
- `package.json`
- `package-lock.json`
- `next.config.mjs`
- `server.js`
- `web.config` (من `deployment/monsterasp-node/web.config`)
- `app/` (كود التطبيق)
- `components/` (المكونات)
- `data/` (البيانات)
- `lib/` (المكتبات)
- `hooks/` (الـ hooks)
- `contexts/` (الـ contexts)
- `types/` (الأنواع)
- `styles/` (الأنماط)

#### الملفات التي لا ترفع:

- `.git/`
- `.next/cache/`
- ملفات التوثيق الزائدة
- `dev-server.log`
- `dev-server.err.log`
- مجلدات ZIP القديمة

### 3. إعداد web.config

انسخ الملف:
```
deployment/monsterasp-node/web.config
```

إلى:
```
/wwwroot/web.config
```

هذا الملف ضروري لـ:
- تشغيل Node.js عبر httpPlatformHandler
- إعدادات environment variables
- توجيه الطلبات إلى server.js

### 4. تفعيل Node.js على MonsterASP

في لوحة تحكم MonsterASP:
1. اذهب إلى إعدادات السيرفر
2. تفعّل Node.js
3. تأكد من إصدار Node.js متوافق (مثلاً 20.x LTS)

### 5. التحقق من الرفع

بعد الرفع:
1. افتح الموقع في المتصفح
2. تأكد من تحميل الصفحة الرئيسية
3. تأكد من عمل التنقل بين الدروس
4. تأكد من تشغيل الصوتيات
5. تحقق من سجلات `logs/node` للتأكد من عدم أخطاء

### 6. استكشاف الأخطاء

#### إذا لم يعمل السيرفر:
- تأكد من تفعيل Node.js في لوحة التحكم
- تحقق من سجلات `logs/node`
- تأكد من وجود `server.js` و `web.config`
- تأكد من رفع `node_modules`

#### إذا كانت أخطاء في الذاكرة:
- قد تحتاج لزيادة الذاكرة في إعدادات MonsterASP
- أو استخدام static export بدلاً من ذلك

#### إذا كانت أخطاء في البناء:
- تأكد من أن `npm run build` نجح محليًا
- تأكد من رفع `.next/` بالكامل
- تأكد من توافق إصدار Node.js

## ملاحظات مهمة

- **أثقل من static export** - يحتاج Node.js على السيرفر
- **استهلاك أعلى للموارد** - Node.js يعمل بشكل مستمر
- **صيانة أكثر تعقيداً** - يحتاج مراقبة السيرفر
- **يجب رفع node_modules** - حجم كبير (مئات الميجابايت)

## المزايا

- دعم كامل لـ Next.js features
- يمكن إضافة server-side features مستقبلاً
- مرونة أعلى للتطوير

## العيوب

- أثقل من static export
- استهلاك أعلى للموارد
- يحتاج Node.js على السيرفر
- صيانة أكثر تعقيداً

## متى تستخدم هذا الخيار؟

- إذا فشل static export
- إذا احتجت server-side features مستقبلاً
- إذا كان MonsterASP يدعم Node.js بشكل جيد
- إذا لم تمانع استهلاك الموارد الأعلى

## الدعم

إذا واجهت مشاكل:
1. تحقق من سجلات `logs/node`
2. تأكد من تفعيل Node.js
3. تأكد من صحة `web.config`
4. تأكد من رفع كل الملفات المطلوبة
