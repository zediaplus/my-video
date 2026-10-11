import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { drift, ease, mix } from '../anim';
import { FONT_FAMILY } from '../config';

// Dark navy / white / sky-cyan luxury theme for the 30 s paid-ads & design spot.
export const D = {
  navy0: '#030A1F',
  navy1: '#061A45',
  navy2: '#0B2E73',
  blue: '#1D6FE8',
  cyan: '#38D3F5',
  cyanSoft: '#9BE8FA',
  white: '#FFFFFF',
  text: '#EAF4FF',
  textSoft: '#A9C2E3',
  call: '#1E9E4A',
};

export const ar: React.CSSProperties = { fontFamily: FONT_FAMILY, direction: 'rtl' };

/** Exact cut points (seconds) — scene changes sit inside the pauses of the voiceover. */
export const CUT = { s2: 4.87, s3: 10.13, s4: 15.76, s5: 22.93, end: 30 };
/** Speech onsets used to sync on-screen text (seconds, measured with silencedetect). */
export const SPEECH = {
  chip1: 5.09,
  chip2: 6.63,
  chip3: 8.46,
  s3a: 10.28,
  s3b: 14.09,
  s4a: 15.91,
  s4b: 18.81,
  s4c: 20.15,
  s5a: 23.09,
  brand: 25.48,
  contact: 26.46,
};

/** Deep navy backdrop with drifting sky-cyan light, light streaks and particles. */
export const DarkBackground: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 34 }).map((_, i) => {
    const r = (n: number) => ((Math.sin(i * 91.17 + n * 47.3) * 43758.5453) % 1 + 1) % 1;
    return { x: r(1) * 1080, y: r(2) * 2000, s: 3 + r(3) * 7, sp: 0.4 + r(4) * 1.2, o: 0.25 + r(5) * 0.5 };
  });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 35%, ${D.navy2} 0%, ${D.navy1} 40%, ${D.navy0} 85%)` }}>
      <div
        style={{
          position: 'absolute',
          width: 1300,
          height: 1300,
          borderRadius: 1300,
          left: -520 + drift(frame, 1, 60, 400),
          top: 200 + drift(frame, 3, 40, 500),
          background: `radial-gradient(circle, rgba(56,211,245,${0.22 * intensity}), transparent 60%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: 1100,
          right: -520 + drift(frame, 5, 50, 450),
          bottom: -300,
          background: `radial-gradient(circle, rgba(29,111,232,${0.35 * intensity}), transparent 62%)`,
        }}
      />
      {/* soft diagonal light streaks */}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 0.55 * intensity }}>
        <defs>
          <linearGradient id="streak" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={D.cyan} stopOpacity="0" />
            <stop offset="0.5" stopColor={D.cyan} stopOpacity="0.8" />
            <stop offset="1" stopColor={D.cyan} stopOpacity="0" />
          </linearGradient>
          <filter id="sblur">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        {[0, 1, 2].map((i) => {
          const x = ((frame * (3 + i) + i * 600) % 2200) - 600;
          return <rect key={i} x={x} y={300 + i * 520} width={700} height={4 + i * 2} fill="url(#streak)" transform={`rotate(-18 ${x + 350} ${300 + i * 520})`} filter="url(#sblur)" />;
        })}
      </svg>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x + drift(frame, i, 18, 300),
            top: (((p.y - frame * p.sp) % 2000) + 2000) % 2000 - 40,
            width: p.s,
            height: p.s,
            borderRadius: p.s,
            background: D.cyanSoft,
            opacity: p.o * intensity * (0.6 + 0.4 * Math.sin((frame + i * 13) / 20)),
            boxShadow: `0 0 ${p.s * 3}px ${D.cyan}`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const Glass: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties; glow?: number }> = ({ children, style, glow = 0.35 }) => (
  <div
    style={{
      background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05))',
      border: '1.5px solid rgba(255,255,255,0.28)',
      borderRadius: 32,
      boxShadow: `0 30px 60px -24px rgba(0,0,0,0.6), 0 0 40px -10px rgba(56,211,245,${glow})`,
      backdropFilter: 'blur(16px)',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Big two-line title; each line enters as a whole unit (Arabic letters never split). */
export const Title: React.FC<{ lines: React.ReactNode[]; start: number; y: number; size?: number; gap?: number }> = ({ lines, start, y, size = 84, gap = 8 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...ar, position: 'absolute', top: y, left: 70, right: 120, textAlign: 'center', fontWeight: 700, fontSize: size, lineHeight: 1.3, color: D.white }}>
      {lines.map((l, i) => {
        const p = ease(frame, start + i * gap, 16);
        return (
          <div key={i} style={{ opacity: p, transform: `translateY(${mix(p, 40, 0)}px)`, filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined, textShadow: '0 6px 30px rgba(56,211,245,0.35)' }}>
            {l}
          </div>
        );
      })}
    </div>
  );
};

export const Hl: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: D.cyan }}>{children}</span>;
