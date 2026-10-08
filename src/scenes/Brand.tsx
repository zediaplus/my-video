import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { drift, ease, mix, pop } from '../anim';
import { COLORS, CUES, TEXT } from '../config';
import { cueIn } from '../timeline';
import { Icon, IconName } from '../components/Icon';
import { Phone, ProfileScreen } from '../components/Phone';
import { At, CENTER_X, Card, Headline, Logo, arabic } from '../components/ui';

const PHONE_W = 380;
const PHONE_Y = 860;

const FLOATERS: { icon: IconName; label: string; x: number; y: number; color: string }[] = [
  { icon: 'phone', label: 'اتصال', x: 200, y: 660, color: COLORS.gGreen },
  { icon: 'directions', label: 'الاتجاهات', x: 200, y: 1060, color: COLORS.gBlue },
  { icon: 'image', label: 'الصور', x: 820, y: 640, color: COLORS.gRed },
  { icon: 'star', label: 'التقييمات', x: 820, y: 1040, color: COLORS.gYellow },
];

export const Podium: React.FC<{ width?: number; glow?: number }> = ({ width = 640, glow = 1 }) => (
  <div style={{ position: 'relative', width, height: width * 0.22 }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(220,234,250,0.9))',
        border: '2px solid rgba(255,255,255,0.9)',
        boxShadow: `0 30px 50px -20px rgba(14,46,96,0.35), 0 0 0 6px rgba(66,133,244,${0.12 * glow})`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: '8%',
        right: '8%',
        bottom: -6,
        height: 10,
        borderRadius: 10,
        opacity: glow,
        background: `linear-gradient(90deg, ${COLORS.gBlue}, ${COLORS.gRed}, ${COLORS.gYellow}, ${COLORS.gGreen})`,
        filter: 'blur(6px)',
      }}
    />
  </div>
);

export const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (src: number) => cueIn('brand', src);
  const logoIn = pop(frame, c(CUES.zedia) - 4, 14);
  const phoneIn = ease(frame, 2, 30);
  const actions = ease(frame, c(CUES.zedia) + 30, 40);

  return (
    <AbsoluteFill>
      <At x={CENTER_X} y={250}>
        <div style={{ opacity: Math.min(1, logoIn * 1.4), transform: `scale(${mix(logoIn, 0.6, 1)})` }}>
          <Logo width={270} />
        </div>
      </At>
      <Headline text={TEXT.brandTitle} start={c(CUES.zedia) + 18} y={400} size={46} color={COLORS.blueDeep} />

      <At x={CENTER_X} y={PHONE_Y + 420}>
        <div style={{ opacity: phoneIn }}>
          <Podium width={620} glow={phoneIn} />
        </div>
      </At>
      <At x={CENTER_X} y={PHONE_Y + mix(phoneIn, 360, 0) + drift(frame, 1, 5)}>
        <div style={{ opacity: phoneIn }}>
          <Phone width={PHONE_W}>
            <ProfileScreen width={PHONE_W * 0.936} header={1} actions={actions} />
          </Phone>
        </div>
      </At>

      {FLOATERS.map((f, i) => {
        const p = pop(frame, c(CUES.easier) + i * 7, 12);
        return (
          <At key={f.label} x={f.x} y={f.y + drift(frame, i + 2, 8)}>
            <div style={{ opacity: Math.min(1, p * 1.5), transform: `scale(${mix(p, 0.5, 1)})` }}>
              <Card glass style={{ ...arabic, width: 220, padding: '24px 0', textAlign: 'center', borderRadius: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Icon name={f.icon} size={66} color={f.color} stroke={2.2} />
                </div>
                <div style={{ fontSize: 34, fontWeight: 600, color: COLORS.ink, marginTop: 10 }}>{f.label}</div>
              </Card>
            </div>
          </At>
        );
      })}
    </AbsoluteFill>
  );
};
