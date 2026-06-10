# UNIVERSITY WEBSITE AUDIT

> **نطاق التدقيق**: هذا التقرير خاص بالموقع الرسمي التعريفي للجامعة فقط (Institutional Website)، وليس نظام LMS.  
> أي إدارة مقررات/اختبارات/درجات/فصول افتراضية يجب أن تكون في مشروع LMS مستقل تمامًا (بنية، صلاحيات، تشغيل، تكلفة).

---

## 1. Executive Summary

### الحالة العامة
- اتجاه المشروع **صحيح جزئيًا**: البنية الحالية تميل لموقع جامعة تعريفي مع CMS مبدئي، وليس LMS.
- التنفيذ الحالي **غير جاهز بعد** ليظهر كواجهة جامعة عالمية عند الإطلاق.
- توجد نقاط قوية (هيكل برامج/كليات، إدارة محتوى ثنائي اللغة، لوحة إدارة فعلية)، لكن توجد فجوات حرجة في: الهوية المؤسسية، SEO المؤسسي، هندسة المحتوى، الثقة الأمنية، وتجربة العربية/RTL.

### هل المشروع مبني كموقع جامعة؟
- **نعم** من حيث الفكرة العامة والكيانات الأساسية (كليات، برامج، أخبار، قبول، تواصل، محتوى مؤسسي).
- **لكن** ما زال أقرب إلى “بوابة معلومات جيدة قيد التطوير” وليس “واجهة جامعة عالمية مكتملة”.

### Top 5 Issues
1. **خلل RTL حرج**: التطبيق يفرض `ltr` عالميًا حتى عند العربية.  
   - المرجع: `artifacts/university/src/contexts/LanguageContext.tsx`, `artifacts/university/src/pages/Home.tsx`
2. **SEO معماري غير كافٍ لمؤسسة تعليمية عالمية**: Metadata ديناميكية من المتصفح فقط + روابط رقمية بالـID + Sitemap ناقص وبروابط نسبية.  
   - المراجع: `artifacts/university/src/components/Seo.tsx`, `artifacts/university/src/App.tsx`, `artifacts/university/public/sitemap.xml`
3. **تشتت IA والملاحة**: قائمة طويلة جدًا مع خلط أولوية المحتوى ووجود رابط Dashboard داخل واجهة الزائر.
   - المرجع: `artifacts/university/src/components/PublicLayout.tsx`
4. **فجوات محتوى مؤسسي أساسي**: غياب صفحات محورية (رسالة الرئيس، مجلس الجامعة، الشهادات، الشروط، الشركاء بصياغة رسمية كاملة).
5. **مخاطر ثقة/أمن ظاهرة**: بيانات دخول افتراضية معروضة في صفحة تسجيل دخول الإدارة + صفحة 404 برسالة تطوير.
   - المراجع: `artifacts/university/src/pages/admin/Login.tsx`, `artifacts/university/src/pages/not-found.tsx`

### Top 5 Priorities
1. إصلاح RTL بالكامل وتوحيد اتجاه العربية فورًا.
2. إعادة تصميم IA والملاحة وفق نموذج جامعة مؤسسي (تقليل العناصر + تجميع منطقي).
3. ترقية SEO البنيوي (Slugs، Sitemap صحيح، Metadata لكل صفحة تفصيلية، منع فهرسة admin).
4. بناء صفحات الثقة المؤسسية الناقصة (الاعتمادات، المجلس، رسالة الرئيس، الشهادات، الشركاء).
5. تقوية CMS ليغطي إدارة المحتوى المؤسسي هيكليًا بدل الاعتماد على صفحات HTML عامة فقط.

---

## 2. Current Project Understanding

### التقنيات والبنية
- Frontend: React + Vite + Wouter + React Query + Tailwind + Radix UI.
- Backend: Express + Drizzle ORM + SQLite/libsql.
- Monorepo (pnpm workspace) مع حزم مشتركة `lib/*`.

### الصفحات والمسارات الرئيسية المكتشفة
- الموقع العام: `/`, `/about`, `/colleges`, `/programs`, `/news`, `/faculty`, `/admissions`, `/contact`, `/faq`, `/centers`, `/journals`, `/memberships` ... إلخ.
- لوحة الإدارة: `/admin/*` وتتضمن إدارات للكليات، البرامج، الأخبار، الأسئلة، الرسائل، المستخدمين، الإعدادات، SEO، والمحتوى.

### CMS / Dashboard
- يوجد Dashboard فعلي ومربوط ببيانات حقيقية عبر API.
- إدارة المحتوى الحالية مزيج من:
  - جداول متخصصة (colleges/programs/news/faqs/...)
  - وصفحات عامة HTML عبر `page_contents`
- هذا جيد كبداية، لكنه غير كافٍ بعد لإدارة موقع جامعة عالمي متعدد الأقسام المؤسسية.

### أسلوب البيانات
- أغلب البيانات ديناميكية من API.
- توجد Seeds واسعة ومفصلة (`scripts/src/seed-university-content.ts`) توضح نية مشروع مؤسسي كبير.

### تعدد اللغة وRTL
- دعم `ar/en` موجود في الواجهة وفي نموذج البيانات.
- **مشكلة حرجة**: `document.documentElement.dir = "ltr"` دائمًا، ما يكسر RTL فعليًا عند العربية.

### ملاحظة توضيحية مهمة
- لا توجد ميزات LMS أساسية (اختبارات، درجات، تتبع تقدم، فصول افتراضية).
- الموجود هو **موقع مؤسسي + نماذج قبول/تواصل**، وهذا ضمن نطاق الموقع الرسمي وليس LMS.

---

## 3. Sitemap Audit

