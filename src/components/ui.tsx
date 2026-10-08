import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { ease, mix } from '../anim';
import { BRAND, COLORS, FONT_FAMILY, SAFE, SAFE_CENTER_X, VIDEO } from '../config';
import { Icon, IconName } from './Icon';

export const arabic: React.CSSProperties = { fontFamily: FONT_FAMILY, direction: 'rtl' };

export const SHADOW = '0 30px 60px -20px rgba(14,46,96,0.28), 0 10px 24px -12px rgba(14,46,96,0.18)';
export const SHADOW_SOFT = '0 18px 40px -18px rgba(14,46,96,0.25)';

/** Absolutely positions children so that (x, y) is their centre. */
export const At: React.FC<{ x: number; y: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  x,
  y,
  children,
  style,
}) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 'max-content', transform: 'translate(-50%, -50%)', ...style }}>{children}</div>
);

/** Short scene headline. Animated as one unit — Arabic letters are never split. */
export const Headline: React.FC<{ text: string; start?: number; y?: number; size?: number; color?: string }> = ({
  text,
  start = 6,
  y = 300,
  size = 64,
  color = COLORS.ink,
}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, start, 20);
  return (
    <div
      style={{
        ...arabic,
        position: 'absolute',
        top: y,
        left: SAFE.left,
        right: SAFE.right,
        textAlign: 'center',
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.35,
        color,
        opacity: p,
        transform: `translateY(${mix(p, 26, 0)}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  glass?: boolean;
}> = ({ children, style, glass }) => (
  <div
    style={{
      background: glass ? 'rgba(255,255,255,0.72)' : COLORS.white,
      border: glass ? '2px solid rgba(255,255,255,0.9)' : `1.5px solid ${COLORS.line}`,
      borderRadius: 36,
      boxShadow: SHADOW,
      backdropFilter: glass ? 'blur(14px)' : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

export const IconBadge: React.FC<{ name: IconName; color?: string; bg?: string; size?: number }> = ({
  name,
  color = COLORS.blue,
  bg = '#E7F2FD',
  size = 84,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <Icon name={name} size={size * 0.55} color={color} />
  </div>
);

/** The Zedia logo (script wordmark), with the Arabic name under it when needed. */
export const Logo: React.FC<{ width?: number }> = ({ width = 360 }) => (
  <Img src={staticFile(BRAND.logo)} style={{ width, display: 'block' }} />
);

/** Phone number, always isolated as LTR inside the RTL layout. */
export const PhoneNumber: React.FC<{ size?: number; color?: string }> = ({ size = 64, color = COLORS.ink }) => (
  <span
    dir="ltr"
    style={{
      fontFamily: FONT_FAMILY,
      unicodeBidi: 'isolate',
      direction: 'ltr',
      fontWeight: 700,
      fontSize: size,
      letterSpacing: 2,
      color,
      fontVariantNumeric: 'tabular-nums',
    }}
  >
    {BRAND.phone}
  </span>
);

/** Map pin in the four Google accent colours — a generic pin, not the Google Maps logo. */
export const MapPin: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = COLORS.blue }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id={`pin-${color}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={COLORS.cyan} />
        <stop offset="1" stopColor={color} />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="124" rx="18" ry="5" fill="rgba(14,46,96,0.18)" />
    <path
      d="M50 120C50 120 10 78 10 48a40 40 0 0 1 80 0c0 30-40 72-40 72Z"
      fill={`url(#pin-${color})`}
      stroke="white"
      strokeWidth="3"
    />
    <circle cx="50" cy="47" r="15" fill="white" />
  </svg>
);

/** Small row of Google accent dots, used sparingly as a colour cue. */
export const AccentDots: React.FC<{ size?: number; gap?: number }> = ({ size = 14, gap = 10 }) => (
  <div style={{ display: 'flex', gap, direction: 'ltr' }}>
    {[COLORS.gBlue, COLORS.gRed, COLORS.gYellow, COLORS.gGreen].map((c) => (
      <div key={c} style={{ width: size, height: size, borderRadius: size, background: c }} />
    ))}
  </div>
);

/** Fades/scales a whole scene in and out so neighbouring scenes overlap smoothly. */
export const SceneShell: React.FC<{ duration: number; overlap: number; children: React.ReactNode; exitScale?: number }> = ({
  duration,
  overlap,
  children,
  exitScale = 1.04,
}) => {
  const frame = useCurrentFrame();
  const enter = ease(frame, 0, 16);
  const exit = ease(frame, duration, overlap);
  return (
    <AbsoluteFill
      style={{
        opacity: enter * (1 - exit),
        transform: `scale(${mix(enter, 0.97, 1) * mix(exit, 1, exitScale)})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const CENTER_X = SAFE_CENTER_X;
export const H = VIDEO.height;
