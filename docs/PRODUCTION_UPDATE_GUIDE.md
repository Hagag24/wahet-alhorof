# دليل تحديث موقع الجامعة في الإنتاج

## نظرة عامة

هذا الدليل يشرح كيفية تحديث الموقع بأمان بعد التغييرات الأولية.

> ⚠️ **مهم جداً**: دائماً قم بعمل نسخة احتياطية قبل أي تحديث!

---

## قبل التحديث: قائمة التحقق

- [ ] هل لديك وصول SSH للخادم؟
- [ ] هل النسخ الاحتياطي يعمل؟ (اختبره مرة واحدة على الأقل)
- [ ] هل لديك وقت للمراقبة بعد التحديث؟
- [ ] هل اختبرت التغييرات على Staging (إن وجد)؟

---

## الخطوة 1: الدخول إلى الخادم

```bash
ssh university@YOUR_SERVER_IP

# أو
ssh -i ~/.ssh/your_key.pem university@YOUR_SERVER_IP
```

---

## الخطوة 2: الانتقال إلى مجلد المشروع

```bash
cd /var/www/university

# التحقق من الموقع
pwd
# يجب أن يظهر: /var/www/university
```

---

## الخطوة 3: عمل نسخة احتياطية (إلزامي!)

### 3.1 نسخ قاعدة البيانات

```bash
# تشغيل سكريبت النسخ الاحتياطي
bash deploy/scripts/backup-db.sh

# أو يدوياً:
cp data/db.sqlite backups/db-$(date +%Y%m%d-%H%M%S).sqlite
gzip backups/db-*.sqlite
```

### 3.2 نسخ Uploads

```bash
# تشغيل سكريبت النسخ
bash deploy/scripts/backup-uploads.sh

# أو يدوياً:
tar -czf backups/uploads-$(date +%Y%m%d-%H%M%S).tar.gz artifacts/api-server/public/uploads/
```

### 3.3 التحقق من النسخ

```bash
# عرض قائمة النسخ
ls -lh backups/

# يجب أن ترى ملفات db-*.sqlite.gz و uploads-*.tar.gz
```

---

## الخطوة 4: سحب التحديثات الجديدة

### 4.1 إذا كنت تستخدم Git

```bash
# حفظ أي تغييرات محلية (إن وجدت)
git stash

# سحب آخر التحديثات
git pull origin main
# أو
git pull origin master

# إذا كانت هناك تعارضات، قم بحلها أولاً
```

### 4.2 إذا كنت ترفع ملفات يدوياً

```bash
# من جهازك المحلي، شغل:
rsync -avz --progress --exclude=node_modules \
  --exclude=data --exclude=logs --exclude=backups \
  /path/to/local/project/ university@YOUR_SERVER_IP:/var/www/university/
```

---

## الخطوة 5: تثبيت الـ Dependencies الجديدة

```bash
# تثبيت dependencies (مثل npm install)
pnpm install

# أو إذا أردت تثبيت دقيق:
pnpm install --frozen-lockfile
```

> ملاحظة: هذا قد يستغرق 1-3 دقائق

---

## الخطوة 6: اختبار Type Check (اختياري لكن موصى به)

```bash
# تشغيل فحص الأنواع
pnpm run typecheck

# إذا فشل، يمكنك:
# 1. إصلاح الأخطاء أولاً
# 2. أو المتابعة على مسؤوليتك (غير موصى به)
```

---

## الخطوة 7: بناء المشروع

### 7.1 بناء Frontend

```bash
pnpm --filter @workspace/university run build

# التحقق
ls -la artifacts/university/dist/public/
```

### 7.2 بناء Backend

```bash
pnpm --filter @workspace/api-server run build

# التحقق
ls -la artifacts/api-server/dist/
```

---

## الخطوة 8: إعادة تشغيل التطبيق

### الخيار أ: إعادة تحميل سلس (Graceful Reload) - موصى به

```bash
# إعادة تحميل بدون انقطاع
pm2 reload university-api

# هذا يبقي الموقع يعمل أثناء التحديث
```

### الخيار ب: إعادة تشغيل كاملة

```bash
# إعادة تشغيل (قد يسبب انقطاع بسيط)
pm2 restart university-api
```

### الخيار ج: استخدام سكريبت التحديث

```bash
# تشغيل سكريبت التحديث الشامل
bash deploy/scripts/deploy-update.sh
```

> هذا السكريبت يفعل كل شيء: backup → pull → install → build → reload

---

## الخطوة 9: التحقق من التحديث

### 9.1 فحص حالة PM2

```bash
pm2 status

# يجب أن يظهر university-api بـ status: online
```

### 9.2 فحص السجلات

```bash
# آخر 20 سطر من السجلات
pm2 logs university-api --lines 20

# أو تتبع السجلات في الوقت الحقيقي
pm2 logs
# اضغط Ctrl+C للخروج
```

### 9.3 اختبار API

