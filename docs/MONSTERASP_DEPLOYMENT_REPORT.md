# تقرير دبلوي MonsterASP.NET

## 1. الملخص التنفيذي

تم إعداد المشروع للدبلوي على MonsterASP.NET - خدمة استضافة Node.js/IIS على Windows.

**الاستراتيجية المُتبعة**: تطبيق Node.js واحد يخدم كل شيء (API + Frontend Static + SPA Fallback)

**الحالة**: جاهز للدبلوي مع ملاحظات مهمة

---

## 2. هل MonsterASP مناسب للمشروع؟

### ✅ نعم - مع بعض القيود

| الجانب | التوافق | ملاحظات |
|--------|---------|---------|
| Node.js/Express | ✅ ممتاز | مدعوم عبر IISNode |
| React/Vite Frontend | ✅ جيد | يحتاج SPA fallback |
| SQLite | ⚠️ يحتاج عناية | يجب حماية من الحذف عند الرفع |
| File Uploads | ⚠️ يحتاج عناية | نفس تحذير الـ database |
| API Routes | ✅ ممتاز | عبر IIS rewrite |

### الفرق الرئيسي عن VPS:

- **لا PM2**: IISNode يدير الـ process
- **لا Nginx**: IIS هو الـ reverse proxy
- **Windows Paths**: استخدم forward slashes (/)
- **IIS Configuration**: عبر `web.config`

---

## 3. الفرق بين VPS Deployment و Monster Deployment

| العنصر | VPS (Linux) | MonsterASP (Windows) |
|--------|-------------|----------------------|
| **OS** | Ubuntu | Windows Server |
| **Web Server** | Nginx | IIS |
| **Process Manager** | PM2 | IISNode |
| **Config File** | `ecosystem.config.cjs` | `web.config` |
| **Entry Point** | `index.mjs` | `server.js` |
| **Database Path** | `/var/www/university/data/db.sqlite` | `./App_Data/db.sqlite` |
| **Control** | SSH كامل | Control Panel محدود |

---

## 4. الملفات التي تم إنشاؤها

### في `deploy/monsterasp/`:

| الملف | الوظيفة |
|-------|---------|
| `web.config` | تكوين IIS/IISNode |
| `.env.monster.example` | قالب متغيرات البيئة |
| `prepare-monster-deploy.ps1` | سكريبت PowerShell للبناء |
| `README_MONSTER_DEPLOYMENT.md` | دليل رفع عربي |

### ملفات جديدة يُنشئها السكريبت:

- `server.js` - Entry point للـ IISNode (يخدم API + Frontend)
- `dist-monster/` - مجلد جاهز للرفع

---

## 5. خطة تشغيل Node.js على Monster

### الـ Entry Point: `server.js`

```javascript
// يجمع بين:
// 1. Backend API (من api/index.mjs)
// 2. Frontend Static Files (React build)
// 3. SPA Fallback (React Router support)
```

### لماذا `server.js` وليس `index.mjs`؟

- IISNode يتعامل أفضل مع `.js` files
- يسمح بدمج Frontend + Backend في تطبيق واحد
- أسهل في تكوين IIS

### الطلبات:

| المسار | المعالج |
|--------|---------|
| `/api/*` | Express API routes |
| `/uploads/*` | Static files (uploads) |
| `/*` (fallback) | React SPA (index.html) |

---

## 6. خطة تشغيل React/Vite على Monster

### البناء:

```bash
# Frontend يُبنى كـ static files
pnpm --filter @workspace/university build
# Output: dist/public/
```

### الـ Serving:

Express (عبر `server.js`) يخدم:
- `index.html` - SPA entry
- `assets/` - CSS, JS, images
- كل المسارات تُعيد `index.html` (SPA fallback)

### IIS Configuration:

`web.config` يحتوي على SPA Fallback rule:

```xml
<rule name="SPAFallback">
  <match url=".*" />
  <conditions>
    <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
  </conditions>
  <action type="Rewrite" url="server.js" />
</rule>
```