| Page / Route | Purpose | Status | Keep / Modify / Remove / Add | Notes |
|---|---|---|---|---|
| `/` | الصفحة الرئيسية | Implemented | Keep with modifications | جيدة كبنية، تحتاج ترقية مؤسسية وRTL وSEO |
| `/about` | من نحن (ContentPage) | Implemented | Keep with modifications | يلزم تفكيكها لصفحات مؤسسية مستقلة |
| `/colleges` | عرض الكليات | Implemented | Keep with modifications | جيد، يحتاج SEO/Filter/Search أعمق |
| `/colleges/:id` | تفاصيل كلية | Implemented | Keep with modifications | غني، لكن URL بالـID لا slug |
| `/programs` | البرامج الأكاديمية | Implemented | Keep with modifications | يحتاج مسارات منفصلة للدبلوم/ماجستير/دكتوراه |
| `/programs/:id` | تفاصيل برنامج | Implemented | Keep with modifications | قوي جدًا محتوى، يحتاج SEO تفصيلي وسلاجات |
| `/news` | الأخبار والفعاليات | Implemented | Keep with modifications | يفضل فصل صفحة Events مستقلة |
| `/news/:id` | خبر تفصيلي | Implemented | Keep with modifications | يحتاج sanitation/SEO أقوى |
| `/faculty` | هيئة التدريس | Implemented | Keep with modifications | جيد، ينقص صفحة عضو تفصيلية |
| `/admissions` | القبول والتسجيل | Implemented | Keep with modifications | جيد وظيفيًا، يحتاج مسار معلومات قبول مؤسسي أقوى |
| `/contact` | التواصل | Implemented | Keep with modifications | جيد، ينقص خرائط/ساعات عمل/فروع |
| `/faq` | الأسئلة الشائعة | Implemented | Keep with modifications | جيد، يحتاج توسيع التصنيفات الرسمية |
| `/student-services` | خدمات طلابية | Implemented | Keep with modifications | يفضل ضمن “الخدمات” وليس كعنصر ناف أساسي |
| `/centers` | المراكز | Implemented | Keep with modifications | حاليًا Generic HTML، ينقص هيكل بيانات مراكز |
| `/centers/:slug` | مركز تفصيلي | Implemented | Keep with modifications | عند عدم وجود محتوى قد يسقط على About fallback |
| `/journals` | المجلات | Implemented | Keep with modifications | Generic، ينقص إدارة أعداد وإصدار/ISSN |
| `/memberships` | الاعتمادات/العضويات | Implemented | Keep with modifications | يحتاج إعادة تسمية وهيكلة “Partners & Accreditations” |
| `/tuition-fees` | الرسوم | Implemented | Keep with modifications | ضمن footer فقط، يحتاج ربط أوضح بالقبول |
| `/academic-calendar` | التقويم الأكاديمي | Implemented | Keep with modifications | يحتاج قالب تقويم رسمي قابل للتحديث |
| `/privacy` | الخصوصية | Implemented | Keep with modifications | جيدة كبداية، ينقص Terms page |
| `not-found` | 404 | Implemented | Rebuild | نص مطور غير مناسب للجمهور |
| `About.tsx` | صفحة About بديلة | File exists, unused | Remove / Merge | ملف غير مستخدم (تكرار) |
| `StudentServices.tsx` | صفحة Services بديلة | File exists, unused | Remove / Merge | ملف غير مستخدم (تكرار) |
| `/admin/*` | إدارة الموقع | Implemented | Keep with modifications | قوية كبداية، مع فجوات CMS مؤسسية |

---

## 4. Homepage Audit

### تقييم عام للصفحة الرئيسية
- **نقاط قوة**:
  - Hero واضح بصريًا.
  - وجود CTAs للقبول والبرامج.
  - أقسام الكليات والأخبار مبدئيًا منظمة.
  - تصميم حديث ونشط.
- **نقاط ضعف مؤسسية**:
  - لغة “بوابة ذكية” أقرب لمنتج رقمي من واجهة جامعة رسمية.
  - غياب كتل ثقة مؤسسية أساسية (الاعتمادات الرسمية، الشركاء، خطاب القيادة).
  - ترتيب أقسام يحتاج إعادة ضبط وفق رحلة الزائر المؤسسي.
  - الصفحة تفرض `dir="ltr"` رغم العربية.

### يجب حذفه من الصفحة الرئيسية

| Item | Location/component | Why remove it | Expected benefit |
|---|---|---|---|
| فرض `dir="ltr"` | `pages/Home.tsx` | يكسر تجربة العربية | تصحيح التجربة العربية فورًا |
| الصياغة التسويقية غير المؤسسية المبالغ فيها | Hero copy / Footer copy | تضعف صورة الجامعة الرسمية | نبرة أكاديمية موثوقة |
| التكرار العالي للرسائل الدعائية | Hero + CTA + Feature cards | ضوضاء معرفية | وضوح واحترافية |
| عرض “Dashboard” ضمن واجهة الزائر | Header | يربك الزائر ويمس الثقة | فصل الجمهور العام عن الإدارة |

### يجب إضافته للصفحة الرئيسية

| Item | Where to add it | Why it matters | Priority |
|---|---|---|---|
| كتلة الاعتمادات والشراكات الرسمية | بعد Hero | ترفع الثقة فورًا | Urgent |
| روابط مباشرة للمراحل الأكاديمية (دبلوم/ماجستير/دكتوراه) | قرب قسم البرامج | تسهّل discovery | Urgent |
| نبذة قيادة الجامعة (رئيس الجامعة + رابط الرسالة) | منتصف الصفحة | عنصر ثقة مؤسسي عالمي | Important |
| قسم بحث علمي/مجلات بأحدث الإصدارات | قبل الأخبار | يعكس هوية أكاديمية | Important |
| مؤشرات أداء موثّقة بمصدر (طلاب/أبحاث/اعتماد) | قسم الإحصائيات | مصداقية أعلى | Important |

### يجب تعديله في الصفحة الرئيسية

| Current issue | Suggested change | Reason | Priority |
|---|---|---|---|
| ترتيب الأقسام يميل لتسويق أكثر من مؤسسية | إعادة ترتيب: Hero -> اعتمادات -> برامج -> كليات -> بحث/مجلات -> أخبار/فعاليات -> CTA | رحلة زائر جامعة أكثر منطقية | Urgent |
| غياب روابط عميقة للبرامج حسب المرحلة | أزرار واضحة: Diploma, Master, Doctorate | تقليل الاحتكاك | Urgent |
| كثافة Motion عالية | تقليل الحركة وإضافة `prefers-reduced-motion` | أداء + وصول | Important |
| صورة الجامعة العامة غير مكتملة | إضافة “عن الجامعة” مختصر بأرقام موثقة وروابط لصفحات رسمية | ثقة مؤسسية | Important |

---

## 5. Navigation Audit

