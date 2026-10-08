import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { drift, ease, mix, move, pop } from '../anim';
import { COLORS, CUES, TEXT } from '../config';
import { cueIn } from '../timeline';
import { Icon, IconName } from '../components/Icon';
import { MapArt, Storefront } from '../components/illustrations';
import { At, CENTER_X, Card, Headline, MapPin, SHADOW, arabic } from '../components/ui';

// Colour light-trails flowing into a map (depth/flow idea from the "download (1)" reference).
const TRAILS = [
  { color: COLORS.gRed, d: 'M-200 1500 C 200 1300, 380 1150, 510 820' },
  { color: COLORS.gYellow, d: 'M-200 1620 C 260 1420, 420 1200, 510 830' },
  { color: COLORS.gGreen, d: 'M300 2100 C 420 1600, 470 1200, 510 840' },
  { color: COLORS.gBlue, d: 'M1300 1500 C 900 1350, 640 1150, 510 830' },
];

const CHIP_ICONS: IconName[] = ['target', 'pin', 'wallet'];

export const Ads: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (src: number) => cueIn('ads', src);
  const trails = ease(frame, c(CUES.moreClients) - 4, 40);
  const trailsOut = ease(frame, c(CUES.campaigns) + 10, 30);
  const mapIn = move(frame, c(CUES.campaigns) - 4, 28);
  const adCard = pop(frame, c(CUES.campaigns) + 40, 14);
  const pins = [0, 1, 2].map((i) => pop(frame, c(CUES.campaigns) + 18 + i * 6, 11));
  const chips = [0, 1, 2].map((i) => pop(frame, c(CUES.budget) + i * 8, 13));

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 1 - trailsOut * 0.85 }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        {TRAILS.map((t, i) => (
          <g key={i}>
            <path d={t.d} stroke={t.color} strokeWidth={70} fill="none" opacity={0.35} filter="url(#glow)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - trails} />
            <path d={t.d} stroke={t.color} strokeWidth={14} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - trails} opacity={0.9} />
          </g>
        ))}
      </svg>

      <Headline text={TEXT.adsTitle} start={c(CUES.campaigns) + 6} y={220} size={56} />

      <At x={CENTER_X} y={820}>
        <div
          style={{
            width: 800,
            height: 620,
            borderRadius: 44,
            overflow: 'hidden',
            boxShadow: SHADOW,
            border: '8px solid white',
            position: 'relative',
            opacity: mapIn,
            transform: `scale(${mix(mapIn, 0.3, 1)})`,
          }}
        >
          <div style={{ position: 'absolute', left: -60, top: -170, transform: `scale(${mix(ease(frame, 0, 340), 1, 1.08)})` }}>
            <MapArt width={920} height={920} />
          </div>
          {[
            { x: 230, y: 170 },
            { x: 610, y: 210 },
            { x: 400, y: 330 },
          ].map((p, i) => (
            <div key={i} style={{ position: 'absolute', left: p.x - 40, top: p.y - 100, transform: `translateY(${mix(pins[i], -80, 0)}px)`, opacity: Math.min(1, pins[i] * 2) }}>
              <MapPin size={i === 2 ? 90 : 62} color={i === 2 ? COLORS.blue : '#7FA8D6'} />
            </div>
          ))}
        </div>
      </At>

      {/* sponsored result card, clearly marked "إعلان" */}
      <At x={CENTER_X} y={1110 + drift(frame, 2, 4)}>
        <div style={{ opacity: Math.min(1, adCard * 1.5), transform: `translateY(${mix(adCard, 90, 0)}px)` }}>
          <Card style={{ ...arabic, width: 740, padding: 24, boxSizing: 'border-box', display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ width: 150, height: 110, borderRadius: 20, overflow: 'hidden', flexShrink: 0 }}>
              <Storefront width={160} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: COLORS.ink, border: `2px solid ${COLORS.ink}`, borderRadius: 8, padding: '0 10px' }}>
                  إعلان
                </span>
                <span style={{ fontSize: 36, fontWeight: 700, color: COLORS.ink }}>نشاطك التجاري</span>
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
                {[
                  { i: 'phone' as const, t: 'اتصال' },
                  { i: 'directions' as const, t: 'الاتجاهات' },
                ].map((b) => (
                  <div
                    key={b.t}
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      background: '#E8F2FD',
                      color: COLORS.blueDeep,
                      borderRadius: 30,
                      padding: '6px 18px',
                      fontSize: 28,
                      fontWeight: 600,
                    }}
                  >
                    <Icon name={b.i} size={30} color={COLORS.blue} />
                    {b.t}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </At>

      <div style={{ position: 'absolute', top: 1255, left: 80, right: 140, display: 'flex', justifyContent: 'center', gap: 22, ...arabic }}>
        {TEXT.adsChips.map((t, i) => (
          <div
            key={t}
            style={{
              opacity: Math.min(1, chips[i] * 1.5),
              transform: `scale(${mix(chips[i], 0.5, 1)})`,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: COLORS.blue,
              color: 'white',
              borderRadius: 40,
              padding: '14px 28px',
              fontSize: 34,
              fontWeight: 700,
              boxShadow: SHADOW,
            }}
          >
            <Icon name={CHIP_ICONS[i]} size={38} color="white" />
            {t}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
