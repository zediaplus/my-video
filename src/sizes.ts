// ISO 216 A-series, width × height in mm
export const A_SIZES = [
  {name: 'A0', w: 841, h: 1189},
  {name: 'A1', w: 594, h: 841},
  {name: 'A2', w: 420, h: 594},
  {name: 'A3', w: 297, h: 420},
  {name: 'A4', w: 210, h: 297},
  {name: 'A5', w: 148, h: 210},
  {name: 'A6', w: 105, h: 148},
];

export type Rect = {x: number; y: number; w: number; h: number};

// Each sheet is the previous one folded on its long side: portrait sheets keep the
// bottom half, landscape sheets keep the right half, so the frames nest exactly.
export const FOLD_RECTS: Rect[] = (() => {
  const rects: Rect[] = [{x: 0, y: 0, w: 841, h: 1189}];
  for (let i = 1; i < A_SIZES.length; i++) {
    const p = rects[i - 1];
    rects.push(
      p.h >= p.w
        ? {x: p.x, y: p.y + p.h / 2, w: p.w, h: p.h / 2}
        : {x: p.x + p.w / 2, y: p.y, w: p.w / 2, h: p.h},
    );
  }
  return rects;
})();

export const STICKERS_CM = [2, 3, 3.5, 4, 5];
