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

/** Phone number, held still from the call-to-action to the very last frame. */
export const NumberBar: React.FC = () => {
  const frame = useCurrentFrame();
  const p = ease(frame, 0, 14);
  return (
    <At x={CENTER_X} y={1250}>
      <div
        style={{
          opacity: p,
          transform: `translateY(${mix(p, 24, 0)}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          background: COLORS.white,
          border: `3px solid ${COLORS.blue}`,
          borderRadius: 60,
          padding: '14px 44px 14px 18px',
          boxShadow: SHADOW,
          direction: 'ltr',
        }}
      >
        <div style={{ width: 84, height: 84, borderRadius: 84, background: COLORS.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="phone" size={46} color="white" stroke={2.2} />
        </div>
        <PhoneNumber size={66} color={COLORS.ink} />
      </div>
    </At>
  );
};
