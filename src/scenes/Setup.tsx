import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { drift, ease, mix, pop } from '../anim';
import { COLORS, CUES, TEXT } from '../config';
import { cueIn } from '../timeline';
import { Icon, IconName } from '../components/Icon';
import { At, Headline, SHADOW, arabic } from '../components/ui';

// Blue pinned cards connected by a string — inspired by the "what I can post" reference.
const CARDS: { x: number; y: number; rot: number; icon: IconName }[] = [
  { x: 700, y: 610, rot: -4, icon: 'edit' },
  { x: 320, y: 790, rot: 3, icon: 'shield' },
  { x: 700, y: 1010, rot: 3, icon: 'pin' },
  { x: 320, y: 1190, rot: -3, icon: 'tag' },
];
const CARD_W = 370;
const CARD_H = 290;

const PushPin: React.FC = () => (
  <svg width={64} height={74} viewBox="0 0 64 74" style={{ display: 'block' }}>
    <ellipse cx="38" cy="70" rx="12" ry="3" fill="rgba(0,0,0,0.18)" />
    <path d="M32 40 L38 68" stroke="#7A8698" strokeWidth="4" strokeLinecap="round" />
    <circle cx="30" cy="26" r="20" fill={COLORS.gRed} />
    <circle cx="23" cy="19" r="6" fill="#FFFFFF" opacity="0.55" />
  </svg>
);

export const Setup: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (src: number) => cueIn('setup', src);
  const cues = [CUES.createProfile, CUES.verify, CUES.location, CUES.category].map(c);
  const push = ease(frame, 0, 330);

  const pinPoint = (i: number) => ({ x: CARDS[i].x, y: CARDS[i].y - CARD_H / 2 + 6 });

  return (
    <AbsoluteFill style={{ transform: `scale(${mix(push, 1, 1.04)})` }}>
      <Headline text={TEXT.setupTitle} start={4} y={220} size={56} />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {[1, 2, 3].map((i) => {
          const a = pinPoint(i - 1);
          const b = pinPoint(i);
          const p = ease(frame, cues[i] - 6, 20);
          const midX = (a.x + b.x) / 2;
          const d = `M${a.x} ${a.y} C ${midX} ${a.y - 130}, ${midX} ${b.y - 130}, ${b.x} ${b.y}`;
          return (
            <path
              key={i}
              d={d}
              stroke={COLORS.ink}
              strokeWidth={3}
              fill="none"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
              opacity={0.75}
            />
          );
        })}
      </svg>
      {CARDS.map((card, i) => {
        const p = pop(frame, cues[i] - 4, 12);
        const active = i === CARDS.length - 1 ? 1 : 1 - ease(frame, cues[i + 1], 14) * 0.25;
        return (
          <At key={i} x={card.x} y={card.y + drift(frame, i, 4)}>
            <div
              style={{
                opacity: Math.min(1, p * 1.6) * active,
                transform: `rotate(${card.rot}deg) scale(${mix(p, 0.6, 1)}) translateY(${mix(p, 50, 0)}px)`,
                position: 'relative',
              }}
            >
              <div
                style={{
                  ...arabic,
                  width: CARD_W,
                  height: CARD_H,
                  borderRadius: 30,
                  background: `linear-gradient(160deg, ${COLORS.cyan} 0%, ${COLORS.blue} 45%, ${COLORS.blueDeep} 100%)`,
                  boxShadow: SHADOW,
                  padding: 18,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    borderRadius: 20,
                    background: 'rgba(255,255,255,0.95)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name={card.icon} size={96} color={COLORS.blue} stroke={1.8} />
                </div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 34, textAlign: 'center', padding: '16px 6px 4px' }}>
                  {TEXT.setupCards[i]}
                </div>
              </div>
              <div style={{ position: 'absolute', top: -46, left: '50%', transform: 'translateX(-50%)' }}>
                <PushPin />
              </div>
            </div>
          </At>
        );
      })}
    </AbsoluteFill>
  );
};
