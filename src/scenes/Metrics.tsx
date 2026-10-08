import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { drift, ease, mix, pop } from '../anim';
import { COLORS, CUES, TEXT } from '../config';
import { cueIn } from '../timeline';
import { IconName } from '../components/Icon';
import { At, CENTER_X, Card, Headline, IconBadge, arabic } from '../components/ui';

// Metric tiles WITHOUT invented numbers or growth charts — only what is tracked.
const TILES: { icon: IconName; color: string; bg: string }[] = [
  { icon: 'eye', color: COLORS.gBlue, bg: '#E8F0FE' },
  { icon: 'phone', color: COLORS.gGreen, bg: '#E6F4EA' },
  { icon: 'directions', color: COLORS.gRed, bg: '#FCE8E6' },
];

export const Metrics: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (src: number) => cueIn('metrics', src);
  const cues = [CUES.kpiVisibility, CUES.kpiCalls, CUES.kpiDirections].map(c);
  const data = pop(frame, c(CUES.data) - 2, 16);
  const shift = ease(frame, c(CUES.data) - 6, 24);
  const dashIn = ease(frame, c(CUES.kpis) - 4, 24);

  return (
    <AbsoluteFill>
      <Headline text={TEXT.metricsTitle} start={c(CUES.kpis) - 2} y={220} size={58} />

      <At x={CENTER_X} y={mix(shift, 780, 660)}>
        <div style={{ opacity: dashIn, transform: `translateY(${mix(dashIn, 40, 0)}px)` }}>
          <Card glass style={{ width: 860, padding: '40px 30px', boxSizing: 'border-box', display: 'flex', gap: 22, ...arabic }}>
            {TILES.map((t, i) => {
              const p = pop(frame, cues[i] - 4, 12);
              const live = 0.5 + 0.5 * Math.sin((frame - cues[i]) / 9);
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: 'white',
                    borderRadius: 28,
                    padding: '34px 10px 28px',
                    textAlign: 'center',
                    border: `2px solid ${p > 0.5 ? t.color : COLORS.line}`,
                    transform: `scale(${mix(Math.min(p, 1), 0.85, 1)}) translateY(${drift(frame, i, 4)}px)`,
                    opacity: mix(Math.min(1, p), 0.35, 1),
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <IconBadge name={t.icon} color={t.color} bg={t.bg} size={110} />
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 700, color: COLORS.ink, marginTop: 22 }}>{TEXT.metrics[i]}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 14, fontSize: 26, color: COLORS.inkSoft }}>
                    <div style={{ width: 14, height: 14, borderRadius: 14, background: t.color, opacity: p > 0.5 ? 0.4 + live * 0.6 : 0.2 }} />
                    متابعة
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </At>

      <At x={CENTER_X} y={1120}>
        <div style={{ opacity: Math.min(1, data * 1.5), transform: `scale(${mix(data, 0.7, 1)})` }}>
          <Card style={{ ...arabic, display: 'flex', alignItems: 'center', gap: 26, padding: '30px 44px', borderRadius: 40 }}>
            <IconBadge name="target" size={96} />
            <div style={{ fontSize: 44, fontWeight: 700, color: COLORS.blueDeep }}>تطوير مبنيّ على البيانات</div>
          </Card>
        </div>
      </At>
    </AbsoluteFill>
  );
};

