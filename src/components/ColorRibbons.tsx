import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ease, mix } from '../anim';
import { COLORS } from '../config';

// Wide multicolour light ribbons converging on a focus point
// (flow/depth idea from the "download (1)" reference).
const BAND_COLORS = [COLORS.gRed, '#F57C2B', COLORS.gYellow, COLORS.gGreen, COLORS.gBlue];

export const ColorRibbons: React.FC<{
  start: number; // frame the ribbons start drawing
  focus: number; // 0→1 glow at the meeting point
  focusFade?: number;
  opacity?: number;
  focusPoint?: { x: number; y: number };
  bandW?: number;
  drawFrames?: number;
}> = ({ start, focus, focusFade = 0, opacity = 1, focusPoint = { x: 510, y: 800 }, bandW = 64, drawFrames = 50 }) => {
  const frame = useCurrentFrame();
  const F = focusPoint;
  const ribbon = (side: 'left' | 'right', o: number) =>
    side === 'left'
      ? `M-360 ${F.y + 1080 + o * 1.3} C 120 ${F.y + 840 + o * 1.1}, 260 ${F.y + 280 + o * 0.6}, ${F.x} ${F.y + o * 0.15}`
      : `M1460 ${F.y + 760 + o * 1.3} C 1020 ${F.y + 670 + o * 1.0}, 780 ${F.y + 240 + o * 0.5}, ${F.x} ${F.y + o * 0.15}`;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity }}>
      <defs>
        <filter id="ribbonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id="softLight" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <radialGradient id="focusGlow">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="0.4" stopColor="#BFE3FF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#BFE3FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      {(['left', 'right'] as const).map((side, si) =>
        BAND_COLORS.map((color, ci) => {
          const o = (ci - (BAND_COLORS.length - 1) / 2) * (bandW - 4);
          const d = ribbon(side, side === 'left' ? o : -o);
          const draw = ease(frame, start + si * 10 + ci * 2, drawFrames);
          return (
            <g key={`${side}-${ci}`}>
              <path d={d} stroke={color} strokeWidth={bandW * 1.6} fill="none" opacity={0.28} filter="url(#ribbonGlow)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
              <path d={d} stroke={color} strokeWidth={bandW} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} opacity={0.92} />
              {/* light travelling along the ribbon */}
              <path
                d={d}
                stroke="#FFFFFF"
                strokeWidth={bandW * 0.8}
                strokeLinecap="round"
                fill="none"
                filter="url(#softLight)"
                pathLength={1}
                strokeDasharray="0.12 0.88"
                strokeDashoffset={-((frame + ci * 9 + si * 30) / 70)}
                opacity={0.5 * draw}
              />
            </g>
          );
        }),
      )}
      <circle cx={F.x} cy={F.y} r={mix(focus, 0, 260)} fill="url(#focusGlow)" opacity={focus * (1 - focusFade)} />
    </svg>
  );
};
