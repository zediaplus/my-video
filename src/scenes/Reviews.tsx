import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { drift, ease, mix, pop } from '../anim';
import { COLORS, CUES, TEXT } from '../config';
import { cueIn } from '../timeline';
import { Icon } from '../components/Icon';
import { At, CENTER_X, Card, Headline, arabic } from '../components/ui';

// Illustrative review + reply, clearly labelled as a sample (no real customer data).
export const Reviews: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (src: number) => cueIn('reviews', src);
  const cardIn = pop(frame, c(CUES.reviewsAsk) - 2, 14);
  const replyIn = pop(frame, c(CUES.reply) - 2, 14);
  const lift = ease(frame, c(CUES.reply) - 6, 24);

  return (
    <AbsoluteFill>
      <Headline text={TEXT.reviewsTitle} start={6} y={220} size={56} />
      <At x={CENTER_X} y={mix(lift, 760, 640) + drift(frame, 1, 4)}>
        <div style={{ opacity: Math.min(1, cardIn * 1.4), transform: `scale(${mix(cardIn, 0.7, 1)})` }}>
          <Card style={{ ...arabic, width: 840, padding: '40px 46px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 96,
                  background: '#E3F0FC',
                  color: COLORS.blue,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 46,
                  fontWeight: 700,
                }}
              >
                ع
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 38, fontWeight: 700, color: COLORS.ink }}>عميل</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6, direction: 'ltr', justifyContent: 'flex-end' }}>
                  {[0, 1, 2, 3, 4].map((i) => {
                    const s = pop(frame, c(CUES.reviewsAsk) + 12 + i * 5, 10);
                    return (
                      <div key={i} style={{ transform: `scale(${s})` }}>
                        <Icon name="star" size={44} color={COLORS.gYellow} fill={COLORS.gYellow} />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 26,
                  fontWeight: 600,
                  color: COLORS.inkSoft,
                  background: '#EEF3FA',
                  borderRadius: 30,
                  padding: '8px 20px',
                }}
              >
                نموذج توضيحي
              </div>
            </div>
            <div style={{ fontSize: 40, lineHeight: 1.6, color: COLORS.ink, marginTop: 26 }}>
              تجربة رائعة وخدمة مرتّبة، أنصح بها.
            </div>
          </Card>
        </div>
      </At>

      <At x={CENTER_X + 30} y={1100 + drift(frame, 3, 4)}>
        <div style={{ opacity: Math.min(1, replyIn * 1.4), transform: `translateY(${mix(replyIn, 80, 0)}px)` }}>
          <Card style={{ ...arabic, width: 780, padding: '32px 40px', boxSizing: 'border-box', borderRight: `10px solid ${COLORS.blue}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: COLORS.blue, fontWeight: 700, fontSize: 32 }}>
              <Icon name="chat" size={40} color={COLORS.blue} />
              رد صاحب النشاط
            </div>
            <div style={{ fontSize: 38, lineHeight: 1.6, color: COLORS.ink, marginTop: 14 }}>
              شكرًا لثقتك! يسعدنا رأيك، ونتطلّع لخدمتك دائمًا.
            </div>
          </Card>
        </div>
      </At>
    </AbsoluteFill>
  );
};
