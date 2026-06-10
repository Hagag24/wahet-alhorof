# تقرير بنية دبلوي موقع الجامعة الإلكتروني الرسمي

## 1. الملخص التنفيذي

هذا المشروع هو **موقع جامعة إلكتروني رسمي** يتكون من:
- موقع عام للزوار (Public Website)
- لوحة تحكم إدارية (Admin Dashboard)
- نظام إدارة محتوى (CMS)
- واجهة برمجية خلفية (Backend API)
- قاعدة بيانات SQLite
- نظام استقبال طلبات القبول (Admissions)
- محتوى ديناميكي (Dynamic Content)
- sitemap API

**الحالة الحالية:** المشروع مكتمل تقنياً وجاهز للدبلوي على VPS مع PM2.

---

## 2. ملخص بنية المشروع الحالية

### 2.1. التقنيات المستخدمة

| المكون | التقنية |
|--------|---------|
| **Package Manager** | pnpm (monorepo workspace) |
| **Frontend** | React 19 + Vite 7 + TypeScript |
| **UI Framework** | TailwindCSS 4 + Radix UI + shadcn/ui |
| **Routing** | wouter (lightweight React router) |
| **Backend** | Express 5 + Node.js ESM |
| **Database** | SQLite via @libsql/client |
| **ORM** | Drizzle ORM |
| **Logger** | pino |
| **Build** | esbuild (backend) + Vite (frontend) |
| **Image Processing** | sharp |
| **File Upload** | multer |

### 2.2. هيكل المشروع (Monorepo)

```
workspace/
├── artifacts/
│   ├── university/          ← Frontend (React + Vite)
│   ├── api-server/          ← Backend (Express + API)
│   └── mockup-sandbox/      ← (أداة تطوير)
├── lib/
│   ├── db/                  ← Database + Schema
│   ├── api-client-react/    ← React hooks للـ API
│   └── api-zod/             ← Types + Validation
└── scripts/                 ← Seeding scripts
```

---

## 3. تحليل الـ Frontend

### 3.1. المواصفات التقنية

- **Framework:** React 19.1.0 (ESM)
- **Build Tool:** Vite 7.3.2
- **CSS:** TailwindCSS 4.1.14
- **Output:** Static files (SPA)
- **Build Output:** `artifacts/university/dist/public/`

### 3.2. ميزات الموقع

| Feature | التفاصيل |
|---------|----------|
| Public Pages | Home, About, Colleges, Programs, News, Admissions, Contact |
| Admin Dashboard | إدارة الكليات، البرامج، الأخبار، المحتوى، المستخدمين |
| CMS | Page content editor مع Quill.js |
| Media Upload | رفع صور وملفات للمحتوى |
| SEO | Meta tags + Open Graph + sitemap.xml |
| Responsive | Tailwind + Framer Motion |
| Multi-language | Arabic + English |

### 3.3. Environment Variables المطلوبة للبناء

```bash
BASE_PATH=/              # Base path للـ build
VITE_API_BASE_URL=       # رابط API في الإنتاج
```

### 3.4. البناء للإنتاج

```bash
pnpm --filter @workspace/university build
# Output: artifacts/university/dist/public/
```

---

## 4. تحليل الـ Backend/API

### 4.1. المواصفات التقنية

- **Runtime:** Node.js (ESM modules)
- **Framework:** Express 5.2.1
- **Database Client:** @libsql/client (SQLite)
- **ORM:** Drizzle ORM 0.45.2
- **Logger:** pino + pino-http
- **CORS:** configured للـ production domain
- **Security:** Helmet-like headers implemented

### 4.2. الـ API Routes

```
/api/
├── auth/           ← تسجيل دخول/خروج
├── colleges/       ← الكليات
├── programs/       ← البرامج الدراسية
├── news/           ← الأخبار
├── admissions/     ← طلبات القبول
├── faculty/        ← أعضاء هيئة التدريس
├── faqs/           ← الأسئلة الشائعة
├── page-content/   ← محتوى الصفحات (CMS)
├── institutional/  ← المحتوى المؤسسي
├── settings/       ← إعدادات الموقع
├── stats/          ← إحصائيات
├── media/          ← وسائط
├── upload/         ← رفع الملفات
├── users/          ← المستخدمين
├── contact/        ← رسائل التواصل
└── sitemap.xml     ← Sitemap
```

