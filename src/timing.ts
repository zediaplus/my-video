// All cue times are in seconds and follow the pauses in public/voiceover.mp3.
// Shift a value here to re-sync a visual with the voice.
export const FPS = 30;
export const TOTAL_SECONDS = 50.6;

export const T = {
  question: 0.1, // «أي مقاس تحتاج للطباعة؟»
  byFolding: 2.0, // «خلّينا نرتّبها لك... بالطيّ»

  a0: 4.26, // A0 appears
  a0Dims: 5.56,
  a0Area: 9.74, // «متر مربع»
  foldHint: 11.7, // «نطوي الورقة نصفين...»

  // moment each size is named (fold finishes here)
  folds: [15.16, 16.2, 17.16, 20.08, 21.16, 22.45],
  famous: 18.14, // «وهنا المقاس الأشهر»

  recap: 24.04, // «المساحة تصير النصف»
  recapShape: 25.94, // «والشكل ما يتغيّر»
  stageOut: 27.7,

  card: 28.1,
  cardDiagram: 30.9,
  cardA5: 34.74,
  cardOut: 35.5,

  stickers: 35.74,
  stickerSizes: [37.52, 38.14, 38.86, 40.24, 41.0],
  stickerPhoto: 42.52,
  stickersOut: 44.3,

  outro: 44.4,
  outroLogo: 46.2,
  outroTagline: 47.08,
};

export const sec = (s: number) => Math.round(s * FPS);
