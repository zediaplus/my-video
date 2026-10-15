import {AbsoluteFill, Easing, Img, interpolate, staticFile} from 'remotion';
import {Jar, KraftBox, PaperBag, Sticker} from './Mockups';
import {STICKERS_CM} from './sizes';
import {C, FONT} from './theme';
import {T} from './timing';
import {appear, ramp, Text, useTime} from './ui';

const CM = 86; // px per cm
const CX = 540;
const CY = 760;

const fmt = (cm: number) => String(cm).replace('.', ',');

export const StickerScene: React.FC = () => {
  const t = useTime();
  const out = 1 - ramp(t, T.stickersOut, 0.3, Easing.in(Easing.cubic));
  const shown = T.stickerSizes.filter((s) => t >= s).length;
  const cur = Math.max(0, shown - 1);

  // packaging: centre stage first, then a row along the bottom
  const toRow = ramp(t, T.stickerSizes[0] - 0.35, 0.35, Easing.in(Easing.cubic));
  const pkgScale = interpolate(toRow, [0, 1], [1, 0.85]);
  const pkgTop = 640;
  const photo = ramp(t, T.stickerSizes[0], 0.5);
  const packs = [
    {el: KraftBox, tone: 'dark' as const, d: 120, text: 'صُنع بحب'},
    {el: Jar, tone: 'light' as const, d: 110, text: 'طبيعي ١٠٠٪'},
    {el: PaperBag, tone: 'accent' as const, d: 120, text: 'شكرًا لك'},
  ];

  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 330, left: 0, right: 0, ...appear(t, T.packaging, T.stickers - 0.3)}}>
        <Text size={84} weight={700}>
          وللـ<span style={{color: C.accent}}>عبوات</span>
        </Text>
      </div>
      <div style={{position: 'absolute', top: 330, left: 0, right: 0, ...appear(t, T.stickers)}}>
        <Text size={76} weight={700}>
          استيكرات <span style={{color: C.accent}}>دائرية</span>
        </Text>
      </div>

      {/* packaging with stickers */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: pkgTop,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 50,
          transform: `scale(${pkgScale})`,
          opacity: 1 - toRow,
          transformOrigin: '50% 0',
          height: 330,
        }}
      >
        {packs.map((p, i) => {
          const s = ramp(t, T.packaging + i * 0.12, 0.5, Easing.out(Easing.back(1.3)));
          const st = ramp(t, T.stickerHit + i * 0.14, 0.35, Easing.out(Easing.back(2)));
          const El = p.el;
          return (
            <div key={i} style={{transform: `translateY(${(1 - s) * 120}px)`, opacity: Math.min(1, s * 1.4)}}>
              <El>
                <div style={{transform: `scale(${st}) rotate(${(1 - st) * 40}deg)`, opacity: st > 0 ? 1 : 0}}>
                  <Sticker d={p.d} tone={p.tone} text={p.text} />
                </div>
              </El>
            </div>
          );
        })}
      </div>

      {/* concentric sizes, biggest first in DOM so smaller ones sit on top */}
      <AbsoluteFill>
        {[...STICKERS_CM.keys()].reverse().map((i) => {
          const d = STICKERS_CM[i] * CM;
          const s = ramp(t, T.stickerSizes[i], 0.45, Easing.out(Easing.back(1.6)));
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
              opacity: ramp(t, T.stickerSizes[cur], 0.2),
            }}
          >
            {fmt(STICKERS_CM[cur])} سم
          </div>
        )}
        <div style={{position: 'absolute', top: 1060, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18, direction: 'ltr'}}>
          {STICKERS_CM.map((cm, i) => {
            const on = ramp(t, T.stickerSizes[i], 0.25);
            const active = i === cur && shown > 0;
            return (
              <div
                key={cm}
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 40,
                  padding: '8px 26px',
                  borderRadius: 999,
                  background: active ? C.accent : 'rgba(17,17,17,0.08)',
                  color: active ? '#fff' : C.ink,
                  opacity: on,
                  transform: `scale(${0.8 + 0.2 * on})`,
                }}
              >
                {fmt(cm)}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* real stickers photo alongside the sizes */}
      <div
        style={{
          position: 'absolute',
          left: (1080 - 760) / 2,
          top: 1170,
          width: 760,
          height: 860,
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
          opacity: photo,
          transform: `translateY(${(1 - photo) * 120}px)`,
        }}
      >
        <Img src={staticFile('img/stickers-photo.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 8%'}} />
      </div>
    </AbsoluteFill>
  );
};
