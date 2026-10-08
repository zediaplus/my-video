// Central, editable configuration for the Zedia Google Maps ad.
// All times are in seconds of the ORIGINAL voiceover file (src) unless named otherwise.

export const VIDEO = {
  id: 'ZediaMapsAd',
  width: 1080,
  height: 1920,
  fps: 30,
  totalSeconds: 105,
} as const;

export const BRAND = {
  name: 'زيديا',
  phone: '0532452310',
  logo: 'brand/zedia-logo.png',
  tagline: 'حضورٌ أوضح، ووصولٌ أسهل',
};

export const COLORS = {
  bg: '#F4F8FE',
  bgDeep: '#E6F0FC',
  white: '#FFFFFF',
  ink: '#0E2140',
  inkSoft: '#4A5B78',
  blue: '#0B7FC7', // Zedia logo blue
  blueDeep: '#0A4E9B',
  cyan: '#12B0DD',
  line: '#D5E3F5',
  highlight: '#0B7FC7',
  call: '#1E9E4A', // green call button
  callDeep: '#167A39',
  // limited Google accents
  gBlue: '#4285F4',
  gRed: '#EA4335',
  gYellow: '#FBBC05',
  gGreen: '#34A853',
};

export const FONT_FAMILY = 'IBM Plex Sans Arabic';

// Safe area for social apps (px from each edge).
export const SAFE = { left: 80, right: 140, top: 150, bottom: 300 };
export const SAFE_CENTER_X = (SAFE.left + (VIDEO.width - SAFE.right)) / 2;

export const AUDIO = {
  voice: 'audio/voiceover.mp3',
  voiceDuration: 93.73,
  music: 'audio/music.mp3',
  musicVolume: 0.2,
  musicDuckedVolume: 0.06,
  sfxVolume: 0.5,
};

// Voiceover is split into sections at natural pauses; `gapBefore` adds breathing room
// (in seconds) before each section without changing the speed of the speech.
export type SectionId =
  | 'hook'
  | 'brand'
  | 'setup'
  | 'info'
  | 'photos'
  | 'reviews'
  | 'ads'
  | 'metrics'
  | 'evidence'
  | 'cta'
  | 'outro';

export const SECTIONS: { id: SectionId; srcStart: number; srcEnd: number; gapBefore: number }[] = [
  { id: 'hook', srcStart: 0, srcEnd: 13.02, gapBefore: 1.2 },
  { id: 'brand', srcStart: 13.02, srcEnd: 20.86, gapBefore: 0.9 },
  { id: 'setup', srcStart: 20.86, srcEnd: 31.55, gapBefore: 0.6 },
  { id: 'info', srcStart: 31.55, srcEnd: 40.23, gapBefore: 0.5 },
  { id: 'photos', srcStart: 40.23, srcEnd: 49.3, gapBefore: 0.6 },
  { id: 'reviews', srcStart: 49.3, srcEnd: 55.66, gapBefore: 0.5 },
  { id: 'ads', srcStart: 55.66, srcEnd: 66.85, gapBefore: 0.6 },
  { id: 'metrics', srcStart: 66.85, srcEnd: 75.45, gapBefore: 0.4 },
  { id: 'evidence', srcStart: 75.45, srcEnd: 82.67, gapBefore: 0.7 },
  { id: 'cta', srcStart: 82.67, srcEnd: 90.34, gapBefore: 0.7 },
  { id: 'outro', srcStart: 90.34, srcEnd: 93.73, gapBefore: 0.6 },
];