### 4.3. إدارة الملفات

- **Uploads:** `public/uploads/` (served as static)
- **Cache:** 1 year للـ uploads (immutable)

### 4.4. البناء للإنتاج

```bash
pnpm --filter @workspace/api-server build
# Output: artifacts/api-server/dist/
# الملفات: index.mjs + pino-workers + sourcemaps
```

### ⚠️ تحذير مهم للدبلوي

الـ `build.mjs` يستثني (externalize) الحزم التالية:
- `@libsql/client`
- `sharp`
- `better-sqlite3`

**هذا يعني:** يجب نسخ `node_modules` للإنتاج مع الـ build files.

---

## 5. تحليل قاعدة البيانات

### 5.1. النوع والموقع

| الخاصية | القيمة |
|---------|--------|
| **Type** | SQLite (file-based) |
| **Client** | @libsql/client |
| **ORM** | Drizzle ORM |
| **Default Location** | `file:../../sqlite.db` |
| **Production** | `file:/absolute/path/to/db.sqlite` |

### 5.2. الجداول الرئيسية (من schema)

- colleges, programs, news, faculty, admissions
- users (مع admin role)
- pageContent (CMS)
- institutional (المحتوى المؤسسي)
- settings, faqs, media, contact_messages
- stats

### 5.3. Schema Compatibility

الـ backend يشغّل `ensureSchemaCompatibility()` عند البداية — هذا يضمن أن الـ tables موجودة.

### 5.4. Default Admin

الـ backend يُنشئ admin افتراضي عند أول تشغيل (من `ensureDefaultAdmin`).

---

## 6. هل يمكن رفعه على GitHub Pages؟

### الإجابة: ❌ لا — جزئياً فقط

| الجزء | يعمل على GitHub Pages؟ |
|-------|------------------------|
| Frontend | ✅ نعم (static build) |
| Backend API | ❌ لا |
| Database | ❌ لا |
| Admin Dashboard | ❌ لا (تحتاج API) |
| Admissions | ❌ لا |

**السبب:** GitHub Pages يدعم static files فقط — لا Node.js runtime، لا database، لا API.

**الاستخدام الممكن:** Frontend فقط كـ "preview" بدون backend functionality.

---

## 7. هل يمكن رفعه على Vercel/Netlify؟

### 7.1. Vercel

| الجزء | يعمل على Vercel؟ |
|-------|------------------|
| Frontend | ✅ نعم (ممتاز) |
| Backend (Serverless) | ⚠️ معقد — يحتاج تحويل للـ Serverless Functions |
| Database | ❌ لا — يحتاج external DB (Turso/Planetscale) |

**التحدي:** المشروع يستخدم Express + SQLite — يحتاج إعادة هيكلة كبيرة للـ Vercel Serverless.

**التوصية:** Vercel للـ Frontend فقط + VPS منفصل للـ Backend/Database.

### 7.2. Netlify

| الجزء | يعمل على Netlify؟ |
|-------|-------------------|
| Frontend | ✅ نعم |
| Backend (Functions) | ⚠️ محدود |
| Database | ❌ لا |

**نفس مشكلة Vercel.**

---

## 8. هل يمكن رفعه على Hostinger Shared Hosting؟

### الإجابة: ❌ لا — أو ⚠️ بتعديلات كبيرة

| المشكلة | التوضيح |
|---------|---------|
| Node.js | Shared Hosting لا يدعم Node.js runtime بشكل موثوق |
| SQLite | يعمل، لكن الـ API لا |
| ESM | cPanel shared hosting قديم لا يدعم ESM جيداً |
| Express | يحتاج VPS |

**الاستثناء الوحيد:** Hostinger Node.js Hosting (ولكنه محدود ومكلف).

**التوصية:** لا — VPS هو الحل الأمثل.

---

## 9. هل VPS هو الأنسب؟

### الإجابة: ✅ نعم — VPS هو الحل الأمثل

| الميزة | التوافق مع المشروع |
|--------|-------------------|
| Node.js Runtime | ✅ كامل |
| SQLite | ✅ ملف محلي |
| Express API | ✅ كامل |
| Nginx Reverse Proxy | ✅ مثالي |
| PM2 Process Management | ✅ ممتاز |
| SSL/Let's Encrypt | ✅ سهل |
| Cost | ✅ أرخص من Serverless لفترة طويلة |
| Control | ✅ كامل |

