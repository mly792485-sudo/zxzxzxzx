# توثيق صوت الأذان

الملف الكامل المستخدم داخل التطبيق هو `public/audio/adhan.wav`، ونسخة الإشعارات القصيرة هي `public/audio/adhan-notification.wav`. كما توجد نسخة الإشعار داخل حزمة iOS في `ios/App/App/adhan-notification.wav`.

## المصدر

- التسجيل: أذان مكة المكرمة، منسوب في بيانات المصدر إلى الشيخ علي أحمد ملا.
- المصدر العام: [Internet Archive — Makkah Azan](https://archive.org/details/MakkahAzan)
- الملف المستخدم: `12thNov09IshaAzanBySheikhAliAhmedMullah.ogv`
- صفحة المصدر تعرض الاستخدام بصيغة **Public Domain / Creative Commons publicdomain**.
- تم تحويل التسجيل إلى WAV أحادي القناة 44.1 kHz للتوافق مع التشغيل المحلي، واقتطاع أول 28 ثانية لملف إشعار مناسب للهواتف.

يجب الاحتفاظ بنسبة المصدر داخل مستندات التطبيق، والتحقق من سياسة المتجر المحلية قبل النشر التجاري. لا يُستخدم اسم الشيخ إلا بوصفه منسوبًا كما يظهر في بيانات المصدر، وليس ادعاءً رسميًا صادرًا عن إدارة المسجد الحرام.

## مصدر التفسير

التفسير المضمّن عند الطلب من مصدر `spa5k/tafsir_api`، وهو مشروع يعرض نسخًا من مصادر تفسيرية محددة:

- تفسير السعدي: `ar-tafseer-al-saddi`
- تفسير ابن كثير: `ar-tafsir-ibn-kathir`
- واجهة المصدر: https://github.com/spa5k/tafsir_api

لا يستخدم زر تفسير الآية Gemini ولا يولّد نصًا جديدًا؛ بل ينقل النص من المصدر المحدد ويعرض اسم المرجع.

## فحص المشروع

```bash
npm install
npm run lint
npm run build
npx cap sync ios
```

لا يمكن إصدار IPA موقّع من بيئة Ubuntu؛ يلزم Xcode على macOS وحساب Apple Developer للتوقيع.
