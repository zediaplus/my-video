import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { drift } from '../anim';
import { COLORS } from '../config';

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
    </AbsoluteFill>
  );
};
