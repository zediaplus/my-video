import {AbsoluteFill, Easing} from 'remotion';
import {C, FONT} from './theme';
import {T, TOTAL_SECONDS} from './timing';
import {appear, Chip, ramp, Text, useTime} from './ui';

const Tile: React.FC<{t: number; delay: number; label: string; children: React.ReactNode}> = ({t, delay, label, children}) => {
  const s = ramp(t, T.brand + delay, 0.45, Easing.out(Easing.back(1.4)));
  return (
    <div
      style={{
        width: 290,
        height: 360,
        borderRadius: 32,
        background: 'rgba(251,250,248,0.8)',
        boxShadow: '0 14px 36px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
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
  const end = 1 - ramp(t, TOTAL_SECONDS - 0.5, 0.5);
  return (
    <AbsoluteFill style={{opacity: end}}>
      <div style={{position: 'absolute', top: 360, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 34, direction: 'rtl'}}>
        <Tile t={t} delay={0} label="ورق A">
          <div style={{position: 'relative', width: 141, height: 200}}>
            <div style={box(141, 200)} />
            <div style={box(141, 100, {top: 100})} />
            <div style={box(70, 100, {top: 100, left: 71})} />
            <div style={box(70, 50, {top: 150, left: 71, background: C.accent, borderColor: C.accent})} />
          </div>
        </Tile>
        <Tile t={t} delay={0.12} label="كروت">
          <div style={{width: 180, height: 100, background: '#161616', borderRadius: 6, boxShadow: '0 8px 20px rgba(0,0,0,0.2)', borderLeft: `10px solid ${C.accent}`}} />
        </Tile>
        <Tile t={t} delay={0.24} label="استيكرات">
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
      </div>

      <div style={{position: 'absolute', top: 820, left: 0, right: 0, ...appear(t, T.digital)}}>
        <Text size={76} weight={700}>
          للطباعة الرقمية
        </Text>
      </div>
      <div style={{position: 'absolute', top: 945, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...appear(t, T.city)}}>
        <Chip accent style={{fontSize: 50, padding: '8px 44px'}}>بريدة</Chip>
      </div>
      <div style={{position: 'absolute', top: 1160, left: 0, right: 0, ...appear(t, T.yourSize)}}>
        <Text size={84} weight={700}>
          قل لنا مقاسك…
        </Text>
      </div>
      <div style={{position: 'absolute', top: 1280, left: 0, right: 0, ...appear(t, T.rest)}}>
        <Text size={84} weight={700} color={C.accent}>
          وعلينا الباقي
        </Text>
      </div>
    </AbsoluteFill>
  );
};