---

## 7. خطة SQLite على Monster

### ⚠️ التحدي الرئيسي

MonsterASP قد يمسح مجلدات عند رفع إصدارات جديدة.

### الحل المُقترح

| المسار | السبب |
|--------|-------|
| `./App_Data/db.sqlite` | تقليد ASP.NET، عادةً محمي |
| `./data/db.sqlite` | بديل شائع |

### في `.env`:

```env
# استخدم مساراً نسبياً
DATABASE_URL=file:./App_Data/db.sqlite
```

### ملاحظة الأمان:

1. `web.config` يمنع الوصول للـ `.sqlite` files:
   ```xml
   <location path="App_Data">
     <system.webServer>
       <security>
         <requestFiltering>
           <hiddenSegments>
             <add segment="db.sqlite"/>
           </hiddenSegments>
         </requestFiltering>
       </security>
     </system.webServer>
   </location>
   ```

2. احفظ نسخة احتياطية قبل كل رفع جديد

---

## 8. خطة Uploads على Monster

### المسار المُقترح

```
public/uploads/
```

### الـ Serving

Express يخدم `/uploads/` مباشرة:

```javascript
app.use('/uploads', express.static('./public/uploads'));
```

### أو IIS مباشرة (أسرع)

```xml
<rule name="Uploads">
  <match url="^uploads/(.*)" />
  <action type="Rewrite" url="public/uploads/{R:1}" />
</rule>
```

### تحذير

- Uploads قد تُحذف عند الرفع الجديد
- خذ نسخة احتياطية قبل التحديثات
- اسأل دعم MonsterASP عن best practices

---

## 9. إعداد web.config

### الأقسام الرئيسية:

1. **IISNode Handler**: يخبر IIS بمعالجة الطلبات عبر Node.js
2. **Rewrite Rules**: توجيه المسارات:
   - `/api/*` → Node.js
   - `/uploads/*` → Static أو Node.js
   - `/*` → SPA Fallback
3. **Security Headers**: X-Frame-Options, X-Content-Type-Options
4. **Static Content**: Caching للـ assets

### الملف موجود في:

```
deploy/monsterasp/web.config
```

يرفع إلى MonsterASP root.

---

## 10. متغيرات البيئة المطلوبة

### `.env` file (أو MonsterASP Control Panel):

```env
# إلزامي
NODE_ENV=production
PORT=process.env.PORT  # MonsterASP يضبط هذا تلقائياً
DATABASE_URL=file:./App_Data/db.sqlite

# Frontend
VITE_API_BASE_URL=https://yourdomain.runasp.net

# أمان - ضروري جداً
AUTH_TOKEN_SECRET=your_random_secret_here
```

### في `.env.monster.example`:

- كل المتغيرات موثقة
- Paths Windows-compatible
- تحذيرات الأمان موجودة

---

## 11. خطوات الرفع على Monster

### 1. تجهيز (محلياً)

```powershell
.\deploy\monsterasp\prepare-monster-deploy.ps1
```

### 2. إعداد `.env`

```bash
cd dist-monster
cp .env.example .env
# عدل القيم
```

### 3. الرفع (عبر FTP أو File Manager)

- ارفع محتويات `dist-monster/` (وليس المجلد نفسه)
- إلى `wwwroot/` على MonsterASP

### 4. تثبيت Dependencies

- عبر MonsterASP Control Panel
- أو `npm install` إذا كان متاحاً

### 5. تكوين Node.js

- Entry Point: `server.js`
- Node Version: 20 LTS

### 6. الاختبار

- https://yourdomain.runasp.net/
- https://yourdomain.runasp.net/api/health
- https://yourdomain.runasp.net/admin

---

## 12. اختبارات بعد الرفع

### قائمة التحقق:

