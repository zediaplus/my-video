import {AbsoluteFill, Easing} from 'remotion';
import {C, FONT} from './theme';
import {T} from './timing';
import {appear, ramp, Text, useTime} from './ui';

const Tile: React.FC<{t: number; delay: number; label: string; children: React.ReactNode}> = ({t, delay, label, children}) => {
  const s = ramp(t, T.outro + delay, 0.5, Easing.out(Easing.back(1.4)));
  return (
    <div
      style={{
        width: 300,
        height: 380,
        borderRadius: 32,
        background: 'rgba(251,250,248,0.75)',
        boxShadow: '0 14px 36px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        transform: `scale(${s})`,
        opacity: Math.min(1, s * 1.5),
      }}
    >
      <div style={{height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 40, color: C.ink, direction: 'rtl'}}>{label}</div>
    </div>
  );
};

const box = (w: number, h: number, extra?: React.CSSProperties): React.CSSProperties => ({
  position: 'absolute',
  width: w,
  height: h,
  border: `2px solid ${C.line}`,
  ...extra,
});

export const Outro: React.FC = () => {
  const t = useTime();
  const tilesOut = 1 - ramp(t, T.outroLogo - 0.3, 0.4, Easing.in(Easing.cubic));
  const end = 1 - ramp(t, 50.0, 0.6);
  return (
    <AbsoluteFill style={{opacity: end}}>
      <AbsoluteFill style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 36, direction: 'rtl', opacity: tilesOut, top: -80}}>
        <Tile t={t} delay={0} label="ورق A">
          <div style={{position: 'relative', width: 141, height: 200}}>
            <div style={box(141, 200)} />
            <div style={box(141, 100, {top: 100})} />
            <div style={box(70, 100, {top: 100, left: 71})} />
            <div style={box(70, 50, {top: 150, left: 71, background: C.accent, borderColor: C.accent})} />
          </div>
        </Tile>
        <Tile t={t} delay={0.15} label="كروت">
          <div style={{width: 120, height: 180, background: C.paper, boxShadow: '0 8px 20px rgba(0,0,0,0.15)', borderTop: `8px solid ${C.accent}`}} />
        </Tile>
        <Tile t={t} delay={0.3} label="استيكرات">
          <div style={{position: 'relative', width: 180, height: 180}}>
            {[180, 140, 100, 60].map((d, i) => (
              <div
                key={d}
                style={{
                  position: 'absolute',
                  left: (180 - d) / 2,
                  top: (180 - d) / 2,
                  width: d,
                  height: d,
                  borderRadius: '50%',
                  border: `2px solid ${i === 3 ? C.accent : C.line}`,
                  background: i === 3 ? C.accent : 'transparent',
                }}
              />
            ))}
          </div>
        </Tile>
      </AbsoluteFill>

      <div style={{position: 'absolute', top: 1060, left: 0, right: 0, ...appear(t, T.outroLogo + 0.4)}}>
        <Text size={58} weight={600} color={C.muted}>
          للطباعة الرقمية
        </Text>
      </div>
      <div style={{position: 'absolute', top: 1220, left: 0, right: 0, ...appear(t, T.outroTagline)}}>
        <Text size={76} weight={700}>
          قل لنا مقاسك…
        </Text>
      </div>
      <div style={{position: 'absolute', top: 1330, left: 0, right: 0, ...appear(t, T.outroTagline + 1.2)}}>
        <Text size={76} weight={700} color={C.accent}>
          وعلينا الباقي
        </Text>
      </div>
    </AbsoluteFill>
  );
};
