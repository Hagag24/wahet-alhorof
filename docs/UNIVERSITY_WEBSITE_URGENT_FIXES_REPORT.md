# تقرير الإصلاحات العاجلة لموقع الجامعة

> النطاق: إصلاحات عاجلة لموقع الجامعة التعريفي الرسمي فقط (Institutional Website) بدون أي ميزات LMS.

## 1. ما تم تنفيذه

### 1.1 إصلاح RTL بالكامل
- تم جعل اتجاه الصفحة ديناميكيًا حسب اللغة (`ar => rtl`, `en => ltr`) بدل القيمة الثابتة.
- تم إزالة فرض `dir="ltr"` من الصفحة الرئيسية.
- تم تعديل محاذاة عناصر Hero وعناوين الأقسام في الصفحة الرئيسية لتتوافق مع RTL/LTR ديناميكيًا.
- النتيجة: العربية تعرض RTL بشكل صحيح، والإنجليزية تعرض LTR بدون كسر التخطيط.

### 1.2 إزالة رابط لوحة التحكم من الهيدر العام
- تم حذف رابط `/admin` من شريط تنقل الزائر العام.
- بقيت مسارات الإدارة تعمل مباشرة عبر ` /admin ` و ` /admin/login `.
- النتيجة: الواجهة العامة تعرض روابط مؤسسية فقط.

### 1.3 إزالة بيانات دخول افتراضية من صفحة دخول الإدارة
- تم حذف عرض بيانات الدخول الافتراضية (username/password).
- تم استبدالها برسالة أمنية احترافية:
  - "هذه المنطقة مخصصة للمستخدمين المصرح لهم فقط"
- النتيجة: عدم كشف أي بيانات حساسة في واجهة تسجيل الدخول.

### 1.4 إعادة بناء صفحة 404
- تم حذف رسالة المطور غير المهنية.
- تم إنشاء صفحة 404 احترافية داعمة للغتين عبر `useLanguage`.
- تم إضافة روابط واضحة إلى:
  - الرئيسية
  - البرامج الأكاديمية
  - الكليات
  - تواصل معنا
- النتيجة: صفحة 404 مناسبة لموقع جامعة رسمي.

### 1.5 تحسين Information Architecture للملاحة
- تم إعادة هيكلة الـNavigation لتصبح أقرب لنمط المواقع الجامعية المؤسسية.
- تم تطبيق تجميع منطقي للعناصر (About / Programs / Admissions / Services ...).
- تم دعم القوائم المنسدلة على الديسكتوب بـ `hover + focus-within` (تحسين وصول لوحة المفاتيح).
- تم تحسين قائمة الموبايل باستخدام قوائم قابلة للفتح/الإغلاق بشكل أوضح.
- تم ضمان عدم ظهور أي رابط إدارة داخل الملاحة العامة.

### 1.6 إصلاح أساسيات SEO
- تم استبدال Metadata الافتراضية في `index.html` بمعلومات مؤسسية احترافية.
- تم تحديث `robots.txt` لحظر الفهرسة عن:
  - `/admin`
  - `/api`
- تم تحديث `sitemap.xml` بروابط مطلقة (absolute URLs) وتوسيع الصفحات الأساسية العامة.
- تم تحسين مكوّن `Seo.tsx` ليشمل:
  - Canonical أكثر أمانًا (مع دعم `VITE_SITE_URL` و`VITE_PUBLIC_SITE_URL` كخيارات)
  - `hreflang` (`ar`, `en`, `x-default`)
  - `og:locale`
  - تغطية مسارات الصفحات المؤسسية الجديدة
- النتيجة: تحسين جاهزية الفهرسة والتمثيل المؤسسي بمحركات البحث.

### 1.7 إضافة صفحات ثقة مؤسسية Placeholder آمنة
- تمت إضافة/تفعيل مسارات عامة مؤسسية (بدون بناء CMS جديد الآن):
  - `/vision-mission`
  - `/president-message`
  - `/university-council`
  - `/accreditations`
  - `/certificates`
  - `/research`
- تم ربطها بنمط `ContentPage` مع محتوى مؤقت احترافي + TODOs لربط CMS لاحقًا.
- النتيجة: لا توجد روابط تنقل إلى صفحات مكسورة ضمن المسارات المؤسسية الحرجة.

