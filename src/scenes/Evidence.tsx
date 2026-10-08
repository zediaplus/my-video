import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { ease, mix, pop } from '../anim';
import { COLORS, CUES, EVIDENCE, FONT_FAMILY, TEXT } from '../config';
import { cueIn } from '../timeline';
import { Icon } from '../components/Icon';
import { At, CENTER_X, Card, Headline, arabic } from '../components/ui';

// Real screenshots from the Google Maps contributions account. Only crops that carry no
// personal name are used; numbers are shown exactly as they appear in the account.

const Ltr: React.FC<{ children: React.ReactNode; size: number; color?: string }> = ({ children, size, color = COLORS.ink }) => (
  <span dir="ltr" style={{ unicodeBidi: 'isolate', fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: size, color, fontVariantNumeric: 'tabular-nums' }}>
    {children}
  </span>
);

const count = (frame: number, start: number, target: number) =>
  Math.round(
    interpolate(frame, [start, start + 45], [0, target], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3),
    }),
  ).toLocaleString('en-US');

export const Evidence: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (src: number) => cueIn('evidence', src);
  const shots = pop(frame, c(CUES.contributions) + 4, 16);
  const panel = pop(frame, c(CUES.contributions) + 26, 16);
  const views = ease(frame, c(CUES.views) - 4, 18);
  const ring = ease(frame, c(CUES.views) + 10, 16);
  const viewsTarget = Number(EVIDENCE.photosTab.views.replace(/,/g, ''));
  const photosTarget = Number(EVIDENCE.photosTab.photos);
  const SHOT_SCALE = 1.78;
  const PANEL_SCALE = 1.62;

  return (
    <AbsoluteFill>
      <Headline text={TEXT.evidenceTitle} start={c(CUES.contributions) - 4} y={200} size={54} />

      {/* counters, revealed on "بمشاهداتها الفعلية" */}
      <At x={CENTER_X} y={mix(views, 560, 520)}>
        <div style={{ opacity: views, transform: `scale(${mix(views, 0.85, 1)})` }}>
          <Card style={{ ...arabic, width: 860, padding: '30px 30px', boxSizing: 'border-box', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1.5, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <Icon name="eye" size={54} color={COLORS.blue} />
                <Ltr size={68} color={COLORS.blueDeep}>{count(frame, c(CUES.views), viewsTarget)}</Ltr>
              </div>
              <div style={{ fontSize: 32, color: COLORS.inkSoft, fontWeight: 600 }}>مشاهدة للصور</div>
            </div>
            <div style={{ width: 2, alignSelf: 'stretch', background: COLORS.line }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <Icon name="camera" size={50} color={COLORS.blue} />
                <Ltr size={68} color={COLORS.blueDeep}>{count(frame, c(CUES.views), photosTarget)}</Ltr>
              </div>
              <div style={{ fontSize: 32, color: COLORS.inkSoft, fontWeight: 600 }}>صورة</div>
            </div>
          </Card>
        </div>
      </At>

      {/* screenshot: photos tab (views + photo count) */}
      <At x={CENTER_X} y={mix(views, 820, 830)}>
        <div style={{ opacity: Math.min(1, shots * 1.4), transform: `translateY(${mix(shots, 120, 0)}px)` }}>
          <Card style={{ padding: 22, borderRadius: 30, position: 'relative' }}>
            <Img src={staticFile(EVIDENCE.screenshots.photosTab)} style={{ width: 452 * SHOT_SCALE, display: 'block', borderRadius: 12 }} />
            {/* highlight around the real figures (left part of the screenshot) */}
            <div
              style={{
                position: 'absolute',
                left: 22 + 238 * SHOT_SCALE,
                top: 22 + 58 * SHOT_SCALE,
                width: 128 * SHOT_SCALE,
                height: 32 * SHOT_SCALE,
                borderRadius: 18,
                border: `4px solid ${COLORS.gYellow}`,
                opacity: ring,
                transform: `scale(${mix(ring, 1.3, 1)})`,
              }}
            />
          </Card>
        </div>
      </At>

      {/* screenshot: contributor level (top of the contributions panel only) */}
      <At x={CENTER_X} y={1120}>
        <div style={{ opacity: Math.min(1, panel * 1.4), transform: `translateY(${mix(panel, 120, 0)}px)` }}>
          <Card style={{ padding: 22, borderRadius: 30 }}>
            <div style={{ width: 501 * PANEL_SCALE, height: 128 * PANEL_SCALE, overflow: 'hidden', borderRadius: 12 }}>
              <Img src={staticFile(EVIDENCE.screenshots.panel)} style={{ width: 501 * PANEL_SCALE, display: 'block' }} />
            </div>
          </Card>
        </div>
      </At>

      <div
        style={{
          ...arabic,
          position: 'absolute',
          top: 1290,
          left: 80,
          right: 140,
          textAlign: 'center',
          fontSize: 28,
          color: COLORS.inkSoft,
          opacity: panel,
        }}
      >
        لقطات من حساب المساهمات على خرائط Google
      </div>
    </AbsoluteFill>
  );
};