// Captions, timed against the recording (src seconds). `hl` = words shown in the highlight colour.
export const CAPTIONS: { start: number; end: number; text: string; hl?: string[] }[] = [
  { start: 0.0, end: 2.07, text: 'نشاطُكَ مميّز… ولكن،', hl: ['مميّز'] },
  { start: 2.45, end: 4.75, text: 'هل يجدُكَ عملاؤُكَ على خرائط جوجل؟', hl: ['عملاؤُكَ'] },
  { start: 5.23, end: 10.01, text: 'في هذه اللحظة، هناك مَن يبحثُ عن خدمةٍ تُقدّمُها، أو منتجٍ تبيعُه…', hl: ['يبحثُ'] },
  { start: 10.5, end: 12.83, text: 'فهل يظهرُ نشاطُكَ بصورةٍ تليقُ به؟', hl: ['يظهرُ'] },
  { start: 13.22, end: 17.12, text: 'في زيديا، نساعدُكَ على بناء حضورٍ واضحٍ ومتكامل،', hl: ['زيديا'] },
  { start: 17.42, end: 20.69, text: 'يجعلُ التعرّفَ على نشاطِكَ والوصولَ إليكَ أسهل!', hl: ['أسهل!'] },
  { start: 21.03, end: 25.02, text: 'نبدأُ بإنشاء ملفِّ نشاطِكَ التجاريّ أو تحسينِ ملفِّكَ الحاليّ،', hl: ['ملفِّ', 'نشاطِكَ', 'التجاريّ'] },
  { start: 25.4, end: 27.73, text: 'ونساعدُكَ في خطواتِ إثباتِ الملكيّة،', hl: ['إثباتِ', 'الملكيّة،'] },
  { start: 28.02, end: 31.34, text: 'وضبطِ الموقعِ على الخريطة، واختيارِ التصنيفِ المناسب.', hl: ['الموقعِ', 'التصنيفِ'] },
  { start: 31.76, end: 36.24, text: 'ثم نرتّبُ خدماتِكَ، ووصفَ نشاطِكَ، ورقمَ التواصلِ وساعاتِ العمل…', hl: ['خدماتِكَ،'] },
  { start: 36.61, end: 40.08, text: 'لتكونَ المعلوماتُ التي يحتاجُها العميلُ أمامَه بوضوح.', hl: ['بوضوح.'] },
  { start: 40.39, end: 44.79, text: 'ولأنَّ الصورةَ تصنعُ الانطباعَ الأوّل، نصوّرُ مكانَكَ ومنتجاتِكَ،', hl: ['الانطباعَ', 'الأوّل،'] },
  { start: 45.07, end: 49.13, text: 'ونُجهّزُ صورًا وفيديوهاتٍ ومنشوراتٍ تُبرزُ ما يميّزُكَ!', hl: ['يميّزُكَ!'] },
  { start: 49.46, end: 52.88, text: 'ونساعدُكَ على طلبِ تقييماتٍ حقيقيّةٍ من عملائِكَ،', hl: ['تقييماتٍ', 'حقيقيّةٍ'] },
  { start: 53.08, end: 55.5, text: 'والردِّ عليها باهتمامٍ واحترافيّة.', hl: ['واحترافيّة.'] },
  { start: 55.82, end: 58.66, text: 'وتريدُ الوصولَ إلى المزيدِ من العملاءِ المحتملين؟', hl: ['المزيدِ'] },
  { start: 58.96, end: 63.6, text: 'نُعِدُّ ونُديرُ حملاتِ جوجل الإعلانيّةَ المؤهَّلةَ للظهورِ على الخرائط،', hl: ['حملاتِ', 'جوجل', 'الإعلانيّةَ'] },
  { start: 63.84, end: 66.72, text: 'وفقَ أهدافِكَ ومنطقتِكَ وميزانيّتِكَ.', hl: ['أهدافِكَ'] },
  { start: 66.98, end: 69.11, text: 'ونتابعُ مؤشّراتِ الأداءِ المتاحة…', hl: ['مؤشّراتِ', 'الأداءِ'] },
  { start: 69.42, end: 72.73, text: 'الظهور، وضغطاتِ الاتصال، وطلباتِ الاتّجاهات؛', hl: ['الظهور،'] },
  { start: 72.98, end: 75.31, text: 'لنطوّرَ العملَ بناءً على البيانات.', hl: ['البيانات.'] },
  { start: 75.58, end: 79.43, text: 'وهذه نماذجُ من صورِنا ومساهماتِنا على خرائط جوجل…', hl: ['ومساهماتِنا'] },
  { start: 79.74, end: 82.48, text: 'بمشاهداتِها الفعليّةِ كما تظهرُ في الحساب.', hl: ['الفعليّةِ'] },
  { start: 82.87, end: 86.07, text: 'وراءَ نشاطِكَ جهدٌ يستحقُّ أن يراهُ الناس.', hl: ['يستحقُّ'] },
  { start: 86.33, end: 90.2, text: 'أرسلْ لنا رابطَ نشاطِكَ الآن، ولنحدّدْ معًا فرصَ تطويرِه.', hl: ['رابطَ', 'نشاطِكَ'] },
  { start: 90.48, end: 93.48, text: 'زيديا… حضورٌ أوضح، ووصولٌ أسهل!', hl: ['زيديا…'] },
];

