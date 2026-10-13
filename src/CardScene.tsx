import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {C, FONT} from './theme';
import {T} from './timing';
import {appear, Chip, Dim, ramp, Text, useTime} from './ui';

const CM = 30; // px per cm for the to-scale diagram

export const CardScene: React.FC = () => {
  const t = useTime();
  const out = 1 - ramp(t, T.cardOut, 0.4, Easing.in(Easing.cubic));
  const photo = ramp(t, T.card, 0.6);
  const card = ramp(t, T.cardDiagram, 0.6);
  const a5 = ramp(t, T.cardA5 - 1.5, 0.6);

  const cardW = 14 * CM;
  const cardH = 21 * CM;
  const a5W = 14.8 * CM;
  const a5H = 21 * CM;
  const baseX = 560;
  const baseY = 360;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: 360,
          width: 470,
          height: 660,
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
          opacity: photo,
          transform: `translateX(${(1 - photo) * 80}px) rotate(${(1 - photo) * -3}deg)`,
        }}
      >
        <Img src={staticFile('img/card-photo.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>

      {/* to-scale comparison: A5 frame vs the 14 × 21 cm card, aligned bottom-left */}
      <div
        style={{
          position: 'absolute',
          left: baseX,
          top: baseY,
          width: a5W,
          height: a5H,
          border: `3px dashed ${C.line}`,
          opacity: a5,
        }}
      >
        <div style={{position: 'absolute', top: 8, right: 12, fontFamily: FONT, fontWeight: 600, fontSize: 30, color: C.muted}}>
          A5
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: baseX,
          top: baseY + a5H - cardH,
          width: cardW,
          height: cardH,
          background: C.paper,
          boxShadow: '0 14px 36px rgba(0,0,0,0.16)',
          opacity: card,
          transform: `translateY(${(1 - card) * 60}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Img src={staticFile('img/logo.png')} style={{height: 110, opacity: 0.9}} />
        <div style={{position: 'absolute', bottom: -52, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontSize: 30, color: C.ink, fontWeight: 600}}>
          14 cm
        </div>
        <div style={{position: 'absolute', left: -62, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontFamily: FONT, fontSize: 30, color: C.ink, fontWeight: 600, whiteSpace: 'nowrap'}}>
          21 cm
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: baseX + cardW,
          top: baseY + a5H + 14,
          width: a5W - cardW,
          height: 6,
          background: C.accent,
          opacity: a5,
        }}
      />

      <div style={{position: 'absolute', top: 1110, left: 0, right: 0, ...appear(t, T.card + 0.3)}}>
        <Text size={92} weight={700}>
          كرت <Dim>21 × 14</Dim> سم
        </Text>
      </div>
      <div style={{position: 'absolute', top: 1270, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...appear(t, T.cardA5 - 1.5)}}>
        <Text size={54} weight={400} color={C.muted}>
          قريب جدًا من <span style={{color: C.ink, fontWeight: 700}}>A5</span> · <Dim>14.8 × 21</Dim> سم
        </Text>
      </div>
      <div style={{position: 'absolute', top: 1400, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...appear(t, T.cardA5)}}>
        <Chip accent style={{fontSize: 44, padding: '10px 34px'}}>
          الفرق أقل من سنتيمتر واحد
        </Chip>
      </div>
    </AbsoluteFill>
  );
};
