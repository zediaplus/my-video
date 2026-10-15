// Cue times are written in the ORIGINAL voiceover's seconds (from its transcript) and
// mapped onto the cut 40s voice (public/voiceover-cut.wav) by m(). Shift a value to re-sync.
import voiceMap from './voice-map.json';

export const FPS = 30;
export const TOTAL_SECONDS = 40;

// Piecewise-linear map: original voiceover time → cut voiceover time
const m = (old: number) => {
  const a = voiceMap.anchors;
  if (old <= a[0][0]) return a[0][1];
  for (let i = 1; i < a.length; i++) {
    const [o0, n0] = a[i - 1];
    const [o1, n1] = a[i];
    if (old <= o1) return o1 === o0 ? n1 : n0 + ((old - o0) / (o1 - o0)) * (n1 - n0);
  }
  return a[a.length - 1][1] + (old - a[a.length - 1][0]);
};

export const T = {
  question: m(0.06), // «أي مقاس تحتاج للطباعة؟»
  stepByStep: m(2.02), // «خلّينا نرتّبها لك خطوة خطوة»

  a0: m(5.56), // «مقاس A0»
  a0Area: m(7.22), // «مساحته متر مربع كامل»
  foldHint: m(11.7), // «كلما نطوي الورق نصفين نحصل على المقاس اللي بعده»

  // moment each size is named (its fold finishes here): A1 … A6
  folds: [15.16, 16.2, 17.16, 20.08, 24.9, 25.94].map(m),
  famous: m(18.14), // «وهنا المقاس الأشهر»

  // A4 fills the screen, then its uses
  a4Docs: m(21.16), // «للمستندات»
  a4Slides: m(21.97), // «والعروض»
  a4Daily: m(22.5), // «والمطبوعات اليومية»
  goOn: m(23.5), // back to folding
  stageOut: m(26.45),

  cards: m(27.08), // «أما الكروت»
  bizCard: m(28.1), // «كرت الأعمال»
  bizDims: m(29.0), // «تسعة في خمسة سنتيمتر»
  card14: m(30.9), // «وكرت»
  card14Dims: m(31.25), // «أربعة عشر في عشرة سنتيمتر»
  invites: m(32.95), // «للبطاقات»
  offers: m(33.7), // «والعروض»
  cardsOut: m(34.4),

  packaging: m(34.74), // «وللعبوات»
  stickers: m(35.74), // «عندنا استيكرات دائرية»
  stickerHit: m(36.2),
  stickerSizes: [37.52, 38.14, 38.86, 40.24, 41.0].map(m), // 2, 3, 3.5, 4, 5
  stickersOut: m(44.4),

  outro: m(44.45),
  brand: m(44.58), // «تكوين»
  digital: m(45.15), // «للطباعة الرقمية»
  city: m(46.36), // «بريدة»
  yourSize: m(47.08), // «قل لنا مقاسك»
  rest: m(48.34), // «وعلينا الباقي»
};

export const sec = (s: number) => Math.round(s * FPS);
