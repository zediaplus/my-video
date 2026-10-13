import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from './theme';
import {FPS} from './timing';

export const useTime = () => useCurrentFrame() / FPS;

// 0 → 1 over `dur` seconds starting at `from`
export const ramp = (t: number, from: number, dur = 0.45, ease = Easing.out(Easing.cubic)) =>
  interpolate(t, [from, from + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

// Fade + rise in at `from`, optional fade out at `to`
export const appear = (t: number, from: number, to?: number, rise = 30) => {
  const i = ramp(t, from);
  const o = to === undefined ? 1 : 1 - ramp(t, to, 0.35, Easing.in(Easing.cubic));
  return {opacity: i * o, transform: `translateY(${(1 - i) * rise}px)`};
};

// Keeps "width × height" in reading order inside Arabic text
export const Dim: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block'}}>{children}</span>
);

export const Text: React.FC<{
  size: number;
  weight?: number;
  color?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({size, weight = 600, color = C.ink, style, children}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: weight,
      color,
      direction: 'rtl',
      textAlign: 'center',
      lineHeight: 1.25,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{children: React.ReactNode; accent?: boolean; style?: React.CSSProperties}> = ({
  children,
  accent,
  style,
}) => (
  <span
    style={{
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 36,
      padding: '6px 22px',
      borderRadius: 999,
      background: accent ? C.accent : 'rgba(17,17,17,0.08)',
      color: accent ? '#fff' : C.ink,
      direction: 'rtl',
      display: 'inline-block',
      ...style,
    }}
  >
    {children}
  </span>
);