### Current Navigation Issues
- عدد العناصر كبير (13+) ويزيد الحمل الإدراكي.
- خلط أولويات: “الخدمات” و“العضويات” و“FAQ” في نفس المستوى مع “الكليات/البرامج”.
- وجود رابط `Dashboard` في هيدر الزائر العام.
- قوائم المراكز/الكليات في الديسكتوب تعتمد على hover أكثر من الوصول عبر لوحة المفاتيح.
- لا توجد هندسة واضحة لمسار “القبول” مقابل “المحتوى المؤسسي”.

### Items to Remove from Navigation
- رابط `Dashboard` من الهيدر العام.
- عنصر “الخدمات” كعنصر رئيسي مستقل (ينقل تحت “الخدمات” أو “الحياة الجامعية”).
- “العضويات” كمصطلح؛ يستبدل بـ “الاعتمادات والشراكات”.

### Items to Add to Navigation
- “البحث العلمي والمجلات” بصياغة أوضح.
- “القبول والتسجيل” بمسارات فرعية (الشروط، الرسوم، المواعيد، نموذج التقديم).
- “عن الجامعة” كـ mega-group واضح (نبذة، الرؤية، المجلس، القيادة، الاعتمادات).

### Recommended Final Navigation
- الرئيسية
- عن الجامعة
  - نبذة عن الجامعة
  - الرؤية والرسالة
  - رسالة رئيس الجامعة
  - مجلس الجامعة
  - الاعتمادات والشراكات
- الكليات
- البرامج الأكاديمية
  - جميع البرامج
  - الدبلوم
  - الماجستير
  - الدكتوراه
- القبول والتسجيل
  - شروط القبول
  - الرسوم الدراسية
  - التقويم الأكاديمي
  - نموذج التقديم
- المراكز
- المجلات والبحث العلمي
- الأخبار والفعاليات
- الخدمات
  - الخدمات الطلابية
  - الأسئلة الشائعة
- تواصل معنا

---

## 6. Page-by-Page Audit

### Page Name
Home
### Route / File Path
`/` — `artifacts/university/src/pages/Home.tsx`
### Purpose
واجهة الجامعة الأساسية والانطباع الأول
### Is it necessary?
نعم
### Current strengths
- Hero قوي بصريًا
- CTAs واضحة
- عرض كليات وأخبار
### What should be removed
- فرض `dir="ltr"`
- تكرار رسائل دعائية متشابهة
### What should be added
- اعتماد/شركاء/قيادة/بحث علمي
### What should be modified
- ترتيب الأقسام + نبرة المحتوى
### UX issues
- مسار اكتشاف البرامج حسب المرحلة غير مباشر
### UI issues
- حركة كثيرة نسبيًا
### Content issues
- نبرة Portal أكثر من Institutional
### SEO issues
- لا slug-level metadata للمحتوى التفصيلي
### Mobile issues
- كثافة أقسام طويلة + ازدحام نسبي
### Final decision
Keep with modifications
### Priority
Urgent

---

### Page Name
About (ContentPage)
### Route / File Path
`/about` — `artifacts/university/src/pages/ContentPage.tsx`
### Purpose
صفحة تعريف الجامعة
### Is it necessary?
نعم
### Current strengths
- قابلة للإدارة من CMS
### What should be removed
- عبارة “Editable content” على الواجهة العامة
### What should be added
- أقسام رسمية: الرؤية، الرسالة، القيم، الحوكمة
### What should be modified
- هيكل الصفحة من HTML حر إلى Template مؤسسي
### UX issues
- fallback قد يعرض محتوى غير متوقع
### UI issues
- تصميم عام موحد لكن غير مخصص لكل نوع صفحة
### Content issues
- يحتاج عمق مؤسسي
### SEO issues
- metadata عامة
### Mobile issues
- جيد عمومًا
### Final decision
Keep with modifications
### Priority
Important

---

### Page Name
Colleges
### Route / File Path
`/colleges` — `pages/Colleges.tsx`
### Purpose
استعراض الكليات
### Is it necessary?
نعم
### Current strengths
- بطاقات واضحة وإحصاءات
### What should be removed
- لا شيء جذري
### What should be added
- بحث/فرز متقدم
### What should be modified
- تحسين الروابط لتستخدم slug بدل id
### UX issues
- لا pagination أو lazy list
### UI issues
- نمط جيد لكنه متكرر مع صفحات أخرى
### Content issues
- ملخصات قصيرة جدًا أحيانًا
### SEO issues
- URLs رقمية في التفاصيل
### Mobile issues
- جيد
### Final decision
Keep with modifications
### Priority
Important

---

### Page Name
College Detail
### Route / File Path
`/colleges/:id` — `pages/CollegeDetail.tsx`
### Purpose
صفحة كلية رسمية
### Is it necessary?
نعم
### Current strengths
- ثراء محتوى كبير (رؤية/رسالة/اعتماد/أقسام)
### What should be removed
- الاعتماد على ID في الرابط
### What should be added
- breadcrumbs + روابط ذات صلة (برامج/قبول)
### What should be modified
- توحيد SEO مع Seo component
### UX issues
- كثافة معلومات عالية دون TOC
### UI issues
- جيد إجمالًا
### Content issues
- يحتاج ضبط أسلوب رسمي موحد
### SEO issues
- metadata تفصيلية ناقصة (OG/canonical لكل كلية)
### Mobile issues
- مقبول، يحتاج اختصار أقسام
### Final decision
Keep with modifications
### Priority
Important

---

### Page Name
Programs
### Route / File Path
`/programs` — `pages/Programs.tsx`
### Purpose
استعراض البرامج
### Is it necessary?
نعم
### Current strengths
- فلترة مستويات
### What should be removed
- لا شيء جذري
### What should be added
- صفحات مستقلة للمراحل + بحث
### What should be modified
- slug routes + تحسين مسار التنقل
### UX issues
- لا مقارنة برامج/لا فلاتر كافية
### UI issues
- جيد
### Content issues
- مختصرات قد تحتاج توحيد
### SEO issues
- مستوى المرحلة عبر state لا مسار URL دائم
### Mobile issues
- جيد
### Final decision
Keep with modifications
### Priority
Important

---

