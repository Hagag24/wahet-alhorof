# دليل رفع موقع الجامعة للإنتاج (Production Deployment Guide)

## ⚠️ ملاحظات مهمة قبل البدء

> **لا تقم بتشغيل أي أمر دون فهم ما يفعله**
> 
> **احتفظ بنسخة احتياطية من كل شيء قبل البدء**
> 
> **اختبر على Staging أولاً إذا أمكن**

---

## المتطلبات الأساسية

### خادم VPS مطلوب بمواصفات:

| المكون | الحد الأدنى | الموصى به |
|--------|-------------|-----------|
| CPU | 1 vCPU | 2 vCPU |
| RAM | 2 GB | 4 GB |
| Storage | 40 GB SSD | 80 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |
| Bandwidth | 2 TB/شهر | 4 TB/شهر |

### مزود موصى به:

- **Hostinger VPS KVM 2** (€9.99/شهر)
- **DigitalOcean Droplet** ($12/شهر)
- **Hetzner Cloud** (€8.50/شهر)

---

## الخطوة 1: إعداد الخادم (Server Setup)

### 1.1 الاتصال بالخادم

```bash
# استبدل YOUR_SERVER_IP بعنوان IP الخاص بك
ssh root@YOUR_SERVER_IP

# أو إذا كنت تستخدم مفتاح SSH
ssh -i ~/.ssh/your_key.pem root@YOUR_SERVER_IP
```

### 1.2 تحديث النظام

```bash
# تحديث الحزم
sudo apt update && sudo apt upgrade -y

# تثبيت الأدوات الأساسية
sudo apt install -y curl wget git nano ufw fail2ban
```

### 1.3 إنشاء مستخدم غير root (موصى به بشدة)

```bash
# إنشاء مستخدم جديد
sudo adduser university

# إضافته لمجموعة sudo
sudo usermod -aG sudo university

# تغيير المستخدم
su - university
```

---

## الخطوة 2: تثبيت Node.js و pnpm و PM2

### 2.1 تثبيت Node.js 20 LTS

```bash
# تثبيت NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# تثبيت Node.js
sudo apt install -y nodejs

# التحقق من التثبيت
node -v  # يجب أن يظهر v20.x.x
npm -v   # يجب أن يظهر 10.x.x
```

### 2.2 تثبيت pnpm

```bash
# تثبيت pnpm
npm install -g pnpm

# التحقق
pnpm -v  # يجب أن يظهر 9.x.x

# تكوين pnpm (اختياري)
pnpm config set store-dir ~/.pnpm-store
```

### 2.3 تثبيت PM2

```bash
# تثبيت PM2
npm install -g pm2

# التحقق
pm2 -v

# إعداد PM2 للتشغيل التلقائي
pm2 startup systemd
# اتبع الأمر الذي يظهره (عادةً يبدأ بـ sudo env PATH...)
```

---

## الخطوة 3: تثبيت Nginx و Certbot

### 3.1 تثبيت Nginx

```bash
sudo apt install -y nginx

# التحقق من تشغيل Nginx
sudo systemctl status nginx

# تفعيل التشغيل التلقائي
sudo systemctl enable nginx
```

### 3.2 تثبيت Certbot (للشهادات SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx

# التحقق
certbot --version
```

### 3.3 فتح المنافذ في الجدار الناري

```bash
# تفعيل UFW
sudo ufw enable

# السماح بـ SSH
sudo ufw allow ssh

# السماح بـ HTTP و HTTPS
sudo ufw allow 'Nginx Full'

# التحقق
sudo ufw status
```

---

## الخطوة 4: إعداد المشروع

### 4.1 إنشاء مجلد المشروع

```bash
# إنشاء المجلد
sudo mkdir -p /var/www/university

# تغيير الملكية للمستخدم
sudo chown -R $USER:$USER /var/www/university

# الانتقال للمجلد
cd /var/www/university
```

### 4.2 نسخ المشروع (خيار 1: Git Clone)

```bash
cd /var/www/university

# استنساخ من GitHub
git clone https://github.com/yourusername/your-repo.git .

