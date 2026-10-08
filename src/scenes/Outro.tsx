import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ease, mix, pop } from '../anim';
import { BRAND, COLORS, CUES } from '../config';
import { cueIn } from '../timeline';
import { Icon } from '../components/Icon';
import { AccentDots, At, CENTER_X, Logo, MapPin, SHADOW, PhoneNumber, arabic } from '../components/ui';

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (src: number) => cueIn('outro', src);
  const pin = pop(frame, 2, 11);
  const logo = pop(frame, c(CUES.finalBrand) - 4, 14);
  const name = ease(frame, c(CUES.finalBrand) + 8, 18);
  const tag = ease(frame, c(CUES.finalBrand) + 26, 20);

  return (
    <AbsoluteFill>
      <At x={CENTER_X} y={380}>
        <div style={{ transform: `translateY(${mix(pin, -260, 0)}px)`, opacity: Math.min(1, pin * 2) }}>
          <MapPin size={120} />
        </div>
      </At>
      <At x={CENTER_X} y={640}>
        <div style={{ opacity: Math.min(1, logo * 1.4), transform: `scale(${mix(logo, 0.6, 1)})` }}>
          <Logo width={460} />
        </div>
      </At>
      <At x={CENTER_X} y={880}>
        <div style={{ ...arabic, fontSize: 96, fontWeight: 700, color: COLORS.blueDeep, opacity: name, transform: `translateY(${mix(name, 20, 0)}px)` }}>
          {BRAND.name}
        </div>
      </At>
      <At x={CENTER_X} y={1000}>
        <div style={{ opacity: tag, transform: `translateY(${mix(tag, 20, 0)}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ ...arabic, fontSize: 54, fontWeight: 600, color: COLORS.ink }}>{BRAND.tagline}</div>
          <AccentDots />
        </div>
      </At>
    </AbsoluteFill>
  );
};

/** Final call button: green, held still from the call-to-action to the very last frame. */
export const NumberBar: React.FC<{ y?: number }> = ({ y = 1250 }) => {
  const frame = useCurrentFrame();
  const p = pop(frame, 0, 14);
  const pulse = (frame % 45) / 45;
  return (
    <At x={CENTER_X} y={y}>
      <div style={{ position: 'relative', opacity: Math.min(1, p * 1.5), transform: `scale(${mix(p, 0.7, 1)})` }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 70,
            border: `4px solid ${COLORS.call}`,
            opacity: (1 - pulse) * 0.6,
            transform: `scale(${mix(pulse, 1, 1.18)})`,
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            background: `linear-gradient(180deg, #27B85A, ${COLORS.call})`,
            borderRadius: 70,
            padding: '16px 48px 16px 18px',
            boxShadow: '0 24px 44px -18px rgba(30,158,74,0.65)',
            direction: 'ltr',
          }}
        >
          <div style={{ width: 92, height: 92, borderRadius: 92, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="phone" size={50} color={COLORS.call} stroke={2.4} />
          </div>
          <PhoneNumber size={70} color="white" />
        </div>
      </div>
    </At>
  );
};

/** Logo + call strip pinned at the bottom from the middle of the video. */
export const BrandBar: React.FC<{ fadeOutAt: number; y?: number }> = ({ fadeOutAt, y = 1615 }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, 0, 20) * (1 - ease(frame, fadeOutAt, 12));
  return (
    <At x={CENTER_X} y={y}>
      <div
        style={{
          opacity: p,
          transform: `translateY(${mix(p, 40, 0)}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 26,
          background: 'rgba(255,255,255,0.94)',
          border: `1.5px solid ${COLORS.line}`,
          borderRadius: 60,
          padding: '10px 14px 10px 34px',
          boxShadow: SHADOW,
          direction: 'ltr',
        }}
      >
        <Logo width={190} />
        <div style={{ width: 2, height: 64, background: COLORS.line }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: COLORS.call, borderRadius: 50, padding: '10px 26px 10px 12px' }}>
          <div style={{ width: 58, height: 58, borderRadius: 58, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="phone" size={32} color={COLORS.call} stroke={2.4} />
          </div>
          <PhoneNumber size={46} color="white" />
        </div>
      </div>
    </At>
  );
};
