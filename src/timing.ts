// All cue times are in seconds, taken from a transcript of public/voiceover.mp3
// (Whisper chunk timestamps refined with the audio's pauses). Shift a value to re-sync.
export const FPS = 30;
export const TOTAL_SECONDS = 50.6;

export const T = {
  question: 0.06, // «أي مقاس تحتاج للطباعة؟»
  stepByStep: 2.02, // «خلّينا نرتّبها لك خطوة خطوة»

  basics: 4.26, // «نبدأ بالأساس»
  a0: 6.2, // «مقاس A0»
  a0Area: 7.22, // «مساحته متر مربع كامل»
  secret: 9.74, // «وسرّ السلسلة كلها بسيط»
  foldHint: 11.7, // «كلما نطوي الورق نصفين نحصل على المقاس اللي بعده»

  // moment each size is named (its fold finishes here): A1 … A6
  folds: [15.16, 16.2, 17.16, 20.08, 24.9, 25.94],
  famous: 18.14, // «وهنا المقاس الأشهر»

  // A4 fills the screen, then its uses
  a4Docs: 21.16, // «للمستندات»
  a4Slides: 21.97, // «والعروض»
  a4Daily: 22.5, // «والمطبوعات اليومية»
  goOn: 24.04, // «ونكمل»
  stageOut: 26.6,

  cards: 27.08, // «أما الكروت»
  bizCard: 28.1, // «كرت الأعمال»
  bizDims: 29.0, // «تسعة في خمسة سنتيمتر»
  card14: 30.9, // «وكرت»
  card14Dims: 31.25, // «أربعة عشر في عشرة سنتيمتر»
  invites: 32.95, // «للبطاقات»
  offers: 33.7, // «والعروض»
  cardsOut: 34.45,

  packaging: 34.74, // «وللعبوات»
  stickers: 35.74, // «عندنا استيكرات دائرية»
  stickerHit: 36.2,
  stickerSizes: [37.52, 38.14, 38.86, 40.24, 41.0], // 2, 3, 3.5, 4, 5
  chooseSize: 42.52, // «اختر الحجم المناسب لعبوتك»
  stickersOut: 44.25,

  outro: 44.3,
  brand: 44.58, // «تكوين»
  digital: 45.15, // «للطباعة الرقمية»
  city: 46.36, // «بريدة»
  yourSize: 47.08, // «قل لنا مقاسك»
  rest: 48.34, // «وعلينا الباقي»
};

export const sec = (s: number) => Math.round(s * FPS);