### Page Name
Program Detail
### Route / File Path
`/programs/:id` — `pages/ProgramDetail.tsx`
### Purpose
تفاصيل برنامج أكاديمي
### Is it necessary?
نعم
### Current strengths
- نموذج تفصيلي قوي جدًا
### What should be removed
- لا شيء جوهري
### What should be added
- روابط إلى القبول/الرسوم/التقويم بشكل أوضح
### What should be modified
- Slug + schema + metadata متقدمة
### UX issues
- طول الصفحة بدون جدول محتوى
### UI issues
- جيد
### Content issues
- يحتاج تدقيق تحريري موحد
### SEO issues
- metadata جزئية فقط
### Mobile issues
- طويل نسبيًا
### Final decision
Keep with modifications
### Priority
Important

---

### Page Name
News
### Route / File Path
`/news` — `pages/News.tsx`
### Purpose
الأخبار والفعاليات
### Is it necessary?
نعم
### Current strengths
- فلترة الأنواع
### What should be removed
- دمج شديد بين News/Events/Conference دون مسارات مستقلة
### What should be added
- صفحة Events مستقلة + أرشيف زمني
### What should be modified
- pagination + slug-based details
### UX issues
- عند حجم كبير ستصبح الصفحة ثقيلة
### UI issues
- جيد
### Content issues
- يحتاج سياسات نشر واضحة
### SEO issues
- لا أرشفة منظمة حسب نوع/تاريخ
### Mobile issues
- جيد
### Final decision
Keep with modifications
### Priority
Important

---

### Page Name
News Detail
### Route / File Path
`/news/:id` — `pages/NewsDetail.tsx`
### Purpose
تفاصيل الخبر
### Is it necessary?
نعم
### Current strengths
- عرض واضح للصورة والملخص
### What should be removed
- حقن HTML غير معقم في المحتوى
### What should be added
- structured data (Article/Event)
### What should be modified
- slugs + meta OG لكل خبر
### UX issues
- لا روابط لأخبار مشابهة
### UI issues
- جيد
### Content issues
- تدقيق تحريري
### SEO issues
- URL id + meta محدود
### Mobile issues
- مقبول
### Final decision
Keep with modifications
### Priority
Urgent

---

### Page Name
Faculty
### Route / File Path
`/faculty` — `pages/Faculty.tsx`
### Purpose
عرض أعضاء هيئة التدريس
### Is it necessary?
نعم
### Current strengths
- تصفية حسب الكلية
### What should be removed
- لا شيء جوهري
### What should be added
- صفحة عضو تفصيلية
### What should be modified
- تحسين SEO + صور محسنة
### UX issues
- تفاصيل العضو محدودة
### UI issues
- جيد
### Content issues
- نقص bio/research في الواجهة
### SEO issues
- لا صفحات member detail
### Mobile issues
- جيد
### Final decision
Keep with modifications
### Priority
Important

---

### Page Name
Admissions
### Route / File Path
`/admissions` — `pages/Admissions.tsx`
### Purpose
معلومات القبول + نموذج التقديم
### Is it necessary?
نعم
### Current strengths
- نموذج فعلي وإدارة لاحقة في admin
### What should be removed
- أي صياغة قد توحي أنه نظام طالب كامل
### What should be added
- مسارات واضحة: شروط/رسوم/تواريخ/FAQ القبول
### What should be modified
- إضافة حماية spam (captcha/rate limit)
### UX issues
- لا تتبع حالة تقديم للمتقدم
### UI issues
- جيد
### Content issues
- شروط القبول تحتاج قالب رسمي متدرج
### SEO issues
- يحتاج Landing ثري
### Mobile issues
- جيد
### Final decision
Keep with modifications
### Priority
Urgent

---

### Page Name
Contact
### Route / File Path
`/contact` — `pages/Contact.tsx`
### Purpose
تواصل رسمي
### Is it necessary?
نعم
### Current strengths
- نموذج واضح + معلومات تواصل
### What should be removed
- لا شيء جوهري
### What should be added
- خريطة + ساعات عمل + أقسام اتصال
### What should be modified
- إضافة anti-spam
### UX issues
- لا تصنيف رسائل متعدد واضح للزائر
### UI issues
- جيد
### Content issues
- يلزم بيانات جهات تواصل متعددة
### SEO issues
- محدود
### Mobile issues
- جيد
### Final decision
Keep with modifications
### Priority
Important

---

### Page Name
FAQ
### Route / File Path
`/faq` — `pages/FAQ.tsx`
### Purpose
أسئلة شائعة
### Is it necessary?
نعم
### Current strengths
- تصنيفات + تفاعل
### What should be removed
- عرض HTML بدون sanitization
### What should be added
- FAQ schema
### What should be modified
- تحسين التحرير والتصنيف
### UX issues
- لا بحث داخل FAQ
### UI issues
- جيد
### Content issues
- يحتاج تغطية أوسع
### SEO issues
- فرصة SEO غير مستغلة
### Mobile issues
- جيد
### Final decision
Keep with modifications
### Priority
Important

---

### Page Name
Student Services (ContentPage)
### Route / File Path
`/student-services` — `pages/ContentPage.tsx`
### Purpose
صفحة خدمات طلابية تعريفية
### Is it necessary?
نعم (كمحتوى مؤسسي)
### Current strengths
- قابلة للتحديث من لوحة التحكم
### What should be removed
- تموضعها كعنصر ملاحة أساسي مبكر
### What should be added
- تقسيم خدمات (مكتبة/دعم/نشاط)
### What should be modified
- قالب Structured بدل HTML عام
### UX issues
- fallback behavior غير دقيق
### SEO issues
- metadata عامة
### Final decision
Keep with modifications
### Priority
Later

---

### Page Name
Centers / Center Details
### Route / File Path
`/centers`, `/centers/:slug` — `ContentPage.tsx`
### Purpose
عرض المراكز
### Is it necessary?
نعم
### Current strengths
- وجود صفحات مركز لكل slug
### What should be removed
- fallback إلى About عند عدم وجود slug صالح
### What should be added
- نموذج بيانات مركز (وصف، إدارة، خدمات، أخبار)
### What should be modified
- SEO لكل مركز + breadcrumb
### UX issues
- تجربة غير مستقرة عند slug غير موجود
### UI issues
- Generic جدًا
### Content issues
- لا قوالب مؤسسية متخصصة للمراكز
### Final decision
Keep with major modifications
### Priority
Urgent

---