| الاختبار | المسار | النتيجة المتوقعة |
|----------|--------|------------------|
| الصفحة الرئيسية | `/` | يظهر الموقع |
| صفحة داخلية | `/about` | يعمل SPA fallback |
| Admin | `/admin` | لوحة التحكم |
| API Health | `/api/health` | JSON response |
| Login | `/api/auth/login` | يعمل |
| Sitemap | `/sitemap.xml` | XML file |
| Upload | `/api/upload` | يقبل الملفات |

---

## 13. المخاطر والقيود

### ⚠️ مخاطر معروفة:

| الخطر | التأثير | الـ Mitigation |
|-------|---------|----------------|
| Database يُحذف عند الرفع | 🔴 عالي | استخدم App_Data/، احفظ backup |
| Uploads تُحذف عند الرفع | 🔴 عالي | نسخ احتياطية قبل الرفع |
| Node.js version محدود | 🟡 متوسط | تحقق من MonsterASP docs |
| IISNode quirks | 🟡 متوسط | اختبارات شاملة |
| CORS issues | 🟡 متوسط | اضبط domains بعناية |

### ⚠️ قيود:

- لا PM2 clustering
- لا Nginx advanced features
- Limited server-side control

---

## 14. ما يحتاج تأكيد يدوي من لوحة Monster

### قبل الإطلاق:

1. ✅ **Node.js Version**: تأكد من دعم Node 18+ أو 20 LTS
2. ✅ **Writable Folders**: اسأل عن: "أي المجلدات تستمر عند الرفع الجديد؟"
3. ✅ **Database Location**: استخدم المسار الذي يوصيه MonsterASP
4. ✅ **Log Access**: تأكد من صلاحية قراءة logs/
5. ✅ **Domain/SSL**: اضبط الـ domain و SSL certificate

### بعد الرفع:

1. ✅ تغيير كلمة مرور Admin فوراً
2. ✅ تعيين `AUTH_TOKEN_SECRET` قوي
3. ✅ اختبار file uploads
4. ✅ اختبار database persistence (ارفع update صغير، تأكد من الـ DB)

---

## 15. القرار النهائي

### ✅ MonsterASP Deployment Ready with manual checks

الدبلوي جاهز، لكن يتطلب:

1. **تأكيد من دعم MonsterASP** حول:
   - المجلدات التي تستمر عند الرفع الجديد
   - أفضل مكان لـ SQLite database
   - إصدار Node.js المدعوم

2. **احتياطات إضافية**:
   - نسخ احتياطية يدوية قبل كل رفع
   - اختبار database persistence مبكراً
   - مراقبة logs بانتظام

### ⚠️ ملاحظة مهمة

إذا MonsterASP يمسح كل شيء عند الرفع (غير محتمل لكن ممكن)، فكر في:
- استخدام VPS بدلاً منه
- أو استخدام External Database (مثل SQLite Cloud أو Turso)
- أو استخدام Cloud Storage للـ uploads

---

## مقارنة سريعة: VPS vs MonsterASP

| الجانب | VPS (PM2+Nginx) | MonsterASP (IIS+IISNode) |
|--------|-----------------|--------------------------|
| **التحكم** | كامل | محدود |
| **السعر** | €10-15 | $5-10 |
| **الصعوبة** | متوسط | أسهل |
| **SQLite** | آمن | يحتاج عناية |
| **Node.js** | أي إصدار | محدود |
| **التوسع** | سهل | محدود |
| **التوصية** | للـ Production طويل المدى | للـ Demo/Small sites |

---

## ملفات الدبلوي المتوفرة

```
deploy/monsterasp/
├── web.config                    ✅ IIS Configuration
├── .env.monster.example          ✅ Environment Template
├── prepare-monster-deploy.ps1    ✅ Build Script
└── README_MONSTER_DEPLOYMENT.md  ✅ Arabic Guide
```

**ملفات VPS (ما زالت موجودة - لم تُحذف):**
```
deploy/
├── nginx/           ✅ VPS Nginx config
├── scripts/         ✅ VPS backup scripts
ecosystem.config.cjs ✅ VPS PM2 config
```

---

*تم إعداد: يونيو 2026*
*الحالة: جاهز للاختبار على MonsterASP*
