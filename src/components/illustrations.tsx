import React from 'react';
import { COLORS } from '../config';

// Original vector illustrations used instead of copying any reference artwork.

export const Storefront: React.FC<{ width?: number; variant?: number }> = ({ width = 400, variant = 0 }) => {
  const awning = [COLORS.blue, '#0F9D8F', '#E8743B'][variant % 3];
  return (
    <svg width={width} height={width * 0.7} viewBox="0 0 400 280" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`sky${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE6FB" />
          <stop offset="1" stopColor="#F2F8FF" />
        </linearGradient>
        <linearGradient id={`glass${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE7B8" />
          <stop offset="1" stopColor="#F6B85C" />
        </linearGradient>
      </defs>
      <rect width="400" height="280" fill={`url(#sky${variant})`} />
      <circle cx="330" cy="58" r="26" fill="#FFF3C4" />
      <rect x="0" y="232" width="400" height="48" fill="#DDE7F2" />
      <rect x="60" y="78" width="280" height="160" rx="6" fill="#FFFFFF" />
      <rect x="60" y="78" width="280" height="26" fill="#0E2140" opacity="0.9" />
      {Array.from({ length: 7 }).map((_, i) => (
        <path
          key={i}
          d={`M${60 + i * 40} 104h40v22a20 20 0 0 1-40 0Z`}
          fill={i % 2 ? '#FFFFFF' : awning}
          stroke={awning}
          strokeWidth="1.5"
        />
      ))}
      <rect x="82" y="148" width="110" height="78" rx="6" fill={`url(#glass${variant})`} />
      <rect x="212" y="148" width="104" height="90" rx="6" fill="#26476F" />
      <rect x="220" y="156" width="40" height="76" rx="3" fill={`url(#glass${variant})`} opacity="0.85" />
      <rect x="268" y="156" width="40" height="76" rx="3" fill={`url(#glass${variant})`} opacity="0.85" />
      <circle cx="40" cy="214" r="22" fill="#34A853" opacity="0.85" />
      <rect x="37" y="214" width="6" height="22" fill="#6B4A2B" />
      <circle cx="362" cy="210" r="24" fill="#34A853" opacity="0.8" />
      <rect x="359" y="212" width="6" height="24" fill="#6B4A2B" />
    </svg>
  );
};

/** Product shots: a few simple shapes on a soft gradient. */
export const ProductShot: React.FC<{ width?: number; kind?: 'cup' | 'bag' | 'box' }> = ({ width = 300, kind = 'cup' }) => (
  <svg width={width} height={width} viewBox="0 0 300 300" style={{ display: 'block' }}>
    <defs>
      <radialGradient id={`pg-${kind}`} cx="0.5" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor={kind === 'cup' ? '#F7E3CF' : kind === 'bag' ? '#DCEBFB' : '#E4F4EA'} />
      </radialGradient>
    </defs>
    <rect width="300" height="300" fill={`url(#pg-${kind})`} />
    <ellipse cx="150" cy="250" rx="90" ry="14" fill="rgba(0,0,0,0.08)" />
    {kind === 'cup' && (
      <>
        <path d="M95 120h110l-12 125H107Z" fill="#FFFFFF" stroke="#E2C9AE" strokeWidth="3" />
        <rect x="88" y="104" width="124" height="20" rx="8" fill="#6B4A2B" />
        <rect x="104" y="160" width="92" height="44" rx="6" fill={COLORS.blue} />
        <path d="M130 90c0-12 10-12 10-24M155 90c0-12 10-12 10-24" stroke="#C9B39A" strokeWidth="4" fill="none" strokeLinecap="round" />
      </>
    )}
    {kind === 'bag' && (
      <>
        <path d="M80 110h140l12 135H68Z" fill={COLORS.blue} />
        <path d="M118 110V92a32 32 0 0 1 64 0v18" stroke="#0A4E9B" strokeWidth="8" fill="none" />
        <rect x="112" y="160" width="76" height="40" rx="8" fill="#FFFFFF" opacity="0.9" />
      </>
    )}
    {kind === 'box' && (
      <>
        <path d="M150 80l85 40v95l-85 40-85-40v-95Z" fill="#F5B651" />
        <path d="M65 120l85 40 85-40M150 160v95" stroke="#D9902A" strokeWidth="4" fill="none" />
        <path d="M108 100l85 40" stroke="#FFFFFF" strokeWidth="10" opacity="0.8" />
      </>
    )}
  </svg>
);

/** Stylised city map, original artwork. */
export const MapArt: React.FC<{ width?: number; height?: number }> = ({ width = 900, height = 900 }) => (
  <svg width={width} height={height} viewBox="0 0 900 900" style={{ display: 'block' }}>
    <rect width="900" height="900" fill="#EEF4EA" />
    <path d="M-20 640C140 600 220 700 380 690S640 560 920 600V920H-20Z" fill="#BFDDF7" />
    <rect x="80" y="80" width="230" height="180" rx="22" fill="#D3EBC9" />
    <rect x="560" y="120" width="250" height="150" rx="22" fill="#E3E8EF" />
    <rect x="120" y="360" width="200" height="170" rx="22" fill="#E3E8EF" />
    <rect x="520" y="360" width="280" height="160" rx="22" fill="#D3EBC9" />
    {[
      'M-20 320H920',
      'M420 -20V920',
      'M-20 560C200 520 300 540 920 470',
      'M700 -20C660 200 720 360 620 920',
    ].map((d) => (
      <g key={d}>
        <path d={d} stroke="#FFFFFF" strokeWidth="34" fill="none" strokeLinecap="round" />
        <path d={d} stroke="#F8D47A" strokeWidth="6" fill="none" strokeDasharray="1 0" opacity="0.6" />
      </g>
    ))}
    <path d="M140 -20V300M-20 760H420" stroke="#FFFFFF" strokeWidth="18" fill="none" />
  </svg>
);

/** Binoculars peeking through — redrawn as a vector (inspired by the hook reference). */
export const Binoculars: React.FC<{ width?: number; glint?: number }> = ({ width = 520, glint = 0 }) => (
  <svg width={width} height={width * 0.55} viewBox="0 0 520 286" style={{ display: 'block' }}>
    <defs>
      <radialGradient id="lens" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#9FD8FF" />
        <stop offset="0.45" stopColor="#1E6FCB" />
        <stop offset="1" stopColor="#071B3A" />
      </radialGradient>
      <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4A5566" />
        <stop offset="1" stopColor="#1A2230" />
      </linearGradient>
    </defs>
    <rect x="215" y="70" width="90" height="70" rx="20" fill="url(#body)" />
    <rect x="236" y="40" width="48" height="50" rx="14" fill="#2C3646" />
    {[130, 390].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy="150" r="122" fill="url(#body)" />
        <circle cx={cx} cy="150" r="98" fill="#0B1424" />
        <circle cx={cx} cy="150" r="86" fill="url(#lens)" />
        <path
          d={`M${cx - 58} ${110} q 40 -36 92 -14`}
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
          opacity={0.55 + glint * 0.4}
        />
        <circle cx={cx + 40} cy="190" r="10" fill="#FFFFFF" opacity={0.3 + glint * 0.5} />
      </g>
    ))}
  </svg>
);

/** Deterministic torn-paper hole outline. */
export const tornPath = (cx: number, cy: number, rx: number, ry: number, seed = 3, points = 46) => {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const pts: string[] = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const k = 0.86 + rand() * 0.22;
    pts.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)},${(cy + Math.sin(a) * ry * k).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
};