---

## 10. مقارنة خيارات الدبلوي

### جدول المقارنة الشامل

| الخيار | GitHub Pages | Vercel/Netlify | Hostinger Shared | Hostinger VPS | DigitalOcean |
|--------|-------------|----------------|------------------|---------------|--------------|
| **Frontend** | ✅ | ✅ | ⚠️ | ✅ | ✅ |
| **Backend** | ❌ | ⚠️ | ❌ | ✅ | ✅ |
| **Database** | ❌ | ❌ | ⚠️ | ✅ | ✅ |
| **Node.js** | ❌ | ⚠️ | ❌ | ✅ | ✅ |
| **SQLite** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Complexity** | منخفضة | متوسطة | - | متوسطة | متوسطة |
| **Cost** | مجاني | متغير | رخيص | €5-10/شهر | $6-12/شهر |
| **التوصية** | ❌ | ⚠️ جزئي | ❌ | ✅ | ✅ |

### مقارنة PM2 vs Docker

| الخيار | PM2 | Docker |
|--------|-----|--------|
| **Complexity** | بسيط | متوسط |
| **Resource Usage** | أقل | أعلى قليلاً |
| **Portability** | Node.js فقط | أي بيئة |
| **Restart** | PM2 handles | Docker restarts |
| **Database** | على نفس السيرفر | container أو mounted volume |
| **Logs** | PM2 logs | Docker logs |
| **Scaling** | PM2 cluster mode | Docker compose scale |
| **Backup** | ملفات + scripts | volumes |
| **التوصية للمبتدئين** | ✅ | ⚠️ |

---

## 11. التوصية النهائية

### الخيار المُوصى به: **Hostinger VPS + PM2 + Nginx**

**السبب:**
1. المشروع يستخدم Express + SQLite — يحتاج Node.js runtime كامل
2. PM2 أبسط من Docker للـ Node.js developers
3. Hostinger VPS أرخص وأقرب (EU servers) للجامعة في UK
4. Nginx reverse proxy مع SSL سهل الإعداد
5. SQLite file-based لا يحتاج database server منفصل

---

## 12. المواصفات المقترحة للسيرفر

### 12.1. للـ Staging / Development

| المكون | المواصفة |
|--------|----------|
| **CPU** | 1 vCPU |
| **RAM** | 1-2 GB |
| **Storage** | 20 GB SSD |
| **OS** | Ubuntu 22.04 LTS |
| **Bandwidth** | 1 TB/شهر |
| **السعر المُقدر** | €3-5/شهر |

### 12.2. للـ Production (Minimum)

| المكون | المواصفة |
|--------|----------|
| **CPU** | 1 vCPU |
| **RAM** | 2 GB |
| **Storage** | 40 GB SSD |
| **OS** | Ubuntu 22.04 LTS |
| **Bandwidth** | 2 TB/شهر |
| **Database** | Same server (SQLite) |
| **Backup** | يومي (cron) |
| **السعر المُقدر** | €5-8/شهر |

### 12.3. للـ Production (Comfortable)

| المكون | المواصفة |
|--------|----------|
| **CPU** | 2 vCPU |
| **RAM** | 4 GB |
| **Storage** | 80 GB SSD |
| **OS** | Ubuntu 22.04 LTS |
| **Bandwidth** | 4 TB/شهر |
| **Database** | Same server (SQLite) أو Turso cloud |
| **CDN** | Cloudflare (مجاني) |
| **Backup** | يومي + أسبوعي |
| **السعر المُقدر** | €10-15/شهر |

### 12.4. Hostinger VPS Recommendation

**للـ Production:** Hostinger VPS KVM 2 (€9.99/month)
- 2 vCPU
- 4 GB RAM
- 80 GB SSD
- 4 TB Bandwidth

**للـ Staging:** Hostinger VPS KVM 1 (€5.99/month)
- 1 vCPU
- 2 GB RAM
- 40 GB SSD

---

## 13. PM2 أم Docker؟

### التوصية: **PM2** للمشروع الحالي

**لماذا PM2؟**

