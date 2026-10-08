import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { drift, ease, mix, move, pop } from '../anim';
import { COLORS, CUES, TEXT } from '../config';
import { cueIn } from '../timeline';
import { Icon } from '../components/Icon';
import { Phone, ProfileScreen } from '../components/Phone';
import { ProductShot, Storefront } from '../components/illustrations';
import { At, CENTER_X, Headline, SHADOW, arabic } from '../components/ui';

const PHONE_W = 420;
const PHONE_Y = 900;

const VideoTile: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ position: 'relative' }}>
    <Storefront width={w} variant={1} />
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        width: w * 0.22,
        height: w * 0.22,
        borderRadius: w,
        background: 'rgba(255,255,255,0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={w * 0.09} height={w * 0.09} viewBox="0 0 10 10">
        <path d="M2 1l7 4-7 4Z" fill={COLORS.blue} />
      </svg>
    </div>
  </div>
);

const PostTile: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 0.7, background: `linear-gradient(150deg, ${COLORS.cyan}, ${COLORS.blueDeep})`, padding: w * 0.08, boxSizing: 'border-box' }}>
    <div style={{ width: '70%', height: w * 0.06, background: 'rgba(255,255,255,0.95)', borderRadius: 8 }} />
    <div style={{ width: '45%', height: w * 0.06, background: 'rgba(255,255,255,0.6)', borderRadius: 8, marginTop: w * 0.04 }} />
    <div style={{ width: w * 0.3, height: w * 0.3, borderRadius: w, background: 'rgba(255,255,255,0.2)', marginTop: w * 0.06 }} />
  </div>
);

const tileContent = (i: number, w: number) => {
  switch (i) {
    case 0:
      return <Storefront width={w} variant={0} />;
    case 1:
      return <ProductShot width={w} kind="cup" />;
    case 2:
      return <VideoTile w={w} />;
    case 3:
      return <ProductShot width={w} kind="bag" />;
    case 4:
      return <PostTile w={w} />;
    default:
      return <ProductShot width={w} kind="box" />;
  }
};

// Scattered tiles around the phone, at different depths (inspired by the "download" reference).
const TILES = [
  { x: 210, y: 610, rot: -10, depth: 1.0, label: 0, icon: 'store' as const },
  { x: 820, y: 580, rot: 9, depth: 0.85, label: 1, icon: 'box' as const },
  { x: 190, y: 1010, rot: 8, depth: 0.9, label: 2, icon: 'video' as const },
  { x: 840, y: 980, rot: -8, depth: 1.0, label: 1, icon: 'box' as const },
  { x: 260, y: 1290, rot: -5, depth: 0.8, label: 3, icon: 'post' as const },
  { x: 780, y: 1300, rot: 6, depth: 0.85, label: 1, icon: 'box' as const },
];

export const Photos: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (src: number) => cueIn('photos', src);
  const intoPhone = move(frame, c(CUES.media) + 40, 36);
  const gallery = ease(frame, c(CUES.media) + 56, 30);
  const flash = ease(frame, c(CUES.shoot) - 3, 4) * (1 - ease(frame, c(CUES.shoot) + 2, 10));

  return (
    <AbsoluteFill>
      <Headline text={TEXT.photosTitle} start={c(CUES.firstImpression) - 4} y={200} size={60} />

      <At x={CENTER_X} y={PHONE_Y + drift(frame, 4, 4)}>
        <Phone width={PHONE_W}>
          <ProfileScreen
            width={PHONE_W * 0.936}
            actions={1}
            gallery={gallery}
            galleryNodes={[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ transform: 'scale(1.15)', transformOrigin: 'top center' }}>
                {tileContent(i, PHONE_W * 0.45)}
              </div>
            ))}
          />
        </Phone>
      </At>

      {/* camera flash on "نصوّر" */}
      <AbsoluteFill style={{ background: 'white', opacity: flash * 0.6 }} />

      {TILES.map((t, i) => {
        const startF = (i < 2 ? c(CUES.shoot) : c(CUES.media)) + (i % 2) * 6 + (i >= 2 ? (i - 2) * 5 : 0);
        const p = pop(frame, startF, 13);
        const x = mix(intoPhone, t.x, CENTER_X);
        const y = mix(intoPhone, t.y, PHONE_Y + 120);
        const s = mix(p, 0.5, t.depth) * mix(intoPhone, 1, 0.25);
        const w = 260;
        return (
          <At key={i} x={x + drift(frame, i + 9, 6)} y={y + drift(frame, i + 3, 8)}>
            <div
              style={{
                opacity: Math.min(1, p * 1.5) * (1 - ease(frame, c(CUES.media) + 62, 12)),
                transform: `rotate(${mix(intoPhone, t.rot, 0)}deg) scale(${s})`,
                filter: t.depth < 0.9 ? 'blur(0.6px)' : undefined,
              }}
            >
              <div style={{ width: w, borderRadius: 28, overflow: 'hidden', background: 'white', boxShadow: SHADOW, border: '6px solid white' }}>
                <div style={{ height: w * 0.7, overflow: 'hidden', borderRadius: 22 }}>{tileContent(i, w)}</div>
                <div
                  style={{
                    ...arabic,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    padding: '12px 0 8px',
                    color: COLORS.blueDeep,
                    fontWeight: 600,
                    fontSize: 30,
                  }}
                >
                  <Icon name={t.icon} size={32} color={COLORS.blue} />
                  {TEXT.photoTiles[t.label]}
                </div>
              </div>
            </div>
          </At>
        );
      })}
    </AbsoluteFill>
  );
};