### 1.8 تحسين UX أمان النماذج (Admissions / Contact)
- تمت إضافة Honeypot frontend field لكل نموذج لمنع سبام البوتات البسيطة.
- تمت إضافة تأخير زمني أدنى قبل أول إرسال (anti-bot behavior).
- تمت إضافة تبريد بسيط (cooldown) في الواجهة باستخدام `localStorage` لتقليل الإرسال المتكرر.
- تم تحسين رسائل التحقق (validation messages) لتكون أوضح.
- تم إضافة TODOs صريحة لضرورة الحماية الخلفية (Rate Limiting + Captcha).

### 1.9 تحسينات أداء سريعة (Quick Wins)
- تمت إضافة `loading="lazy"` و`decoding="async"` لصور عامة غير حرجة في صفحات:
  - الرئيسية
  - الأخبار
  - هيئة التدريس
  - تفاصيل الكلية
- تمت إضافة TODOs خاصة بالـpagination في صفحات تعتمد عرض قوائم كبيرة (Programs / News / Faculty).

---

## 2. الملفات التي تم تعديلها

| الملف | الغرض من التعديل |
|---|---|
| `artifacts/university/src/contexts/LanguageContext.tsx` | جعل `dir` ديناميكيًا حسب اللغة |
| `artifacts/university/src/pages/Home.tsx` | إزالة `dir` الثابت وتحسين محاذاة RTL/LTR + lazy image |
| `artifacts/university/src/components/PublicLayout.tsx` | إزالة رابط الإدارة + إعادة هيكلة الملاحة + تحسين mobile/desktop nav |
| `artifacts/university/src/pages/admin/Login.tsx` | حذف بيانات الدخول الافتراضية وإضافة رسالة أمنية |
| `artifacts/university/src/pages/not-found.tsx` | إعادة بناء صفحة 404 احترافية ثنائية اللغة |
| `artifacts/university/src/App.tsx` | إضافة مسارات الصفحات المؤسسية الناقصة (Trust placeholders) |
| `artifacts/university/src/pages/ContentPage.tsx` | إضافة fallback محتوى مؤسسي مؤقت لصفحات الثقة |
| `artifacts/university/index.html` | تحديث title/description/OG/Twitter metadata الأساسية |
| `artifacts/university/public/robots.txt` | حظر فهرسة `/admin` و`/api` + sitemap absolute |
| `artifacts/university/public/sitemap.xml` | إعادة بناء sitemap بروابط مطلقة ومسارات عامة أساسية |
| `artifacts/university/src/components/Seo.tsx` | canonical + hreflang + og locale + تغطية مسارات إضافية |
| `artifacts/university/src/pages/Admissions.tsx` | honeypot + cooldown + validation + anchors + TODO أمان خلفي |
| `artifacts/university/src/pages/Contact.tsx` | honeypot + cooldown + validation + TODO أمان خلفي |
| `artifacts/university/src/pages/Programs.tsx` | دعم hash-based program filters + TODO pagination |
| `artifacts/university/src/pages/News.tsx` | lazy images + TODO pagination |
| `artifacts/university/src/pages/Faculty.tsx` | lazy images + TODO pagination |
| `artifacts/university/src/pages/CollegeDetail.tsx` | lazy image لأعضاء هيئة التدريس |

---

## 3. المشاكل التي بقيت مؤجلة

1. **حماية backend ضد السبام**:
   - لا يوجد حتى الآن Rate Limiting/Captcha فعلي على مستوى API.
   - الحل المؤقت الحالي frontend-only ويحتاج تعزيز خلفي قبل الإطلاق الرسمي.

2. **Pagination حقيقية من الخادم**:
   - صفحات `Programs` و`News` و`Faculty` ما زالت تحتاج دعم pagination من API (أو infinite loading مضبوط).

3. **تحويل صفحات الثقة من Placeholder إلى CMS Structured**:
   - الصفحات المضافة تعمل حاليًا بمحتوى مؤقت عبر `ContentPage`.
   - يلزم لاحقًا نمذجة CMS تفصيلية (حقول، وحدات، صلاحيات، قوالب عرض).

4. **تحسينات SEO متقدمة لاحقة**:
   - ما زال مطلوبًا لاحقًا: Schema أوسع للصفحات التفصيلية (Program/Faculty/News Detail)، وسياسات canonical متقدمة للمسارات التفصيلية.

