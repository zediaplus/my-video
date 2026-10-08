import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { drift } from '../anim';
import { COLORS } from '../config';

// Slow floating dots in the four accent colours — adds life without competing with the content.
const PARTICLES = Array.from({ length: 22 }).map((_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return {
    x: r(1) * 1080,
    y: r(2) * 2100,
    size: 8 + r(3) * 18,
    speed: 0.6 + r(4) * 1.4,
    opacity: 0.18 + r(5) * 0.22,
    color: [COLORS.gBlue, COLORS.gRed, COLORS.gYellow, COLORS.gGreen, COLORS.cyan][i % 5],
  };
});

/** Persistent soft white/blue backdrop with a faint grid and slow light blobs. */
export const Background: React.FC<{ grid?: number }> = ({ grid = 0.5 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.white} 0%, ${COLORS.bg} 55%, ${COLORS.bgDeep} 100%)` }}>
      <AbsoluteFill
        style={{
          opacity: grid,
          backgroundImage: `linear-gradient(${COLORS.line} 1.5px, transparent 1.5px), linear-gradient(90deg, ${COLORS.line} 1.5px, transparent 1.5px)`,
          backgroundSize: '72px 72px',
          backgroundPosition: `${drift(frame, 1, 10, 600)}px ${frame * 0.15}px`,
          maskImage: 'radial-gradient(ellipse at 50% 45%, black 30%, transparent 80%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: 900,
          left: -380 + drift(frame, 2, 30, 500),
          top: -300,
          background: 'radial-gradient(circle, rgba(18,176,221,0.18), transparent 65%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 1000,
          borderRadius: 1000,
          right: -460,
          bottom: -260 + drift(frame, 5, 30, 520),
          background: 'radial-gradient(circle, rgba(11,127,199,0.16), transparent 65%)',
        }}
      />
      {PARTICLES.map((pt, i) => {
        const y = ((pt.y - frame * pt.speed) % 2100 + 2100) % 2100 - 90;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pt.x + drift(frame, i, 24, 260),
              top: y,
              width: pt.size,
              height: pt.size,
              borderRadius: pt.size,
              background: pt.color,
              opacity: pt.opacity,
              filter: pt.size > 16 ? 'blur(1.5px)' : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