# أو إذا كان repo خاصاً
git clone git@github.com:yourusername/your-repo.git .
```

### 4.3 نسخ المشروع (خيار 2: رفع ملفات مضغوطة)

```bash
cd /var/www/university

# من جهازك المحلي، استخدم scp
# (شغل هذا من جهازك المحلي)
scp -r /path/to/local/project/* university@YOUR_SERVER_IP:/var/www/university/

# أو استخدم rsync
rsync -avz --progress /path/to/local/project/ university@YOUR_SERVER_IP:/var/www/university/
```

### 4.4 إنشاء المجلدات اللازمة

```bash
cd /var/www/university

# إنشاء مجلدات البيانات والسجلات والنسخ الاحتياطية
mkdir -p data
mkdir -p logs
mkdir -p backups
mkdir -p uploads

# التأكد من وجود مجلد uploads
mkdir -p artifacts/api-server/public/uploads
```

---

## الخطوة 5: تثبيت الـ Dependencies

```bash
cd /var/www/university

# الموافقة على بناء الحزم ذات native modules
pnpm approve-builds

# تثبيت dependencies
pnpm install

# سيبدأ التثبيت - قد يستغرق 2-5 دقائق
```

---

## الخطوة 6: إعداد متغيرات البيئة

### 6.1 نسخ ملف البيئة

```bash
cd /var/www/university

# نسخ الملف المثال
cp .env.production.example .env.production

# تحرير الملف
nano .env.production
```

### 6.2 المتغيرات المطلوبة

املأ القيم التالية:

```bash
# Backend
NODE_ENV=production
PORT=3000
DATABASE_URL=file:/var/www/university/data/db.sqlite

# Frontend (Build-time)
BASE_PATH=/
VITE_API_BASE_URL=https://your-domain.com
```

### 6.3 تحميل المتغيرات للبيئة الحالية

```bash
# تحميل المتغيرات
export $(cat .env.production | xargs)
```

---

## الخطوة 7: بناء Frontend و Backend

### 7.1 بناء Frontend

```bash
cd /var/www/university

# بناء Frontend
pnpm --filter @workspace/university run build

# التحقق من وجود ملفات البناء
ls -la artifacts/university/dist/public/
```

### 7.2 بناء Backend

```bash
cd /var/www/university

# بناء Backend
pnpm --filter @workspace/api-server run build

# التحقق من وجود الملفات
ls -la artifacts/api-server/dist/
```

---

## الخطوة 8: تشغيل التطبيق عبر PM2

### 8.1 تشغيل التطبيق

```bash
cd /var/www/university

# تشغيل عبر PM2
pm2 start ecosystem.config.cjs

# التحقق من الحالة
pm2 status

# حفظ التكوين
pm2 save
```

### 8.2 التحقق من السجلات

```bash
# مشاهدة السجلات
pm2 logs

# أو
pm2 logs university-api --lines 50
```

### 8.3 التحقق من API

```bash
# اختبار API محلياً
curl http://127.0.0.1:3000/api/health

# يجب أن يظهر: {"status":"ok"} أو مشابه
```

---

## الخطوة 9: إعداد Nginx

### 9.1 نسخ ملف التكوين

```bash
# نسخ ملف التكوين
sudo cp deploy/nginx/university.example.conf /etc/nginx/sites-available/university

# فتح الملف للتعديل
sudo nano /etc/nginx/sites-available/university
```

### 9.2 تعديل العناصر النائبة (Placeholders)

استبدل في الملف:
- `example.com` ← بـ domainك الفعلي
- `www.example.com` ← (اختياري) subdomain
- `/var/www/university` ← إذا كان المسار مختلفاً

### 9.3 تفعيل الموقع

```bash
# إنشاء رابط رمزي
sudo ln -s /etc/nginx/sites-available/university /etc/nginx/sites-enabled/

# إزالة الموقع الافتراضي (اختياري)
sudo rm /etc/nginx/sites-enabled/default

# اختبار التكوين
sudo nginx -t

# إعادة تحميل Nginx
sudo systemctl reload nginx
```

---

## الخطوة 10: إعداد SSL (Let's Encrypt)

### 10.1 الحصول على شهادة

```bash
# تشغيل Certbot
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# اتبع التعليمات:
# - أدخل بريدك الإلكتروني
# - وافق على الشروط
# - اختر خيار redirect HTTP to HTTPS (موصى به)
```

### 10.2 التحقق من التجديد التلقائي

```bash
# اختبار التجديد
sudo certbot renew --dry-run

# التحقد من Cron job
systemctl list-timers | grep certbot
```

---

## الخطوة 11: التحقق من النشر

### 11.1 قائمة التحقق (Checklist)

```bash
# 1. الموقع الرئيسي
curl -I https://your-domain.com/
# يجب أن يظهر HTTP 200

# 2. API
curl https://your-domain.com/api/health
# يجب أن يظهر JSON مع status ok

# 3. Admin (افتح في المتصفح)
# https://your-domain.com/admin

# 4. صفحة ديناميكية
# https://your-domain.com/about

# 5. sitemap
curl https://your-domain.com/sitemap.xml

# 6. PM2 Status
pm2 status

# 7. Nginx Logs
sudo tail -f /var/log/nginx/access.log
```

### 11.2 حل المشاكل الشائعة

| المشكلة | الحل |
|---------|------|
| 502 Bad Gateway | تحقق من تشغيل PM2: `pm2 status` |
| 403 Forbidden | تحقق من صلاحيات المجلدات |
| API لا يستجيب | تحقق من PORT في .env |
| Database errors | تحقق من وجود مجلد data وصلاحياته |
| SSL errors | تأكد من تشغيل Certbot |

---

## الخطوة 12: إعداد النسخ الاحتياطي

### 12.1 إعداد Cron Jobs

```bash
# فتح crontab
sudo crontab -e

# إضافة الأسطر التالية:

# نسخ قاعدة البيانات يومياً الساعة 3 صباحاً
0 3 * * * /var/www/university/deploy/scripts/backup-db.sh >> /var/log/university-backup.log 2>&1

# نسخ uploads أسبوعياً (الأحد الساعة 4 صباحاً)
0 4 * * 0 /var/www/university/deploy/scripts/backup-uploads.sh >> /var/log/university-backup.log 2>&1
```

### 12.2 التحقق من النسخ الاحتياطي

```bash
# عرض قائمة النسخ الاحتياطية
ls -lh /var/www/university/backups/

# عرض حجم النسخ
du -sh /var/www/university/backups/
```

---

## الخطوة 13: الأمان

### 13.1 تغيير كلمة مرور Admin

```bash
# اذهب إلى Admin Panel في المتصفح
# https://your-domain.com/admin
# سجل الدخول بـ:
#   username: admin (أو كما هو في seed)
#   password: (ابحث في التعليمات أو في seed code)

# غيّر كلمة المرور فوراً!
```

### 13.2 تفعيل Fail2Ban (لحماية SSH)

```bash
# Fail2ban مثبت بالفعل
# تحقق من الحالة
sudo systemctl status fail2ban

# تكوينه (اختياري)
sudo nano /etc/fail2ban/jail.local
```

### 13.3 إخفاء معلومات Nginx

```bash
# في nginx.conf
sudo nano /etc/nginx/nginx.conf

# أضف في قسم http:
server_tokens off;
```

---

## ملخص الأوامر السريعة

```bash
# عرض حالة التطبيق
pm2 status

# عرض السجلات
pm2 logs

# إعادة تشغيل التطبيق
pm2 restart university-api

# إعادة تحميل (بدون انقطاع)
pm2 reload university-api

# اختبار Nginx
sudo nginx -t && sudo systemctl reload nginx

# عرض السجلات
sudo tail -f /var/log/nginx/error.log
```

---

## 📞 الدعم والمساعدة

إذا واجهت مشاكل:

1. افحص سجلات PM2: `pm2 logs`
2. افحص سجلات Nginx: `sudo tail /var/log/nginx/error.log`
3. تحقق من صلاحيات المجلدات: `ls -la /var/www/university/`
4. تأكد من تشغيل API: `curl http://127.0.0.1:3000/api/health`

---

**🎉 مبروك! موقع الجامعة يعمل الآن في الإنتاج!**

---

*آخر تحديث: يونيو 2026*
