import { continueRender, delayRender, staticFile } from 'remotion';
import { FONT_FAMILY } from './config';

// IBM Plex Sans Arabic is bundled locally (public/fonts, SIL OFL 1.1) and the render
// waits until every weight is actually loaded — no silent fallback to a system font.

const WEIGHTS = [400, 500, 600, 700] as const;
const SUBSETS = {
  arabic:
    'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC',
  latin:
    'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
};

let started = false;

export const loadFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('Loading IBM Plex Sans Arabic');
  const faces: FontFace[] = [];
  for (const weight of WEIGHTS) {
    for (const [subset, range] of Object.entries(SUBSETS)) {
      const url = staticFile(`fonts/ibm-plex-sans-arabic-${subset}-${weight}-normal.woff2`);
      faces.push(
        new FontFace(FONT_FAMILY, `url(${url}) format('woff2')`, {
          weight: String(weight),
          style: 'normal',
          unicodeRange: range,
          display: 'block',
        }),
      );
    }
  }
  Promise.all(
    faces.map((f) =>
      f.load().then((loaded) => {
        document.fonts.add(loaded);
      }),
    ),
  )
    .then(() => Promise.all(WEIGHTS.map((w) => document.fonts.load(`${w} 40px "${FONT_FAMILY}"`, 'زيديا 0532'))))
    .then(() => continueRender(handle))
    .catch((err) => {
      // Fail loudly instead of rendering with a fallback font.
      throw new Error(`IBM Plex Sans Arabic failed to load: ${err}`);
    });
};