// Key cue points inside the recording, used to sync visuals (src seconds).
export const CUES = {
  question: 2.45,
  searching: 6.45,
  showUp: 10.5,
  zedia: 13.22,
  easier: 17.42,
  createProfile: 21.03,
  verify: 25.4,
  location: 28.02,
  category: 29.83,
  services: 31.9,
  description: 33.0,
  contact: 34.1,
  hours: 35.3,
  clarity: 36.61,
  firstImpression: 40.39,
  shoot: 42.92,
  media: 45.07,
  reviewsAsk: 49.46,
  reply: 53.08,
  moreClients: 55.82,
  campaigns: 58.96,
  budget: 63.84,
  kpis: 66.98,
  kpiVisibility: 69.42,
  kpiCalls: 70.3,
  kpiDirections: 71.46,
  data: 72.98,
  contributions: 75.58,
  views: 79.74,
  effort: 82.87,
  sendLink: 86.33,
  finalBrand: 90.48,
};

// Real figures, copied from the supplied Google Maps contribution screenshots.
export const EVIDENCE = {
  photosTab: { photos: '468', views: '1,858,619' },
  level: 'مرشد محلي من المستوى 6',
  points: '4,446',
  screenshots: {
    photosTab: 'evidence/photos-stats.png',
    panel: 'evidence/contributions-panel.png',
  },
};

export const TEXT = {
  searchQuery: 'خدمات قريبة مني',
  hookTitle: 'هل يجدك عملاؤك؟',
  brandTitle: 'حضور أوضح لنشاطك على خرائط Google',
  setupTitle: 'نجهّز ملف نشاطك خطوة بخطوة',
  setupCards: ['إنشاء الملف أو تحسينه', 'المساعدة في إثبات الملكية', 'ضبط الموقع على الخريطة', 'اختيار التصنيف المناسب'],
  infoTitle: 'معلومات واضحة ومتكاملة',
  infoRows: ['الخدمات', 'وصف النشاط', 'رقم التواصل', 'ساعات العمل'],
  photosTitle: 'صورة تعبّر عن جودة عملك',
  photoTiles: ['المكان', 'المنتجات', 'فيديو', 'منشورات'],
  reviewsTitle: 'تقييمات حقيقية — ردود مهنية',
  adsTitle: 'حملات وفق أهدافك وميزانيتك',
  adsChips: ['أهدافك', 'منطقتك', 'ميزانيتك'],
  metricsTitle: 'نتابع مؤشرات الأداء المتاحة',
  metrics: ['الظهور', 'ضغطات الاتصال', 'طلبات الاتجاهات'],
  evidenceTitle: 'من صورنا ومساهماتنا على خرائط Google',
  ctaTitle: 'أرسل رابط نشاطك لنحدّد فرص تطويره',
};
