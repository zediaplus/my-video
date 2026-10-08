import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { drift, ease, mix, move, pop } from '../anim';
import { COLORS, CUES, TEXT } from '../config';
import { cueIn } from '../timeline';
import { Icon } from '../components/Icon';
import { Binoculars, MapArt, tornPath } from '../components/illustrations';
import { At, CENTER_X, Headline, MapPin, SHADOW, arabic } from '../components/ui';

const HOLE_W = 760;
const HOLE_H = 600;
const HOLE_Y = 1010;

export const SearchBar: React.FC<{ text: string; chars: number; cursor: boolean; width?: number }> = ({
  text,
  chars,
  cursor,
  width = 780,
}) => (
  <div
    style={{
      ...arabic,
      width,
      height: 120,
      borderRadius: 60,
      background: COLORS.white,
      boxShadow: SHADOW,
      border: `2px solid ${COLORS.line}`,
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      padding: '0 40px',
      boxSizing: 'border-box',
    }}
  >
    <Icon name="search" size={48} color={COLORS.blue} stroke={2.4} />
    <div style={{ fontSize: 48, fontWeight: 500, color: COLORS.ink, flex: 1, whiteSpace: 'nowrap' }}>
      {/* typed as whole words so the Arabic letters stay joined */}
      {text.split(' ').slice(0, chars).join(' ')}
      <span style={{ color: COLORS.blue, opacity: cursor ? 1 : 0, fontWeight: 300 }}>|</span>
    </div>
    <div style={{ display: 'flex', gap: 6 }}>
      {[COLORS.gBlue, COLORS.gRed, COLORS.gYellow, COLORS.gGreen].map((c) => (
        <div key={c} style={{ width: 10, height: 10, borderRadius: 10, background: c }} />
      ))}
    </div>
  </div>
);

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (src: number) => cueIn('hook', src);

  // search bar: types the query, then rises to make room
  const words = TEXT.searchQuery.split(' ').length;
  const typed = Math.min(words, Math.floor(Math.max(0, frame - 8) / 12) + (frame >= 8 ? 1 : 0));
  const cursor = Math.floor(frame / 15) % 2 === 0 || frame < 50;
  const rise = move(frame, c(CUES.question) - 6, 22);
  const barY = mix(rise, 820, 560);
  const barIn = ease(frame, 0, 14);

  // torn-paper hole with binoculars
  const holeIn = pop(frame, c(CUES.searching) - 8, 15);
  const reveal = move(frame, c(CUES.showUp) - 4, 26);
  const arrow = ease(frame, c(CUES.searching) + 30, 30);
  const glint = Math.max(0, Math.sin(((frame - c(CUES.searching)) / 40) * Math.PI));
  const pinDrop = pop(frame, c(CUES.showUp) + 14, 11);
  const hole = tornPath(HOLE_W / 2, HOLE_H / 2, HOLE_W / 2 - 30, HOLE_H / 2 - 30, 11);

  return (
    <AbsoluteFill>
      {frame >= c(CUES.question) - 6 && <Headline text={TEXT.hookTitle} start={c(CUES.question) - 2} y={220} size={76} />}

      {/* curved arrow from the search bar to the hole */}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 1 - reveal }}>
        <path
          d="M800 640 C 960 760, 900 900, 830 960"
          stroke={COLORS.cyan}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - arrow}
        />
        <path
          d="M845 930 L830 960 L862 966"
          stroke={COLORS.cyan}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={arrow > 0.95 ? 1 : 0}
        />
      </svg>

      {/* paper hole */}
      <At x={CENTER_X} y={HOLE_Y + drift(frame, 3, 4)}>
        <div
          style={{
            width: HOLE_W,
            height: HOLE_H,
            position: 'relative',
            transform: `scale(${holeIn * mix(reveal, 1, 1.12)})`,
            opacity: Math.min(1, holeIn * 1.5),
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: `path('${hole}')`,
              background: 'radial-gradient(ellipse at 50% 40%, #1C3E6E, #08152B 75%)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '52%',
                transform: `translate(-50%, -50%) scale(${mix(holeIn, 0.7, 1) * mix(reveal, 1, 1.4)})`,
                opacity: 1 - reveal,
              }}
            >
              <Binoculars width={560} glint={glint} />
            </div>
            <div style={{ position: 'absolute', left: -70, top: -150, opacity: reveal, transform: `scale(${mix(reveal, 1.25, 1)})` }}>
              <MapArt width={900} height={900} />
            </div>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '46%',
                transform: `translate(-50%, ${mix(pinDrop, -420, -100)}%)`,
                opacity: reveal,
              }}
            >
              <MapPin size={130} />
            </div>
          </div>
          <svg width={HOLE_W} height={HOLE_H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <path d={hole} fill="none" stroke="#FFFFFF" strokeWidth={22} strokeLinejoin="round" style={{ filter: 'drop-shadow(0 10px 14px rgba(10,30,70,0.35))' }} />
          </svg>
        </div>
      </At>

      <At x={CENTER_X} y={barY}>
        <div style={{ opacity: barIn, transform: `scale(${mix(barIn, 0.92, 1)})` }}>
          <SearchBar text={TEXT.searchQuery} chars={typed} cursor={cursor} />
        </div>
      </At>
    </AbsoluteFill>
  );
};