### Page Name
Journals
### Route / File Path
`/journals` — `ContentPage.tsx`
### Purpose
المجلات العلمية
### Is it necessary?
نعم
### Current strengths
- وجود صفحة مبدئية
### What should be removed
- الاكتفاء بنص HTML عام
### What should be added
- هيكل مجلة: هيئة تحرير، الأعداد، السياسات، DOI/ISSN
### What should be modified
- تحويلها إلى نموذج بيانات متخصص
### SEO issues
- ضعيف جدًا حاليًا
### Final decision
Keep with major modifications
### Priority
Urgent

---

### Page Name
Memberships (Accreditations placeholder)
### Route / File Path
`/memberships` — `ContentPage.tsx`
### Purpose
الاعتمادات/العضويات
### Is it necessary?
نعم لكن بمسمى وهيكل مختلف
### Current strengths
- وجود نقطة بداية للمحتوى
### What should be removed
- مصطلح “Memberships” كبديل نهائي
### What should be added
- Partners & Accreditations page متكاملة
### What should be modified
- الاسم + المحتوى + الأدلة الموثقة
### Final decision
Keep with major modifications
### Priority
Urgent

---

### Page Name
Privacy / Tuition / Academic Calendar
### Route / File Path
`/privacy`, `/tuition-fees`, `/academic-calendar` — `ContentPage.tsx`
### Purpose
صفحات سياسات ومعلومات مساندة
### Is it necessary?
نعم
### Current strengths
- موجودة ومتصلة بالفوتر
### What should be removed
- لا شيء جوهري
### What should be added
- Terms page + تحديث دوري ومؤرخ
### What should be modified
- قوالب رسمية وتحديثات مؤرشفة
### Final decision
Keep with modifications
### Priority
Important

---

### Page Name
Not Found
### Route / File Path
`pages/not-found.tsx`
### Purpose
التعامل مع الروابط غير الموجودة
### Is it necessary?
نعم
### Current strengths
- موجودة
### What should be removed
- نص المطور: “Did you forget to add the page to the router?”
### What should be added
- رسالة مؤسسية + روابط مهمة
### What should be modified
- دعم عربي/إنجليزي + CTA للعودة
### Final decision
Rebuild
### Priority
Urgent

---

### Page Name
Admin Pages (مجتمعة)
### Route / File Path
`/admin/*`
### Purpose
إدارة المحتوى المؤسسي
### Is it necessary?
نعم
### Current strengths
- CRUD حقيقي للكليات/برامج/أخبار/أسئلة
- إدارة رسائل وتقديمات
- أدوار وصلاحيات أساسية
### What should be removed
- عرض بيانات دخول افتراضية
### What should be added
- وحدات مراكز/مجلات/قوائم/فوتر/شهادات/شركاء/فعاليات مستقلة
### What should be modified
- SEO module ليصبح editable وليس read-only
### UX issues
- بعض الأزرار icon-only بدون aria-label
### UI issues
- جيدة كبداية
### Content issues
- إدارة صفحات عامة أكثر من إدارة كيانات مؤسسية متخصصة
### SEO issues
- إدارة SEO غير مكتملة
### Mobile issues
- واجهات admin ليست mobile-first بالكامل
### Final decision
Keep with major modifications
### Priority
Urgent

---

### صفحات موجودة كملفات وغير مستخدمة
- `artifacts/university/src/pages/About.tsx`
- `artifacts/university/src/pages/StudentServices.tsx`

**القرار**: Merge/Remove لتقليل التشتت والصيانة.

---

## 7. Missing Pages Analysis

| Required Page | Exists? | Current Route | Priority | Recommendation |
|---|---|---|---|---|
| Home | نعم | `/` | - | تحسين |
| About University | نعم (جزئي) | `/about` | Important | تفكيك لأقسام رسمية |
| Vision & Mission | لا (ضمن محتوى فقط) | - | Urgent | صفحة مستقلة |
| President Message | لا | - | Urgent | إضافة صفحة رسمية |
| University Council | لا | - | Urgent | إضافة صفحة رسمية |
| Faculties | نعم | `/colleges` | - | تحسين |
| Faculty Details | جزئي (كلية لا عضو) | `/colleges/:id` | Important | إضافة صفحة عضو هيئة تدريس |
| Academic Programs | نعم | `/programs` | - | تحسين |
| Diploma Programs | جزئي | فلتر في `/programs` | Urgent | صفحة/مسار مستقل |
| Master Programs | جزئي | فلتر في `/programs` | Urgent | صفحة/مسار مستقل |
| Doctorate Programs | جزئي | فلتر في `/programs` | Urgent | صفحة/مسار مستقل |
| Program Details | نعم | `/programs/:id` | - | تحسين |
| Admissions | نعم | `/admissions` | - | تحسين |
| Certificates | لا | - | Urgent | إضافة صفحة/وحدة |
| Centers | نعم (Generic) | `/centers` | Important | نمذجة مراكز |
| Journals | نعم (Generic) | `/journals` | Urgent | نمذجة مجلات |
| News | نعم | `/news` | - | تحسين |
| Events | جزئي | ضمن `/news` | Important | صفحة events مستقلة |
| Research / Publications | لا (جزئي جدًا) | - | Urgent | إضافة قسم بحث علمي |
| Partners & Accreditations | جزئي | `/memberships` | Urgent | إعادة بناء الصفحة |
| FAQ | نعم | `/faq` | - | تحسين |
| Contact Us | نعم | `/contact` | - | تحسين |
| Privacy Policy | نعم | `/privacy` | - | تحسين |
| Terms | لا | - | Important | إضافة |
| Sitemap Page (HTML) | لا | - | Later | إضافة صفحة خريطة موقع بشرية |

---

## 8. Content Architecture Audit

### الملاحظات الرئيسية
- الكليات والبرامج مفصولة بشكل جيد نسبيًا.
- المراحل الأكاديمية موجودة كـ filter وليست مسارات وصفحات مستقلة.
- المراكز والمجلات والاعتمادات تعتمد غالبًا على صفحة HTML عامة واحدة لكل مسار.
- الأخبار والفعاليات والمؤتمرات مجمعة في جدول واحد (حل عملي، لكن يحتاج IA أوضح للواجهة العامة).
- توجد عبارات تسويقية/بوابة رقمية أكثر من الصياغة المؤسسية الرسمية.

