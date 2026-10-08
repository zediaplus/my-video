import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { drift, ease, mix, move, pop } from '../anim';
import { COLORS, CUES, TEXT } from '../config';
import { cueIn } from '../timeline';
import { Icon } from '../components/Icon';
import { Storefront } from '../components/illustrations';
import { At, CENTER_X, Card, MapPin, SHADOW, arabic } from '../components/ui';

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (src: number) => cueIn('cta', src);
  const shopIn = pop(frame, c(CUES.effort) - 6, 16);
  const pin = pop(frame, c(CUES.effort) + 22, 10);
  const ripple = ((frame - c(CUES.effort) - 30) % 50) / 50;
  const toCta = move(frame, c(CUES.sendLink) - 8, 26);
  const ctaIn = pop(frame, c(CUES.sendLink), 15);

  return (
    <AbsoluteFill>
      {/* the business, seen: storefront with a pin landing on it */}
      <At x={CENTER_X} y={mix(toCta, 760, 470)}>
        <div style={{ opacity: Math.min(1, shopIn * 1.4), transform: `scale(${mix(shopIn, 0.7, 1) * mix(toCta, 1, 0.62)})` }}>
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: 40, overflow: 'hidden', boxShadow: SHADOW, border: '10px solid white' }}>
              <Storefront width={720} variant={2} />
            </div>
            {frame > c(CUES.effort) + 30 && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 120,
                  width: 260,
                  height: 90,
                  marginLeft: -130,
                  borderRadius: '50%',
                  border: `5px solid ${COLORS.cyan}`,
                  opacity: (1 - ripple) * 0.8 * (1 - toCta),
                  transform: `scale(${mix(ripple, 0.4, 1.6)})`,
                }}
              />
            )}
            <div style={{ position: 'absolute', left: '50%', top: -40, transform: `translate(-50%, ${mix(pin, -300, 0)}px)`, opacity: Math.min(1, pin * 2) }}>
              <MapPin size={130} />
            </div>
          </div>
        </div>
      </At>

      <At x={CENTER_X} y={900 + drift(frame, 2, 4)}>
        <div style={{ opacity: Math.min(1, ctaIn * 1.4), transform: `translateY(${mix(ctaIn, 80, 0)}px)` }}>
          <Card style={{ ...arabic, width: 860, padding: '40px 40px', boxSizing: 'border-box', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                  background: COLORS.blue,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `rotate(${mix(ease(frame, c(CUES.sendLink) + 6, 20), -40, 0)}deg)`,
                }}
              >
                <Icon name="link" size={56} color="white" stroke={2.4} />
              </div>
            </div>
            <div style={{ fontSize: 54, fontWeight: 700, color: COLORS.ink, lineHeight: 1.45, marginTop: 20 }}>{TEXT.ctaTitle}</div>
          </Card>
        </div>
      </At>
    </AbsoluteFill>
  );
};