```bash
# اختبار محلي
curl http://127.0.0.1:3000/api/health

# اختبار عبر النطاق
curl https://your-domain.com/api/health
```

### 9.4 اختبار الموقع في المتصفح

افتح في المتصفح:

1. **الصفحة الرئيسية**: https://your-domain.com/
2. **صفحة داخلية**: https://your-domain.com/about
3. **Admin**: https://your-domain.com/admin (جرب تسجيل الدخول)
4. **API**: https://your-domain.com/api/health

### 9.5 اختبار رفع الملفات

1. ادخل إلى Admin
2. حاول رفع صورة
3. تأكد من ظهورها

---

## خطوات التراجع (Rollback) - في حالة المشاكل

إذا حدثت مشاكل بعد التحديث، يمكنك التراجع:

### التراجع السريع (باستخدام PM2)

```bash
# إذا كنت تستخدم PM2 مع Git أو إصدارات سابقة:
pm2 reload university-api --env previous

# أو ببساطة أعد تشغيل الإصدار السابق:
pm2 restart university-api
```

### التراجع الكامل (من النسخ الاحتياطي)

```bash
# 1. إيقاف التطبيق
pm2 stop university-api

# 2. استعادة قاعدة البيانات
ls -t backups/db-*.sqlite.gz | head -1
# خذ أحدث نسخة

gunzip -c backups/db-20240115-030000.sqlite.gz > data/db.sqlite

# 3. استعادة الملفات (إذا لزم)
# tar -xzf backups/uploads-xxx.tar.gz

# 4. إعادة تشغيل
pm2 start university-api

# 5. التحقق
curl https://your-domain.com/api/health
```

---

## سير عمل التحديث المُختصر (Quick Update)

للتحديثات الصغيرة والمكررة:

```bash
# كل شيء في أمر واحد:
ssh university@YOUR_SERVER_IP "cd /var/www/university && bash deploy/scripts/deploy-update.sh"
```

---

## نصائح وأفضل الممارسات

### 1. تحديثات منتظمة

- **صغيرة**: يومياً أو أسبوعياً للـ bug fixes
- **متوسطة**: شهرياً للـ features الجديدة
- **كبيرة**: ربع سنوياً للـ major updates

### 2. وقت التحديث

- اختر وقت فراغ المستخدمين (منتصف الليل حسب timezone الجامعة)
- تجنب أوقات التسجيل والامتحانات
- أخبر الفريق قبل التحديثات الكبيرة

### 3. مراقبة بعد التحديث

راقب لمدة 30 دقيقة بعد التحديث:

```bash
# في terminal منفصل:
watch -n 5 'pm2 status && curl -s https://your-domain.com/api/health'
```

### 4. سجل التحديثات

احتفظ بسجل للتحديثات:

```bash
# أنشئ ملف CHANGELOG.txt في الخادم
echo "$(date): Updated to version X.X - Changes: ..." >> /var/www/university/CHANGELOG.txt
```

---

## حل المشاكل الشائعة

### المشكلة: الموقع لا يعمل بعد التحديث

```bash
# 1. افحص PM2
pm2 status
pm2 logs

# 2. تحقق من البناء
ls -la artifacts/university/dist/public/
ls -la artifacts/api-server/dist/

# 3. تحقق من الـ Environment
cat .env.production

# 4. أعد التشغيل
pm2 restart university-api
```

### المشكلة: Database errors

```bash
# تحقق من وجود Database
ls -la data/db.sqlite

# تحقق من الصلاحيات
chmod 644 data/db.sqlite

# استعادة من نسخة احتياطية إذا لزم
```

### المشكلة: 502 Bad Gateway

```bash
# تحقق من تشغيل API
curl http://127.0.0.1:3000/api/health

# إذا لم يعمل، افحص PM2
pm2 status
pm2 logs

# إذا عمل محلياً لكن لا يعمل عبر النطاق:
sudo nginx -t
sudo systemctl status nginx
```

---

## أوامر سريعة للمرجع

```bash
# عرض الحالة
pm2 status

# السجلات
pm2 logs university-api --lines 50

# إعادة تحميل
pm2 reload university-api

# إعادة تشغيل
pm2 restart university-api

# إيقاف مؤقت
pm2 stop university-api

# تشغيل
pm2 start university-api

# Nginx
sudo nginx -t
sudo systemctl reload nginx
sudo tail -f /var/log/nginx/error.log
```

---

## ملخص سير العمل

```
1. SSH to server
2. cd /var/www/university
3. bash deploy/scripts/backup-db.sh
4. bash deploy/scripts/backup-uploads.sh
5. git pull
6. pnpm install
7. pnpm --filter @workspace/university run build
8. pnpm --filter @workspace/api-server run build
9. pm2 reload university-api
10. curl https://your-domain.com/api/health
11. Test in browser
```

---

**✅ التحديث يجب أن يكون سهلاً وآمناً باتباع هذا الدليل!**

---

*آخر تحديث: يونيو 2026*