1. **أبسط:** لا يحتاج learning curve كبير
2. **مناسب للـ Node.js:** PM2 مُحسن للـ Node.js applications
3. **SQLite:** أسهل إدارة ملفات SQLite مع PM2
4. **Uploads:** الملفات المرفوعة تُخزن local — لا volume complexity
5. **Monitoring:** PM2 provides built-in monitoring
6. **Zero-downtime deploy:** PM2 graceful reload

**متى ننتقل لـ Docker؟**
- إذا أضفت LMS في المستقبل
- إذا أصبح لديك 3+ microservices
- إذا أردت multi-environment consistency
- إذا أردت Kubernetes في المستقبل

---

## 14. متغيرات البيئة المطلوبة

### 14.1. Backend Environment Variables

| المتغير | مطلوب؟ | مثال | الوصف |
|---------|--------|------|-------|
| `NODE_ENV` | نعم | `production` | بيئة التشغيل |
| `PORT` | نعم | `3000` | منفذ الـ API |
| `DATABASE_URL` | نعم | `file:/var/www/db.sqlite` | مسار قاعدة البيانات |

### 14.2. Frontend Environment Variables (Build-time)

| المتغير | مطلوب؟ | مثال | الوصف |
|---------|--------|------|-------|
| `BASE_PATH` | نعم | `/` | Base path للـ build |
| `VITE_API_BASE_URL` | نعم | `https://api.example.com` | رابط API الإنتاج |

### 14.3. Variables اختيارية (مُوصى بها)

| المتغير | مثال | الغرض |
|---------|------|-------|
| `PM2_INSTANCES` | `max` | عدد instances في PM2 |
| `PM2_EXEC_MODE` | `cluster` | cluster vs fork |
| `LOG_LEVEL` | `info` | مستوى الـ logging |

---

## 15. خطة رفع أول مرة (First Deployment)

### الخطوة 1: إعداد السيرفر

```bash
# 1. تحديث النظام
sudo apt update && sudo apt upgrade -y

# 2. تثبيت Node.js (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. تثبيت pnpm
npm install -g pnpm

# 4. تثبيت PM2
npm install -g pm2

# 5. تثبيت Nginx
sudo apt install -y nginx

# 6. تثبيت Certbot (للـ SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### الخطوة 2: إعداد المشروع

```bash
# 1. إنشاء مجلد التطبيق
sudo mkdir -p /var/www/university
sudo chown -R $USER:$USER /var/www/university

# 2. clone من GitHub (أو رفع الملفات)
cd /var/www/university
git clone <repo-url> .

# 3. تثبيت dependencies
pnpm install

# 4. بناء Frontend
pnpm --filter @workspace/university build

