import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {BusinessCard, InviteCard, OfferCard} from './Mockups';
import {C, FONT} from './theme';
import {T} from './timing';
import {appear, Chip, ramp, Text, useTime} from './ui';

// Dimension marker drawn along one edge of a box
const Measure: React.FC<{
  side: 'bottom' | 'left';
  box: {left: number; top: number; width: number; height: number};
  label: string;
  o: number;
}> = ({side, box, label, o}) => {
  const len = side === 'bottom' ? box.width : box.height;
  const draw = o;
  const common: React.CSSProperties = {position: 'absolute', background: C.accent};
  return side === 'bottom' ? (
    <div style={{position: 'absolute', left: box.left, top: box.top + box.height + 22, width: len, opacity: o > 0 ? 1 : 0}}>
      <div style={{...common, left: (len * (1 - draw)) / 2, width: len * draw, top: 0, height: 4}} />
      <div style={{...common, left: 0, top: -10, width: 4, height: 24, opacity: draw}} />
      <div style={{...common, right: 0, top: -10, width: 4, height: 24, opacity: draw}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 10, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 40, color: C.accent, direction: 'rtl', opacity: draw}}>
        {label}
      </div>
    </div>
  ) : (
    <div style={{position: 'absolute', left: box.left - 26, top: box.top, height: len, opacity: o > 0 ? 1 : 0}}>
      <div style={{...common, top: (len * (1 - draw)) / 2, height: len * draw, left: 0, width: 4}} />
      <div style={{...common, top: 0, left: -10, height: 4, width: 24, opacity: draw}} />
      <div style={{...common, bottom: 0, left: -10, height: 4, width: 24, opacity: draw}} />
      <div style={{position: 'absolute', right: 18, top: len / 2 - 26, whiteSpace: 'nowrap', fontFamily: FONT, fontWeight: 700, fontSize: 40, color: C.accent, direction: 'rtl', opacity: draw}}>
        {label}
      </div>
    </div>
  );
};

export const CardScene: React.FC = () => {
  const t = useTime();
  const out = 1 - ramp(t, T.cardsOut, 0.3, Easing.in(Easing.cubic));

  // Business card 9 × 5 cm: big first, then moves up to make room (both stay to scale)
  const move = ramp(t, T.card14, 0.55, Easing.inOut(Easing.cubic));
  const cm = interpolate(move, [0, 1], [80, 52]);
  const biz = {width: 9 * cm, height: 5 * cm, left: 540 - (9 * cm) / 2 + 40 * (1 - move), top: interpolate(move, [0, 1], [640, 500])};
  const bizIn = ramp(t, T.bizCard, 0.5, Easing.out(Easing.back(1.3)));
  const bizDims = ramp(t, T.bizDims, 0.4) * (1 - move);

  // Card 14 × 10 cm at the same scale (52 px per cm)
  const c14 = {width: 14 * 52, height: 10 * 52, left: 540 - (14 * 52) / 2 + 30, top: 880};
  const c14In = ramp(t, T.card14 + 0.1, 0.55, Easing.out(Easing.cubic));
  const c14Dims = ramp(t, T.card14Dims, 0.4) * (1 - ramp(t, T.invites, 0.3));
  const invite = ramp(t, T.invites, 0.35);
  const flip = ramp(t, T.offers, 0.5, Easing.inOut(Easing.cubic));
  const u = c14.width / 140;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 330, left: 0, right: 0, ...appear(t, T.cards)}}>
        <Text size={84} weight={700}>
          أما <span style={{color: C.accent}}>الكروت</span>
        </Text>
      </div>

      <div
        style={{
          position: 'absolute',
          left: biz.left,
          top: biz.top,
          opacity: Math.min(1, bizIn * 1.5),
          transform: `scale(${0.85 + 0.15 * bizIn}) rotate(${(1 - bizIn) * -6}deg)`,
        }}
      >
        <BusinessCard w={biz.width} h={biz.height} />
      </div>
      <Measure side="bottom" box={biz} label="9 سم" o={bizDims} />
      <Measure side="left" box={biz} label="5 سم" o={bizDims} />
      <div style={{position: 'absolute', left: 0, right: 0, top: biz.top + biz.height + 18, display: 'flex', justifyContent: 'center', opacity: move}}>
        <Chip>كرت أعمال · <span style={{direction: 'ltr', unicodeBidi: 'isolate'}}>9 × 5</span></Chip>
      </div>

      <div
        style={{
          position: 'absolute',
          ...c14,
          opacity: c14In,
          transform: `translateY(${(1 - c14In) * 160}px)`,
          perspective: 2400,
        }}
      >
        <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${flip * 180}deg)`}}>
          <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: C.paper, borderRadius: 10, boxShadow: '0 20px 50px rgba(0,0,0,0.2)'}} />
          <div style={{position: 'absolute', inset: 0, opacity: invite}}>
            <InviteCard u={u} />
          </div>
          <OfferCard u={u} />
        </div>
      </div>
      <Measure side="bottom" box={c14} label="14 سم" o={c14Dims} />
      <Measure side="left" box={c14} label="10 سم" o={c14Dims} />

      <div style={{position: 'absolute', top: 1500, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 24, direction: 'rtl'}}>
        <div style={appear(t, T.invites, undefined, 20)}>
          <Chip accent={flip < 0.5} style={{fontSize: 46, padding: '10px 36px'}}>للبطاقات</Chip>
        </div>
        <div style={appear(t, T.offers, undefined, 20)}>
          <Chip accent={flip >= 0.5} style={{fontSize: 46, padding: '10px 36px'}}>والعروض</Chip>
        </div>
      </div>
    </AbsoluteFill>
  );
};