### توصيات إعادة التنظيم
1. اعتماد Content Models واضحة بدل HTML حر في صفحات مؤسسية حرجة:
   - Center
   - Journal
   - Accreditation/Partner
   - Policy page
2. فصل “البرامج حسب المرحلة” في IA:
   - `/programs/diploma`, `/programs/master`, `/programs/doctorate`
3. فصل “الأخبار” عن “الفعاليات” في الواجهة (حتى لو نفس الجدول داخليًا).
4. إنشاء “Institutional About Cluster”:
   - نبذة، رؤية، رسالة، القيادة، المجلس، الاعتماد.
5. اعتماد دليل أسلوبي ثنائي اللغة (Arabic formal + English institutional).

---

## 9. UI/UX Audit

| Issue | Location | Impact | Recommendation | Priority |
|---|---|---|---|---|
| `dir` العام ثابت LTR | `LanguageContext.tsx` | تجربة عربية مكسورة | ربط `dir` بـ `lang` فورًا | Urgent |
| Home يفرض LTR | `Home.tsx` | تشوه RTL في أهم صفحة | حذف `dir="ltr"` | Urgent |
| Navbar مزدحم جدًا | `PublicLayout.tsx` | حمل معرفي عالٍ | تقليل وتجميع العناصر | Urgent |
| رابط Dashboard علني | `PublicLayout.tsx` | لبس + صورة أمنية ضعيفة | إخفاؤه من الواجهة العامة | Urgent |
| Dropdown يعتمد hover | Navbar desktop | وصول ضعيف للكيبورد | دعم focus/keyboard navigation | Important |
| عبارة Editable content ظاهرة | `ContentPage.tsx` | إحساس غير احترافي | إزالتها من الواجهة العامة | Important |
| لا حالات Error واضحة للـqueries | معظم الصفحات | UX ضعيف عند فشل API | إضافة Empty/Error states موحدة | Important |
| 404 رسالة مطور | `not-found.tsx` | يضر الثقة | إعادة بناء صفحة 404 | Urgent |
| كثافة Motion | عدة صفحات | أداء/وصول | تقليل الحركة + `prefers-reduced-motion` | Important |
| Footer محدود معلوماتيًا | `PublicLayout.tsx` | ثقة مؤسسية منخفضة | Footer موسع (روابط رسمية، اعتماد، تواصل) | Important |
| عدم وجود Breadcrumbs | أغلب الصفحات التفصيلية | فقدان سياق | إضافة breadcrumbs | Later |
| أزرار أيقونية بلا label | admin CRUD tables | وصول أقل | `aria-label` لكل زر أيقوني | Important |

---

## 10. Global University Website Standard (Score 1-10)

| Area | Score | Notes |
|---|---:|---|
| Strong institutional homepage | 6/10 | جيد بصريًا، ناقص ثقة مؤسسية |
| Program discovery clarity | 7/10 | موجود لكن يحتاج مسارات مراحل مستقلة |
| Trust & accreditation blocks | 4/10 | ضعيف/جزئي |
| About section strength | 5/10 | صفحة عامة تحتاج تفكيك رسمي |
| Admissions path strength | 7/10 | نموذج موجود، محتوى إرشادي يحتاج توسعة |
| Faculty/program page professionalism | 8/10 | قوي خصوصًا Program Detail |
| Research/journals presence | 4/10 | موجودة كصفحات عامة غير نمذجية |
| News/events structure | 6/10 | مقبول لكن غير مفصول مؤسسيًا |
| Mobile-first execution | 7/10 | جيد إجمالًا مع نقاط ازدحام |
| SEO-friendly structure | 4/10 | SPA-only metadata + IDs + sitemap ناقص |
| Performance readiness | 6/10 | build جيد لكن bundle كبير نسبيًا |
| CMS manageability | 7/10 | قوي كبداية، ناقص وحدات مؤسسية |
| Accessibility | 5/10 | مشاكل RTL/keyboard/aria/reduced-motion |

**التقييم العام الحالي**: **6/10** لمستوى “جامعة عالمية”.

---

## 11. Dashboard / CMS Audit

| Module | Needed? | Exists? | Fields Required | Roles | Recommendation |
|---|---|---|---|---|---|
| Homepage sections | نعم | جزئي | hero, stats, featured blocks, CTA | super_admin, content_manager | بناء Section Builder |
| Pages | نعم | نعم | title/content/status/meta | admin/editor | الإبقاء + templates |
| About university | نعم | جزئي | intro, values, history | editor | تحويله لنموذج مؤسسي |
| Vision and mission | نعم | لا | vision, mission, values | editor | إضافة وحدة مستقلة |
| President message | نعم | لا | photo, message, signature | super_admin | إضافة وحدة مستقلة |
| University council | نعم | لا | members, positions, bios | admin | إضافة وحدة مستقلة |
| Faculties | نعم | نعم | data + rich sections | content_manager | تحسين |
| Academic programs | نعم | نعم | full program model | content_manager | تحسين |
| Diploma/Master/Doctorate | نعم | جزئي | stage pages + filters | content_manager | صفحات مستقلة لكل مرحلة |
| Centers | نعم | جزئي (page-content) | name, services, leadership | editor | نموذج بيانات Center |
| Journals | نعم | جزئي (page-content) | ISSN, board, issues | editor | نموذج بيانات Journal |
| News | نعم | نعم | type, date, content, media | editor | تحسين workflow |
| Events | نعم | جزئي (news.type) | venue, date, registration | editor | واجهة إدارة مستقلة |
| Certificates | نعم | لا | title, issuer, pdf, verify | admin | إضافة وحدة |
| Images/media | نعم | جزئي | alt ar/en, usage, size | editor | Media Library كاملة |
| PDF files | نعم | لا | file, category, page link | editor | وحدة ملفات |
| Contact messages | نعم | نعم | status, reply notes | marketing | تحسين |
| Contact information | نعم | نعم | phones, emails, branches | super_admin | تحسين |
| Social media links | نعم | نعم | links + icons | super_admin | جيد |
| Menus | نعم | لا | menu tree, visibility | super_admin | Menu Builder |
| Footer | نعم | لا | columns, links, legal text | super_admin | Footer Manager |
| SEO per page | نعم | جزئي | meta, og, canonical, robots | editor/marketing | توحيد SEO module |
| Users & roles | نعم | نعم | role matrix | super_admin | جيد |
| Arabic/English content | نعم | جزئي | fallback policy | editor | QA لغوي + completion checks |

