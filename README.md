# إعلان زيديا لخرائط Google (Remotion)

فيديو عمودي 1080×1920، بمعدل 30fps، ومدته **105 ثوانٍ** (3150 إطارًا). التعليق الصوتي بسرعته الأصلية، وأضيفت وقفات قصيرة بين المقاطع.

## الأوامر
```bash
npm ci
npm run dev                 # معاينة في Remotion Studio
npm run render              # تصدير ثم ضبط مستوى الصوت (‎-16 LUFS‎) ← out/zedia-maps-ad-final.mp4
npm run timing              # إعادة توليد timing.json و captions.srt
npm run audio               # إعادة توليد الموسيقى (يتطلب python3 + numpy + ffmpeg)
npm run stills -- 300 1500  # لقطات مراجعة لإطارات محددة في out/stills
npm run poster              # بوستر 4:5 ← out/zedia-maps-poster.png (2160×2700)
```
إذا تعذّر على Remotion تنزيل Chrome، فمرّر متصفحًا محليًا:
`REMOTION_BROWSER=/path/to/headless_shell npm run render`

## البنية
- `src/config.ts`: كل ما يُعدَّل: الاسم، الرقم، الألوان، المساحة الآمنة، مقاطع الصوت والوقفات المضافة (`SECTIONS.gapBefore`)، الترجمة والكلمات المميزة، نقاط التزامن (`CUES`)، الإحصاءات الحقيقية، وعناوين المشاهد.
- `src/timeline.ts`: يحوّل توقيت التسجيل الأصلي إلى توقيت الفيديو بعد إضافة الوقفات.
- `src/scenes/*`: أحد عشر مشهدًا (Hook, Brand, Setup, Info, Photos, Reviews, Ads, Metrics, Evidence, Cta, Outro).
- `src/components/*`: الهاتف، الخلفية، الترجمة، الأيقونات، والرسوم المتجهية.
- `public/`: الصوت، الخط، الشعار، ولقطات الإثبات.
- `references/`: الصور المرجعية الأصلية، و`reference-analysis.md` يشرح طريقة الاستفادة منها.
- `timing.json` و`captions.srt`: توقيت المشاهد والترجمة على خط زمن الفيديو النهائي.

## المواد والرخص
- **الخط**: IBM Plex Sans Arabic بالأوزان 400 و500 و600 و700، محمّل محليًا من `public/fonts`، ورخصته SIL OFL 1.1 (`public/fonts/OFL-LICENSE.txt`). التصدير ينتظر تحميله فعليًا ولا يستبدله بخط آخر.
- **الموسيقى**: مولّدة برمجيًا من الصفر عبر `scripts/generate-audio.py` دون أي عينات خارجية، فلا تحتاج رخصة طرف ثالث. لا توجد مؤثرات صوتية (حُذفت بطلب المستخدم).
- **التعليق الصوتي**: التسجيل الذي رفعه المستخدم (`public/audio/voiceover.mp3`).
- **الشعار**: شعار زيديا كما رُفع تمامًا بلا أي تعديل (`public/brand/zedia-logo.png`).
