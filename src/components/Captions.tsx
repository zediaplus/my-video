import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ease, mix } from '../anim';
import { COLORS, SAFE, VIDEO } from '../config';
import { CAPTIONS_OUT, CaptionOut } from '../timeline';
import { stripHarakat } from './captionText';
import { arabic } from './ui';

// Sits above the logo + call bar at the bottom.
const BOTTOM = 390;

export const Captions: React.FC<{ items?: CaptionOut[]; bottom?: number }> = ({ items = CAPTIONS_OUT, bottom = BOTTOM }) => {
  const frame = useCurrentFrame();
  const t = frame / VIDEO.fps;
  const idx = items.findIndex((c, i) => {
    const next = items[i + 1];
    const until = next ? Math.min(next.outStart, c.outEnd + 0.6) : c.outEnd + 0.8;
    return t >= c.outStart - 0.1 && t < until;
  });
  if (idx < 0) return null;
  const c = items[idx];
  const startF = (c.outStart - 0.1) * VIDEO.fps;
  const p = ease(frame, startF, 8);
  const hl = new Set((c.hl ?? []).map(stripHarakat));
  const words = stripHarakat(c.text).split(' ');
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left,
        right: SAFE.right,
        bottom,
        display: 'flex',
        justifyContent: 'center',
        opacity: p,
        transform: `translateY(${mix(p, 14, 0)}px)`,
      }}
    >
      <div
        style={{
          ...arabic,
          maxWidth: '100%',
          background: 'rgba(255,255,255,0.92)',
          border: `1.5px solid ${COLORS.line}`,
          borderRadius: 28,
          padding: '18px 34px 22px',
          boxShadow: '0 16px 36px -18px rgba(14,46,96,0.35)',
          textAlign: 'center',
          fontSize: 44,
          lineHeight: 1.55,
          fontWeight: 500,
          color: COLORS.ink,
          // never more than two lines
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {words.map((w, i) => (
          <React.Fragment key={i}>
            {hl.has(w) ? <span style={{ color: COLORS.highlight, fontWeight: 700 }}>{w}</span> : w}
            {i < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