---

## 4. أي TODOs تمت إضافتها

| TODO | الملف | السبب |
|---|---|---|
| `TODO(security): add backend rate limiting and captcha verification to /api/admissions.` | `artifacts/university/src/pages/Admissions.tsx` | حماية فعلية ضد السبام يجب أن تكون في الباكند |
| `TODO(security): add backend rate limiting and captcha verification to /api/contact.` | `artifacts/university/src/pages/Contact.tsx` | الحماية الحالية frontend-only وغير كافية وحدها |
| `TODO(cms): Replace temporary trust pages with dedicated CMS-managed structured sections.` | `artifacts/university/src/App.tsx` | الصفحات الحالية placeholder وتحتاج إدارة CMS مهيكلة |
| `TODO(cms): ... About & Trust pages` | `artifacts/university/src/pages/ContentPage.tsx` | نقل المحتوى المؤقت إلى حقول CMS واضحة |
| `TODO(cms): ... president profile + media assets` | `artifacts/university/src/pages/ContentPage.tsx` | صفحة رسالة الرئيس تحتاج وحدة إدارة محتوى خاصة |
| `TODO(cms): ... structured council members module` | `artifacts/university/src/pages/ContentPage.tsx` | صفحة المجلس تحتاج إدارة أعضاء/مناصب/مدد |
| `TODO(perf): add backend pagination for /api/programs` | `artifacts/university/src/pages/Programs.tsx` | تجنب تحميل/عرض قوائم غير محدودة |
| `TODO(perf): add pagination/infinite-loading support` | `artifacts/university/src/pages/News.tsx` | تحسين الأداء عند نمو الأخبار |
| `TODO(perf): add pagination support to /api/faculty` | `artifacts/university/src/pages/Faculty.tsx` | تحسين الأداء عند نمو هيئة التدريس |

---

## 5. أوامر التحقق

### 5.1 `pnpm run typecheck`
- **النتيجة**: ✅ نجح.
- **ملاحظات**: فحص TypeScript مرّ على المشاريع ذات الصلة بدون أخطاء.

### 5.2 `pnpm --filter @workspace/university run build`
- **النتيجة**: ✅ نجح.
- **ملاحظات**:
  - البناء اكتمل بنجاح.
  - ظهرت تحذيرات sourcemap من Vite لبعض ملفات UI (`tooltip/select/label`) بدون فشل البناء.
- **اقتراح لاحق**: مراجعة إعدادات sourcemaps أو ملفات المصدر الأصلية لهذه المكونات إن أردتم تنظيف التحذيرات.

### 5.3 `pnpm --filter @workspace/api-server run build`
- **النتيجة**: ✅ نجح.
- **ملاحظات**: تم توليد ملفات `dist` بنجاح.

### 5.4 `pnpm run lint`
- **النتيجة**: ❌ فشل.
- **ملخص الخطأ**: `Missing script: lint`.
- **السبب المحتمل**: لا يوجد سكربت lint معرف في `package.json` الجذر.
- **الإصلاح المقترح**: إضافة سكربت lint موحد (مثلاً ESLint) على مستوى workspace.

### 5.5 `pnpm run test`
- **النتيجة**: ❌ فشل.
- **ملخص الخطأ**: `Missing script: test`.
- **السبب المحتمل**: لا يوجد سكربت test معرف في `package.json` الجذر.
- **الإصلاح المقترح**: إضافة سكربت اختبار (وحدات/تكامل) قبل الإطلاق الرسمي.

---

## 6. النتيجة النهائية

- الموقع أصبح **أكثر أمانًا واحترافية** للعرض على العميل مقارنة بالحالة السابقة، خاصة في:
  - RTL/LTR
  - فصل واجهة الزائر عن الإدارة
  - إخفاء بيانات الدخول الافتراضية
  - تحسين 404
  - تنظيم الملاحة المؤسسية
  - أساسيات SEO
- لا تزال هناك عناصر مهمة قبل الإطلاق الرسمي النهائي (خصوصًا حماية backend للنماذج وPagination/CMS Structuring)، لكنها **لم تعد مانعًا لعرض نسخة مؤسسية قوية في العرض التقديمي**.

- تم الالتزام الكامل بأن المشروع موقع جامعة تعريفي رسمي، **ولم يتم إدخال أي ميزات LMS**.