# 5. بناء Backend
pnpm --filter @workspace/api-server build
```

### الخطوة 3: إعداد PM2

```bash
# إنشاء ecosystem.config.cjs
cat > /var/www/university/ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [
    {
      name: 'university-api',
      script: './artifacts/api-server/dist/index.mjs',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL: 'file:/var/www/university/data/db.sqlite'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
EOF

# إنشاء مجلدات logs و data
mkdir -p /var/www/university/logs
mkdir -p /var/www/university/data

# تشغيل التطبيق
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### الخطوة 4: إعداد Nginx

```bash
sudo tee /etc/nginx/sites-available/university << 'EOF'
server {
    listen 80;
    server_name example.com www.example.com;

    # Frontend (Static)
    location / {
        root /var/www/university/artifacts/university/dist/public;
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # API
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads
    location /uploads/ {
        alias /var/www/university/artifacts/api-server/public/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Sitemap
    location = /sitemap.xml {
        proxy_pass http://localhost:3000/api/sitemap.xml;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/university /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### الخطوة 5: SSL مع Let's Encrypt

```bash
sudo certbot --nginx -d example.com -d www.example.com
sudo certbot renew --dry-run
```

### الخطوة 6: التحقق

```bash
# التحقق من API
curl https://example.com/api/health

# التحقق من Frontend
# افتح https://example.com في المتصفح

# التحقق من PM2
pm2 status
pm2 logs university-api
```

---

## 16. خطة تحديثات مستقبلية

### نموذج سير عمل التحديث

```bash
# 1. دخول مجلد المشروع
cd /var/www/university

# 2. سحب التحديثات (أو رفع ملفات جديدة)
git pull origin main

# 3. تثبيت dependencies الجديدة
pnpm install

# 4. Type check
pnpm run typecheck

# 5. بناء Frontend
pnpm --filter @workspace/university build

# 6. بناء Backend
pnpm --filter @workspace/api-server build

# 7. graceful reload عبر PM2
pm2 reload university-api

# 8. التحقق
pm2 status
curl https://example.com/api/health
```

### Backup قبل التحديث

```bash
# نسخ احتياطي لقاعدة البيانات
cp /var/www/university/data/db.sqlite /var/www/university/backups/db-$(date +%Y%m%d-%H%M%S).sqlite

# نسخ احتياطي للـ uploads
tar -czf /var/www/university/backups/uploads-$(date +%Y%m%d-%H%M%S).tar.gz /var/www/university/artifacts/api-server/public/uploads/
```

---

## 17. خطة Nginx/SSL

### 17.1. Nginx Configuration Summary

| Location | Destination | Purpose |
|----------|-------------|---------|
| `/` | Frontend static build | الموقع العام |
| `/api/` | Backend (port 3000) | API endpoints |
| `/uploads/` | `/public/uploads/` | الملفات المرفوعة |
| `/sitemap.xml` | Backend API | SEO sitemap |

### 17.2. SSL/Let's Encrypt

- **Auto-renewal:** Certbot يُعيد التجديد تلقائياً
- **HTTPS redirect:** Nginx يُجبر HTTPS
- **HSTS:** مُفعل (CSP headers موجودة في app.ts)

### 17.3. Security Headers (موجودة في الـ Backend)

الـ `app.ts` يُرسل بالفعل:
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- Referrer-Policy: strict-origin-when-cross-origin
- Content-Security-Policy

---

## 18. خطة قاعدة البيانات والنسخ الاحتياطي

### 18.1. استراتيجية النسخ الاحتياطي

| النوع | التردد | الطريقة |
|-------|--------|---------|
| Database | يومي | `cp` + `gzip` |
| Uploads | أسبوعي | `tar -czf` |
| Full backup | شهري | `rsync` لـ remote |

### 18.2. Cron Jobs

```bash
# Daily database backup
0 3 * * * /var/www/university/scripts/backup-db.sh

# Weekly uploads backup
0 4 * * 0 /var/www/university/scripts/backup-uploads.sh
```

### 18.3. Backup Script مُقترح

```bash
#!/bin/bash
# /var/www/university/scripts/backup-db.sh

BACKUP_DIR="/var/www/university/backups"
DB_PATH="/var/www/university/data/db.sqlite"
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p "$BACKUP_DIR"
cp "$DB_PATH" "$BACKUP_DIR/db-$DATE.sqlite"
gzip "$BACKUP_DIR/db-$DATE.sqlite"

# احتفاظ بـ 7 نسخ فقط
ls -t "$BACKUP_DIR"/db-*.sqlite.gz | tail -n +8 | xargs -r rm
```

### 18.4. Database Migration Strategy

الـ `ensureSchemaCompatibility()` في الـ backend يُنشئ tables تلقائياً — لا migrations يدوية مطلوبة.

---

## 19. خطة ملفات الصور والوسائط

### 19.1. الهيكل الحالي

- **Location:** `artifacts/api-server/public/uploads/`
- **Serving:** Express static middleware
- **Production:** يُقدم عبر Nginx (faster)

### 19.2. في الإنتاج

```nginx
location /uploads/ {
    alias /var/www/university/artifacts/api-server/public/uploads/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 19.3. Backup

يجب نسخ المجلد بأكمله أسبوعياً — الصور لا تُخزن في database.

### 19.4. متى ننتقل لـ Object Storage؟

| الحالة | الحل |
|--------|------|
| < 10 GB uploads | Local storage كافي |
| > 50 GB uploads | AWS S3 / Cloudflare R2 |
| High traffic | CDN (Cloudflare) |

---

## 20. مخاطر الإنتاج

### 20.1. المخاطر التقنية

| الخطر | الاحتمال | التأثير | ال mitigation |
|-------|----------|---------|--------------|
| SQLite corruption | منخفض | عالي | Backups يومية |
| Disk full | متوسط | عالي | Monitoring + alerts |
| Node.js crash | منخفض | متوسط | PM2 auto-restart |
| Security breach | منخفض | عالي | Updates + firewall |
| DDoS | منخفض | متوسط | Cloudflare (مجاني) |

### 20.2. المخاطر التشغيلية

| الخطر | الاحتمال | ال mitigation |
|-------|----------|--------------|
| نسيان كلمة مرور admin | متوسط | Seed admin documented |
| فقدان الـ database | منخفض | Backups متعددة |
| عدم توفر السيرفر | منخفض | VPS provider SLA |

### 20.3. المخاطر الأمنية

| الخطر | الـ Status |
|-------|-----------|
| Default credentials | ✅ لا — seed admin مختلف |
| SQL Injection | ✅ محمي — Drizzle ORM |
| XSS | ✅ محمي — CSP headers |
| CSRF | ⚠️ يحتاج review |
| File upload abuse | ⚠️ multer configured — check types |

---

## 21. Checklist قبل الإطلاق

### 21.1. إعداد السيرفر ✅

- [ ] Node.js 20+ مثبت
- [ ] pnpm مثبت
- [ ] PM2 مثبت ويعمل
- [ ] Nginx مثبت ويعمل
- [ ] SSL certificate صالح
- [ ] Firewall مُفعّل (ufw)

### 21.2. التطبيق ✅

- [ ] Frontend build ناجح
- [ ] Backend build ناجح
- [ ] node_modules مُنصّبة للـ production
- [ ] Environment variables مُعرفة
- [ ] Database path صحيح ومُنشئ
- [ ] Uploads folder قابل للكتابة

### 21.3. PM2 ✅

- [ ] PM2 config صحيح
- [ ] Application يعمل (online)
- [ ] Logs تُسجل
- [ ] Auto-start مُفعّل (pm2 startup)

### 21.4. Nginx ✅

- [ ] Config test ناجح
- [ ] Frontend يُقدم
- [ ] API يُعبر (proxy)
- [ ] Uploads يُقدم
- [ ] SSL يعمل

### 21.5. التحقق النهائي ✅

- [ ] الصفحة الرئيسية load
- [ ] Admin login يعمل
- [ ] API endpoints responsive
- [ ] File upload يعمل
- [ ] Database persistent
- [ ] Backups تُنشئ

---

## 22. القرار النهائي

### التوصية المُوحدة: **VPS + PM2 + Nginx**

**Host:** Hostinger VPS KVM 2 (أو مماثل)
**OS:** Ubuntu 22.04 LTS
**Process Manager:** PM2
**Reverse Proxy:** Nginx
**SSL:** Let's Encrypt (Certbot)
**Database:** SQLite (file-based)
**Backup:** Cron + scripts

---

### لماذا هذا الخيار؟ — 5 أسباب واضحة

1. **تطابق تام مع التقنية:** المشروع Express + SQLite — VPS يُعطي Node.js runtime كامل
2. **سهولة الإدارة:** PM2 أسهل من Docker للـ Node.js developers
3. **تكلفة مناسبة:** €10/شهر أرخص من Serverless على المدى الطويل
4. **تحكم كامل:** Nginx reverse proxy + SSL + caching تحت سيطرتك
5. **قابلية التوسع:** يمكن إضافة LMS في المستقبل على نفس السيرفر

---

### متى نُغيّر الاستراتيجية؟

| الحالة | التغيير المُقترح |
|--------|------------------|
| Users > 10,000/يوم | Add CDN (Cloudflare) |
| Database > 5 GB | Migrate to PostgreSQL |
| Traffic > 100k/يوم | Multiple VPS + Load Balancer |
| 3+ microservices | Docker Compose |
| Team > 5 developers | Kubernetes |

---

## 23. الملخص النهائي

| الجانب | التوصية |
|--------|---------|
| **المنصة** | Hostinger VPS (أو DigitalOcean) |
| **المواصفات** | 2 vCPU / 4 GB RAM / 80 GB SSD |
| **الإدارة** | PM2 + Nginx |
| **Database** | SQLite (local file) |
| **SSL** | Let's Encrypt |
| **Backup** | Daily (cron) |
| **CDN** | Cloudflare (اختياري) |
| **Cost** | €10-15/شهر |

---

**الحالة:** المشروع جاهز للدبلوي فوراً على VPS.

**الخطوة التالية:** طلب VPS من Hostinger (أو مزود آخر) وبدء إعداد السيرفر.

---

*تم إعداد هذا التقرير بناءً على تحليل شامل للمشروع.*
*آخر تحديث: يونيو 2026*
