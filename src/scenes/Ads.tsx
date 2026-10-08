import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { drift, ease, mix, move, pop } from '../anim';
import { COLORS, CUES, TEXT } from '../config';
import { cueIn } from '../timeline';
import { Icon, IconName } from '../components/Icon';
import { MapArt, Storefront } from '../components/illustrations';
import { At, CENTER_X, Card, Headline, MapPin, SHADOW, arabic } from '../components/ui';

// Wide multicolour light ribbons converging on the map (flow/depth idea from the "download (1)" reference).
const FOCUS = { x: 510, y: 800 };
const BAND_COLORS = [COLORS.gRed, '#F57C2B', COLORS.gYellow, COLORS.gGreen, COLORS.gBlue];
const ribbon = (side: 'left' | 'right', o: number) =>
  side === 'left'
    ? `M-360 ${1880 + o * 1.3} C 120 ${1640 + o * 1.1}, 260 ${1080 + o * 0.6}, ${FOCUS.x} ${FOCUS.y + o * 0.15}`
    : `M1460 ${1560 + o * 1.3} C 1020 ${1470 + o * 1.0}, 780 ${1040 + o * 0.5}, ${FOCUS.x} ${FOCUS.y + o * 0.15}`;
const BAND_W = 64;

const CHIP_ICONS: IconName[] = ['target', 'pin', 'wallet'];

export const Ads: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (src: number) => cueIn('ads', src);
  const trailsOut = ease(frame, c(CUES.campaigns) + 20, 40);
  const focus = ease(frame, c(CUES.moreClients) + 40, 30);
  const mapIn = move(frame, c(CUES.campaigns) - 12, 44);
  const adCard = pop(frame, c(CUES.campaigns) + 40, 14);
  const pins = [0, 1, 2].map((i) => pop(frame, c(CUES.campaigns) + 18 + i * 6, 11));
  const chips = [0, 1, 2].map((i) => pop(frame, c(CUES.budget) + i * 8, 13));

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: mix(trailsOut, 1, 0.55) }}>
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
            const o = (ci - (BAND_COLORS.length - 1) / 2) * (BAND_W - 4);
            const d = ribbon(side, side === 'left' ? o : -o);
            const draw = ease(frame, c(CUES.moreClients) - 6 + si * 10 + ci * 2, 50);
            return (
              <g key={`${side}-${ci}`}>
                <path d={d} stroke={color} strokeWidth={BAND_W * 1.6} fill="none" opacity={0.28} filter="url(#ribbonGlow)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
                <path d={d} stroke={color} strokeWidth={BAND_W} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} opacity={0.92} />
                {/* light travelling along the ribbon */}
                <path
                  d={d}
                  stroke="#FFFFFF"
                  strokeWidth={BAND_W * 0.8}
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
        <circle cx={FOCUS.x} cy={FOCUS.y} r={mix(focus, 0, 260)} fill="url(#focusGlow)" opacity={focus * (1 - mapIn * 0.7)} />
      </svg>

      <Headline text={TEXT.adsTitle} start={c(CUES.campaigns) + 6} y={220} size={56} />

      <At x={CENTER_X} y={FOCUS.y}>
        <div
          style={{
            width: 820,
            height: 620,
            borderRadius: 44,
            overflow: 'hidden',
            boxShadow: SHADOW,
            border: '8px solid white',
            position: 'relative',
            opacity: Math.min(1, mapIn * 1.6),
            transform: `scale(${mix(mapIn, 0.12, 1)}) rotate(${mix(mapIn, -6, 0)}deg)`,
            filter: mapIn < 1 ? `blur(${(1 - mapIn) * 18}px)` : undefined,
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
