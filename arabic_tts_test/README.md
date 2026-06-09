# تجربة تحويل النص العربي إلى صوت (Edge TTS)

مشروع بسيط لاختبار تحويل النصوص العربية إلى ملفات MP3 باستخدام مكتبة `edge-tts` (Microsoft Edge Online TTS) بدون الحاجة لمفتاح API.

## متطلبات التشغيل

### 1. تثبيت Python
تأكد من تثبيت Python (إصدار 3.8 أو أحدث) من [python.org](https://www.python.org/).

### 2. إنشاء بيئة افتراضية (Virtual Environment) على Windows
افتح الـ Terminal في مجلد المشروع وقم بتشغيل:
```powershell
python -m venv venv
.\venv\Scripts\activate
```

### 3. تثبيت المكتبات المطلوبة
```powershell
pip install -r requirements.txt
```

## طريقة التشغيل
قم بتشغيل السكربت الرئيسي لتجربة الصوت:
```powershell
python test_tts.py
```

بعد الانتهاء، ستجد ملفاً باسم `test_output.mp3` في نفس المجلد.

## تخصيص الصوت
يمكنك تغيير الصوت في ملف `test_tts.py` عن طريق تعديل متغير `voice`.

### قائمة أصوات عربية مميزة (Neural):
| كود الصوت | المنطقة | النوع |
| :--- | :--- | :--- |
| `ar-EG-ShakirNeural` | مصر | ذكر |
| `ar-EG-SalmaNeural` | مصر | أنثى |
| `ar-SA-HamedNeural` | السعودية | ذكر |
| `ar-SA-ZariyahNeural` | السعودية | أنثى |
| `ar-AE-HamdanNeural` | الإمارات | ذكر |
| `ar-AE-FatimaNeural` | الإمارات | أنثى |
| `ar-KW-FahedNeural` | الكويت | ذكر |
| `ar-QA-MoazNeural` | قطر | ذكر |

## الملاحظات التقنية
- المكتبة تعتمد على الاتصال بالإنترنت للوصول لخدمة Microsoft Edge.
- الأصوات هي أصوات Neural عالية الجودة.
- لا يتطلب المشروع أي API Keys.
