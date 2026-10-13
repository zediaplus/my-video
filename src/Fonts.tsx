import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

const FACES = [400, 600, 700].flatMap((w) => [
  {w, src: `fonts/plex-ar-${w}.woff2`, range: 'U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFF'},
  {w, src: `fonts/plex-lat-${w}.woff2`, range: 'U+0000-00FF, U+2000-206F, U+2190-21FF, U+2212, U+00D7'},
]);

export const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(
      FACES.map((f) => {
        const face = new FontFace('Plex Arabic', `url(${staticFile(f.src)})`, {
          weight: String(f.w),
          unicodeRange: f.range,
        });
        document.fonts.add(face);
        return face.load();
      }),
    ).then(() => continueRender(handle));
  }, [handle]);
};
