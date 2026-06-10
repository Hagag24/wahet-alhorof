# دليل النسخ الاحتياطي واستعادة موقع الجامعة

## أهمية النسخ الاحتياطي

> ⚠️ **البيانات أغلى من الموقع نفسه!**

## أنواع البيانات

| البيانات | الأهمية | التكرار |
|----------|---------|---------|
| قاعدة البيانات | حرجة | يومي |
| Uploads | حرجة | أسبوعي |
| Source Code | متوسط | Git |

## إعداد Cron Jobs

```bash
sudo crontab -e
```

أضف:
```
# Database backup daily at 3 AM
0 3 * * * cd /var/www/university && bash deploy/scripts/backup-db.sh

# Uploads backup weekly Sunday at 4 AM
0 4 * * 0 cd /var/www/university && bash deploy/scripts/backup-uploads.sh
```

## النسخ اليدوي

```bash
# Database
cp data/db.sqlite backups/db-$(date +%Y%m%d).sqlite

# Uploads
tar -czf backups/uploads-$(date +%Y%m%d).tar.gz artifacts/api-server/public/uploads/
```

## استعادة البيانات

```bash
# إيقاف التطبيق
pm2 stop university-api

# استعادة قاعدة البيانات
gunzip -c backups/db-XXXX.sqlite.gz > data/db.sqlite

# إعادة تشغيل
pm2 start university-api
```

## قائمة التحقق

- [ ] Cron jobs مفعلة
- [ ] النسخ تُنشئ بنجاح
- [ ] المساحة الكافية متوفرة
- [ ] اختبار الاستعادة مرة واحدة

*آخر تحديث: يونيو 2026*