---

## 12. SEO Audit

| SEO Issue | Location | Impact | Fix |
|---|---|---|---|
| Metadata الأساسية في `index.html` Placeholder | `artifacts/university/index.html` | انطباع ضعيف وفهرسة أولية سيئة | استبدالها بقيم مؤسسية نهائية |
| SEO يعتمد client-side فقط | `Seo.tsx` | ضعف فهرسة crawler بدون JS | Prerender/SSR أو static generation |
| روابط تفصيلية تعتمد IDs | `/colleges/:id`, `/programs/:id`, `/news/:id` | SEO أقل + UX أضعف | الانتقال إلى slugs |
| sitemap.xml بروابط نسبية | `public/sitemap.xml` | توافق SEO أقل | روابط مطلقة كاملة + domain |
| sitemap لا يغطي routes مهمة | `sitemap.xml` | صفحات لا تُكتشف | تضمين centers/journals/memberships/details |
| robots يسمح بكل شيء بما فيها admin | `public/robots.txt` | احتمال فهرسة صفحات الإدارة | Disallow `/admin`, `/api` |
| لا `hreflang` | `<head>` عبر `Seo.tsx` | ضعف SEO متعدد اللغة | إضافة hreflang ar/en |
| metadata عامة لصفحات details | `Seo.tsx` + details pages | OG/canonical غير مثالي | SEO per-entity by slug |
| لا Schema Article/Event تفصيلي | News/Events pages | فقدان rich results | إضافة JSON-LD لكل نوع |
| canonical ليس موحدًا مع slug strategy | `Seo.tsx` | خطر تكرار | توليد canonical دقيق لكل صفحة |
| لا صفحة Terms | غير موجود | ثقة/SEO قانوني أقل | إضافة Terms page |
| لا HTML sitemap page | غير موجود | discoverability أقل | إضافة `/sitemap` صفحة بشرية |

---

## 13. Performance Audit

### نتائج أوامر التحقق

| Command | Result | Notes |
|---|---|---|
| `pnpm run typecheck` | Success | جميع الحزم المستهدفة مرّت |
| `pnpm run build` | Failed | `spawn EPERM` في البيئة الحالية (قيود تنفيذ) |
| `pnpm --filter @workspace/university run build` | Success | build ناجح + تحذيرات sourcemap في بعض مكونات UI |
| `pnpm --filter @workspace/api-server run build` | Success | build ناجح |
| `pnpm run lint` | Failed | Missing script: lint |
| `pnpm run test` | Failed | Missing script: test |

### ملاحظات أداء من build/frontend
- `assets/index-*.js` تقريبًا **496KB** (gzip ~158KB).
- `assets/quill.snow-*.js` ~**208KB** (gzip ~62KB).
- CSS الأساسي `index-*.css` ~**146KB**.

### المخاطر والتوصيات

| Risk | Cause | Impact | Recommendation | Priority |
|---|---|---|---|---|
| حجم Bundle أولي مرتفع نسبيًا | مكتبات UI/Motion كثيرة | بطء أول تحميل خصوصًا موبايل | تحليل Bundle وتقسيم أدق للمسارات العامة | Important |
| صور عامة بدون `loading="lazy"` | `<img>` مباشر في صفحات عامة | استهلاك بيانات/بطء | lazy loading + dimensions/srcset | Urgent |
| لا Pagination للـnews/faculty | استرجاع كامل البيانات | تدهور الأداء مع التوسع | pagination + server-side limits | Important |
| حركة واجهة كثيرة | framer-motion واسع | CPU أعلى على أجهزة ضعيفة | تقليل motion + reduced-motion | Important |
| خطوط متعددة ومتكررة | Inter في `index.html` + Cairo/Tajawal في CSS | طلبات إضافية | توحيد استراتيجية الخطوط | Later |

> **شفافية**: لم يتم تنفيذ Lighthouse رقمية هنا؛ التقييم مبني على الكود وبنية build الظاهرة.

---

## 14. Accessibility Audit

| Issue | Location | Impact | Recommendation |
|---|---|---|---|
| RTL مكسور عالميًا | `LanguageContext.tsx`, `Home.tsx` | تجربة عربية ضعيفة جدًا | إصلاح `dir` حسب اللغة فورًا |
| قوائم hover-only جزئيًا | Navbar desktop | صعوبة keyboard navigation | دعم فتح عبر focus/keyboard |
| icon buttons بلا تسميات | Admin tables | Screen reader أقل وضوحًا | إضافة `aria-label` |
| لا دعم reduced motion | عام | إرهاق بصري لبعض المستخدمين | `prefers-reduced-motion` |
| 404 غير مترجمة | not-found | وصول لغوي ضعيف | نسخة عربية/إنجليزية احترافية |
| لا skip-to-content | Layout | تنقل أبطأ لذوي لوحة المفاتيح | إضافة Skip Link |
| تباين بعض النصوص الثانوية | Hero/footer text-muted | قابلية قراءة أقل | رفع contrast في النصوص الثانوية |

---

## 15. What Must Be Removed

| Item | Location | Why Remove | Replace With | Priority |
|---|---|---|---|---|
| رابط Dashboard من هيدر الزوار | `PublicLayout.tsx` | يربك المستخدم العام | دخول admin منفصل غير معلن | Urgent |
| بيانات دخول افتراضية معروضة | `admin/Login.tsx` | خطر أمني/ثقة | حذفها من الواجهة + سياسات وصول | Urgent |
| نص 404 الخاص بالمطور | `pages/not-found.tsx` | غير مؤسسي | صفحة 404 احترافية | Urgent |
| فرض `dir="ltr"` | `LanguageContext.tsx`, `Home.tsx` | كسر العربية | dir ديناميكي حسب اللغة | Urgent |
| عبارة “Editable content” | `ContentPage.tsx` | انطباع داخلي على صفحة عامة | إزالة العبارة | Important |
| الصفحات غير المستخدمة | `About.tsx`, `StudentServices.tsx` | ازدواجية وصيانة | دمج/حذف | Later |
| تسمية “Memberships” | Route/nav `/memberships` | مصطلح غير واضح مؤسسيًا | Partners & Accreditations | Important |

