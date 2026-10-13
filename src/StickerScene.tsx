import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {STICKERS_CM} from './sizes';
import {C, FONT} from './theme';
import {T} from './timing';
import {appear, ramp, Text, useTime} from './ui';

const CM = 86; // px per cm
const CX = 540;
const CY = 730;

export const StickerScene: React.FC = () => {
  const t = useTime();
  const out = 1 - ramp(t, T.stickersOut, 0.4, Easing.in(Easing.cubic));
  const shown = T.stickerSizes.filter((s) => t >= s).length;
  const cur = Math.max(0, shown - 1);
  const photo = ramp(t, T.stickerPhoto, 0.7);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 340, left: 0, right: 0, ...appear(t, T.stickers)}}>
        <Text size={70} weight={700}>
          استيكرات دائرية للعبوات
        </Text>
      </div>

      {/* biggest first in DOM so smaller circles sit on top */}
      {[...STICKERS_CM.keys()].reverse().map((i) => {
        const d = STICKERS_CM[i] * CM;
        const s = ramp(t, T.stickerSizes[i], 0.5, Easing.out(Easing.back(1.6)));
        const active = i === cur && shown > 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: CX - d / 2,
              top: CY - d / 2,
              width: d,
              height: d,
              borderRadius: '50%',
              background: active ? C.paper : 'rgba(251,250,248,0.35)',
              border: `${active ? 5 : 2}px solid ${active ? C.accent : C.line}`,
              boxShadow: active ? '0 12px 30px rgba(0,0,0,0.15)' : 'none',
              transform: `scale(${s})`,
              opacity: Math.min(1, s * 1.5),
            }}
          />
        );
      })}
      {shown > 0 && (
        <div
          key={cur}
          style={{
            position: 'absolute',
            left: CX - 200,
            top: CY - 40,
            width: 400,
            textAlign: 'center',
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: cur === 0 ? 46 : 64,
            color: C.accent,
            direction: 'rtl',
            lineHeight: '80px',
            opacity: ramp(t, T.stickerSizes[cur], 0.25),
          }}
        >
          {String(STICKERS_CM[cur]).replace('.', ',')} سم
        </div>
      )}

      {/* size chips */}
      <div style={{position: 'absolute', top: 1000, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18, direction: 'ltr'}}>
        {STICKERS_CM.map((cm, i) => {
          const on = ramp(t, T.stickerSizes[i], 0.3);
          const active = i === cur && shown > 0;
          return (
            <div
              key={cm}
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 38,
                padding: '8px 24px',
                borderRadius: 999,
                background: active ? C.accent : 'rgba(17,17,17,0.08)',
                color: active ? '#fff' : C.ink,
                opacity: 0.25 + 0.75 * on,
              }}
            >
              {String(cm).replace('.', ',')}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: (1080 - 560) / 2,
          top: 1110,
          width: 560,
          height: 780,
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
          opacity: photo,
          transform: `translateY(${(1 - photo) * 120}px)`,
        }}
      >
        <Img src={staticFile('img/stickers-photo.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%'}} />
      </div>
    </AbsoluteFill>
  );
};
