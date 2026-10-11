import React from 'react';
import { Img, getStaticFiles, staticFile, useCurrentFrame } from 'remotion';
import * as si from 'simple-icons';
import { ease, mix } from '../anim';
import { FONT_FAMILY } from '../config';

// Light motion-design theme (white / soft blue / brand blue) — kinetic typography,
// highlight boxes, colour wipes, orbiting icons and a spinning 3D card ring,
// following the two reference videos the user supplied.
export const L = {
  white: '#FFFFFF',
  bg: '#F4F8FF',
  soft: '#E6F0FF',
  blue: '#0B7FC7',
  blueDeep: '#0A3D91',
  royal: '#1F5FE0',
  cyan: '#2BB8F0',
  ink: '#0B1B3A',
  inkSoft: '#56688A',
  line: '#D6E4F7',
  call: '#1E9E4A',
};

export const ar: React.CSSProperties = { fontFamily: FONT_FAMILY, direction: 'rtl' };

// ---------------------------------------------------------------- kinetic words
/**
 * Word-by-word reveal. Each Arabic word is one unit (letters never split).
 * Words listed in `hl` get a brand-blue highlight box that grows in behind them.
 */
export const Words: React.FC<{
  text: string;
  start: number;
  size?: number;
  color?: string;
  hl?: string[];
  stagger?: number;
  weight?: number;
  hlColor?: string;
  hlText?: string;
  style?: React.CSSProperties;
}> = ({ text, start, size = 96, color = L.ink, hl = [], stagger = 4, weight = 700, hlColor = L.blue, hlText = L.white, style }) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div style={{ ...ar, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.28, rowGap: size * 0.12, fontSize: size, fontWeight: weight, lineHeight: 1.25, color, ...style }}>
      {words.map((w, i) => {
        const p = ease(frame, start + i * stagger, 14);
        const isHl = hl.includes(w);
        const box = ease(frame, start + i * stagger + 6, 12);
        return (
          <span
            key={i}
            style={{
              position: 'relative',
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${mix(p, size * 0.5, 0)}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
              color: isHl && box > 0.5 ? hlText : undefined,
              padding: isHl ? `0 ${size * 0.16}px` : undefined,
              zIndex: 1,
            }}
          >
            {isHl && (
              <span
                style={{
                  position: 'absolute',
                  inset: `${size * 0.08}px 0 ${size * 0.02}px`,
                  borderRadius: size * 0.18,
                  background: hlColor,
                  transform: `scaleX(${box})`,
                  transformOrigin: 'right center',
                  zIndex: -1,
                }}
              />
            )}
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- social icons (official shapes, simple-icons CC0)
export type Social = 'instagram' | 'snapchat' | 'tiktok' | 'x' | 'whatsapp' | 'youtube' | 'facebook' | 'google' | 'telegram';
const SI: Record<Social, { path: string; hex: string }> = {
  instagram: si.siInstagram,
  snapchat: si.siSnapchat,
  tiktok: si.siTiktok,
  x: si.siX,
  whatsapp: si.siWhatsapp,
  youtube: si.siYoutube,
  facebook: si.siFacebook,
  google: si.siGoogle,
  telegram: si.siTelegram,
};

/** Glossy 3D blue tile with the platform glyph in white (like the reference posters). */
export const SocialTile: React.FC<{ name: Social; size?: number; tilt?: number; tone?: 'blue' | 'brand' }> = ({ name, size = 140, tilt = 0, tone = 'blue' }) => {
  const brandBg: Partial<Record<Social, string>> = {
    instagram: 'linear-gradient(135deg,#FEDA75 0%,#FA7E1E 25%,#D62976 50%,#962FBF 75%,#4F5BD5 100%)',
    snapchat: '#FFFC00',
    tiktok: '#111111',
    x: '#111111',
    whatsapp: '#25D366',
    youtube: '#FF0000',
    facebook: '#0866FF',
    google: '#FFFFFF',
    telegram: '#26A5E4',
  };
  const bg = tone === 'brand' ? brandBg[name] : `linear-gradient(150deg, #3D8BFF 0%, ${L.royal} 45%, ${L.blueDeep} 100%)`;
  const glyph = tone === 'brand' && (name === 'snapchat' || name === 'google') ? (name === 'google' ? '#4285F4' : '#111111') : '#FFFFFF';
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `rotate(${tilt}deg)`,
        boxShadow: `0 ${size * 0.08}px 0 ${tone === 'blue' ? '#082C6E' : 'rgba(0,0,0,0.18)'}, 0 ${size * 0.25}px ${size * 0.4}px -${size * 0.12}px rgba(10,40,110,0.45), inset 0 ${size * 0.05}px ${size * 0.06}px rgba(255,255,255,0.45)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '45%', background: 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0))' }} />
      <svg viewBox="0 0 24 24" width={size * 0.52} height={size * 0.52} style={{ position: 'relative' }}>
        <path d={SI[name].path} fill={glyph} />
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------- photo slots
const STATIC = new Set(getStaticFiles().map((f) => f.name));
/**
 * Real photo if the user supplied one at public/ads30/photos/<name>.jpg, otherwise the
 * fallback illustration. Drop photos in that folder and re-render — no code change.
 */
export const PhotoSlot: React.FC<{ name: string; w: number; h: number; fallback: React.ReactNode; radius?: number }> = ({ name, w, h, fallback, radius = 0 }) => {
  const file = ['jpg', 'jpeg', 'png', 'webp'].map((e) => `ads30/photos/${name}.${e}`).find((f) => STATIC.has(f));
  return (
    <div style={{ width: w, height: h, overflow: 'hidden', borderRadius: radius, position: 'relative', background: L.soft }}>
      {file ? <Img src={staticFile(file)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : fallback}
    </div>
  );
};

// ---------------------------------------------------------------- backgrounds & wipes
export const LightBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 40%, ${L.white} 0%, ${L.bg} 55%, ${L.soft} 100%)` }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.6,
          backgroundImage: `radial-gradient(${L.line} 2px, transparent 2px)`,
          backgroundSize: '44px 44px',
          backgroundPosition: `0 ${frame * 0.4}px`,
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%)',
        }}
      />
      {/* soft sweeping light bands, as in the reference poster */}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M-200 ${1260 + i * 70 + Math.sin(frame / 60 + i) * 30} C 300 ${1060 + i * 60}, 760 ${1180 + i * 50}, 1300 ${980 + i * 70}`}
            stroke={i === 1 ? L.cyan : L.royal}
            strokeOpacity={0.08 + i * 0.03}
            strokeWidth={60 - i * 14}
            fill="none"
          />
        ))}
      </svg>
    </div>
  );
};

/** Solid brand-blue panel that wipes in from a circle (alternating white / blue beats). */
export const BlueWipe: React.FC<{ start: number; end?: number; origin?: string }> = ({ start, end, origin = '50% 50%' }) => {
  const frame = useCurrentFrame();
  const inP = ease(frame, start, 16);
  const outP = end === undefined ? 0 : ease(frame, end, 14);
  if (inP <= 0 || outP >= 1) return null;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at 50% 35%, #2C8BFF 0%, ${L.royal} 45%, ${L.blueDeep} 100%)`,
        clipPath: `circle(${inP * 150 * (1 - outP)}% at ${origin})`,
      }}
    />
  );
};

/** A card on the spinning 3D ring (second reference video). */
export const Ring3D: React.FC<{ items: React.ReactNode[]; radius: number; cardW: number; cardH: number; speed?: number; tilt?: number; start?: number }> = ({
  items,
  radius,
  cardW,
  cardH,
  speed = 0.9,
  tilt = -10,
  start = 0,
}) => {
  const frame = useCurrentFrame();
  const n = items.length;
  const spin = (frame - start) * speed;
  return (
    <div style={{ width: 1, height: 1, perspective: 2200, perspectiveOrigin: '50% 30%' }}>
      <div style={{ transformStyle: 'preserve-3d', transform: `rotateX(${tilt}deg)` }}>
        {items.map((it, i) => {
          const a = (360 / n) * i + spin;
          const facing = Math.cos((a * Math.PI) / 180);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: -cardW / 2,
                top: -cardH / 2,
                width: cardW,
                height: cardH,
                transform: `rotateY(${a}deg) translateZ(${radius}px)`,
                backfaceVisibility: 'hidden',
                filter: `brightness(${0.75 + 0.25 * Math.max(0, facing)})`,
              }}
            >
              {it}
            </div>
          );
        })}
      </div>
    </div>
  );
};