---

## 16. What Must Be Added

| Item | Where to Add | Why Important | Priority |
|---|---|---|---|
| Vision & Mission page | About cluster | عنصر مؤسسي أساسي | Urgent |
| President Message | About cluster | ثقة وهوية قيادية | Urgent |
| University Council | About cluster | حوكمة ومصداقية | Urgent |
| Certificates page | Public + CMS | مطلب أكاديمي متوقع | Urgent |
| Partners & Accreditations page | Public + CMS | بناء الثقة | Urgent |
| Events page مستقلة | Public | تنظيم المحتوى | Important |
| Research/Publications page | Public | صورة أكاديمية عالمية | Urgent |
| Terms page | Legal | متطلب قانوني/ثقة | Important |
| HTML Sitemap page | Public | discoverability | Later |
| Breadcrumbs | تفاصيل الكليات/البرامج/الأخبار | تحسين التنقل وSEO | Important |
| Search (site-wide) | Header | وصول أسرع للمعلومة | Important |
| CMS Menu Builder | Admin | إدارة IA دون تدخل مطور | Urgent |
| CMS Footer Builder | Admin | تحديث معلومات رسمية بسهولة | Important |
| CMS modules for centers/journals | Admin | إدارة مؤسسية صحيحة | Urgent |
| Anti-spam (captcha/rate-limit) | Admissions/Contact | جودة وموثوقية البيانات | Urgent |

---

## 17. What Must Be Modified

| Item | Current Problem | Suggested Modification | Expected Result | Priority |
|---|---|---|---|---|
| Routing strategy | IDs instead of slugs | دعم `/:slug` + redirects | SEO وتجربة أفضل | Urgent |
| SEO engine | جزئي وعام للصفحات التفصيلية | SEO per-entity + SSR/prerender | فهرسة أقوى | Urgent |
| Sitemap/Robots | ناقص/عام | dynamic sitemap + disallow admin/api | SEO نظيف وآمن | Urgent |
| Navbar | ازدحام وخلط | IA جديد بعناصر أقل | وضوح أعلى | Urgent |
| Homepage narrative | Portal tone | Institutional academic tone | صورة جامعة أقوى | Important |
| ContentPage model | HTML حر لكل شيء | قوالب محتوى متخصصة | اتساق وجودة | Important |
| News architecture | News+Events merged واجهة | فصل عرض/مسارات | تنظيم أفضل | Important |
| Admin SEO page | read-only | editable defaults + validations | تحكم أفضل | Important |
| Media management | عرض فقط | مكتبة وسائط كاملة مع تصنيف وalt | إدارة أسهل | Important |
| Error/empty states | ضعيفة | نظام حالات واضح موحّد | UX احترافية | Important |
| Accessibility | gaps متعددة | aria/keyboard/reduced-motion | شمولية أعلى | Important |
| Security posture | ثغرات ثقة ظاهرة | إزالة معلومات حساسة + hardening | ثقة أعلى | Urgent |

---

## 18. Priority Roadmap

### Urgent (قبل العرض الرسمي أو الإطلاق)
1. إصلاح RTL بالكامل (`document.dir` + Home layout).
2. إزالة رابط Dashboard من الواجهة العامة.
3. حذف بيانات الدخول الافتراضية من صفحة admin login.
4. إعادة بناء صفحة 404 بنص مؤسسي ثنائي اللغة.
5. اعتماد Slug URLs للكليات/البرامج/الأخبار.
6. إصلاح SEO الأساسي: Sitemap كامل، Robots منضبط، metadata مؤسسية فعلية.
7. بناء صفحات الثقة المفقودة: رسالة الرئيس، المجلس، الاعتمادات/الشركاء، الشهادات.
8. إضافة حماية spam لنماذج القبول والتواصل.

### Important (قبل الإطلاق النهائي)
1. إعادة هندسة Navigation وIA.
2. تحويل المراكز والمجلات من صفحات HTML عامة إلى نماذج بيانات.
3. فصل News عن Events في تجربة المستخدم.
4. تحسين Footer المؤسسي.
5. إضافة Breadcrumbs + FAQ schema + Article/Event schema.
6. تحسين الأداء: lazy image + pagination + motion tuning.

### Later (بعد الإطلاق)
1. HTML sitemap page.
2. بحث داخلي متقدم.
3. تحسينات تحليلية (engagement funnels).
4. تحسينات UI دقيقة حسب سلوك المستخدم الحقيقي.

---

## 19. Final Recommendation

- **الاتجاه الحالي جيد** كمشروع موقع جامعة تعريفي، وليس LMS.
- **لكن الموقع غير جاهز بعد** للعرض كواجهة جامعة عالمية دون معالجة الفجوات الحرجة المذكورة.
- الأولوية القصوى الآن: **RTL + الثقة المؤسسية + SEO البنيوي + IA**.
- ما يجب عدم إدخاله في هذا المشروع: أي وظائف LMS (درجات، اختبارات، إدارة فصل، تتبع تقدم).
- ما ينقل لمشروع LMS منفصل لاحقًا: جميع الوظائف التعليمية التشغيلية (حسابات طلاب/مدرسين التعليمية، المقررات التفاعلية، التقييمات، الفصول الافتراضية).

### أفضل خطوة تالية
1. اعتماد هذا التقرير كـ baseline.
2. تنفيذ Sprint إصلاحات Urgent (2-3 أسابيع).
3. ثم Sprint الهيكلة المؤسسية وCMS المتخصص (3-5 أسابيع).
4. ثم مراجعة UX/SEO نهائية قبل الإطلاق الرسمي.

---

## Appendix: ملاحظات فنية إضافية من الكود

- ملفات ومؤشرات رئيسية تمت مراجعتها:
  - `artifacts/university/src/App.tsx`
  - `artifacts/university/src/components/PublicLayout.tsx`
  - `artifacts/university/src/components/Seo.tsx`
  - `artifacts/university/src/contexts/LanguageContext.tsx`
  - `artifacts/university/public/sitemap.xml`
  - `artifacts/university/public/robots.txt`
  - `artifacts/api-server/src/routes/*`
  - `lib/db/src/schema/*`
- تم التحقق بأوامر build/typecheck كما هو موضح في قسم الأداء.
