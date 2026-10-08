import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { drift, ease, mix, move, pop } from '../anim';
import { AUDIO, COLORS, CUES, EVIDENCE, FONT_FAMILY, TEXT } from '../config';
import { loadFonts } from '../fonts';
import { buildTimeline, sec } from '../timeline';
import { Background } from '../components/Background';
import { Captions } from '../components/Captions';
import { ColorRibbons } from '../components/ColorRibbons';
import { Icon, IconName } from '../components/Icon';
import { MapArt, Storefront } from '../components/illustrations';
import { Phone, ProfileScreen } from '../components/Phone';
import { At, CENTER_X, Card, Headline, Logo, MapPin, SHADOW, SceneShell, arabic } from '../components/ui';
import { SearchBar } from '../scenes/Hook';
import { BrandBar, NumberBar } from '../scenes/Outro';

loadFonts();

// Short, fast story cut (≈38 s) of the same recording: whole sentences only, original speed.
export const STORY = { id: 'ZediaMapsStory', totalSeconds: 38 };

type StoryId = 'hook' | 'brand' | 'services' | 'ads' | 'proof' | 'cta' | 'outro';
const SECTIONS: { id: StoryId; srcStart: number; srcEnd: number; gapBefore: number }[] = [
  { id: 'hook', srcStart: 0, srcEnd: 4.99, gapBefore: 0.3 }, // نشاطك مميز… هل يجدك عملاؤك على خرائط جوجل؟
  { id: 'brand', srcStart: 13.02, srcEnd: 20.86, gapBefore: 0.25 }, // في زيديا… أسهل!
  { id: 'services', srcStart: 44.93, srcEnd: 49.3, gapBefore: 0.2 }, // ونجهز صورًا وفيديوهات…
  { id: 'ads', srcStart: 58.81, srcEnd: 63.72, gapBefore: 0.2 }, // نعد وندير حملات جوجل…
  { id: 'proof', srcStart: 75.45, srcEnd: 79.58, gapBefore: 0.25 }, // وهذه نماذج من صورنا ومساهماتنا…
  { id: 'cta', srcStart: 86.2, srcEnd: 90.34, gapBefore: 0.25 }, // أرسل لنا رابط نشاطك…
  { id: 'outro', srcStart: 90.34, srcEnd: 93.73, gapBefore: 0.15 }, // زيديا… حضور أوضح، ووصول أسهل!
];

export const T = buildTimeline<StoryId>(SECTIONS, STORY.totalSeconds);
const OVERLAP = 10;

// Story-safe layout: platform UI covers ~250px top and ~340px bottom.
const BAR_Y = 1505;
const CAPTION_BOTTOM = 480;

const SERVICES: { icon: IconName; text: string }[] = [
  { icon: 'edit', text: 'إنشاء ملف نشاطك أو تحسينه' },
  { icon: 'shield', text: 'المساعدة في إثبات الملكية' },
  { icon: 'pin', text: 'ضبط الموقع واختيار التصنيف' },
  { icon: 'camera', text: 'تصوير المكان والمنتجات' },
  { icon: 'star', text: 'طلب التقييمات والرد عليها' },
  { icon: 'target', text: 'حملات Google الإعلانية' },
];

// ---------------------------------------------------------------- scenes
const SHook: React.FC = () => {
  const frame = useCurrentFrame();
  const q = T.cueIn('hook', CUES.question);
  const typed = Math.min(3, Math.floor(Math.max(0, frame - 4) / 6) + (frame >= 4 ? 1 : 0));
  const up = move(frame, q - 8, 16);
  const shop = pop(frame, 10, 12);
  const shopOut = ease(frame, q - 8, 12);
  const l1 = pop(frame, q - 2, 12);
  const l2 = pop(frame, q + 6, 12);
  const map = pop(frame, q + 16, 13);
  const pin = pop(frame, q + 30, 10);
  return (
    <AbsoluteFill>
      <At x={CENTER_X} y={mix(up, 560, 330)}>
        <div style={{ transform: `scale(${mix(up, 1, 0.82)})` }}>
          <SearchBar text={TEXT.searchQuery} chars={typed} cursor={Math.floor(frame / 12) % 2 === 0} />
        </div>
      </At>
      <At x={CENTER_X} y={950}>
        <div style={{ opacity: Math.min(1, shop * 1.5) * (1 - shopOut), transform: `scale(${mix(shop, 0.6, 1) * mix(shopOut, 1, 0.8)})` }}>
          <div style={{ borderRadius: 40, overflow: 'hidden', border: '10px solid white', boxShadow: SHADOW }}>
            <Storefront width={680} variant={0} />
          </div>
        </div>
      </At>
      <div style={{ ...arabic, position: 'absolute', top: 470, left: 60, right: 60, textAlign: 'center', fontWeight: 700, fontSize: 92, lineHeight: 1.3, color: COLORS.ink }}>
        <div style={{ opacity: Math.min(1, l1 * 1.5), transform: `translateX(${mix(l1, -200, 0)}px)` }}>هل يجدك عملاؤك</div>
        <div style={{ opacity: Math.min(1, l2 * 1.5), transform: `translateX(${mix(l2, 200, 0)}px)` }}>
          على <span style={{ color: COLORS.blue }}>خرائط Google</span>؟
        </div>
      </div>
      <At x={CENTER_X} y={1040}>
        <div style={{ opacity: Math.min(1, map * 1.5), transform: `scale(${mix(map, 0.5, 1)}) rotate(${mix(map, -4, 0)}deg)` }}>
          <div style={{ width: 760, height: 380, borderRadius: 40, overflow: 'hidden', border: '8px solid white', boxShadow: SHADOW, position: 'relative' }}>
            <div style={{ position: 'absolute', left: -80, top: -260 }}>
              <MapArt width={920} height={920} />
            </div>
            <div style={{ position: 'absolute', left: '50%', top: 40, transform: `translate(-50%, ${mix(pin, -260, 0)}px)` }}>
              <MapPin size={110} />
            </div>
          </div>
        </div>
      </At>
    </AbsoluteFill>
  );
};

const FLOATERS: { icon: IconName; label: string; x: number; y: number; color: string }[] = [
  { icon: 'phone', label: 'اتصال', x: 210, y: 820, color: COLORS.gGreen },
  { icon: 'directions', label: 'الاتجاهات', x: 210, y: 1140, color: COLORS.gBlue },
  { icon: 'image', label: 'الصور', x: 810, y: 800, color: COLORS.gRed },
  { icon: 'star', label: 'التقييمات', x: 810, y: 1120, color: COLORS.gYellow },
];

const SBrand: React.FC = () => {
  const frame = useCurrentFrame();
  const z = T.cueIn('brand', CUES.zedia);
  const e = T.cueIn('brand', CUES.easier);
  const logo = pop(frame, z - 6, 11);
  const ring = ease(frame, z, 30);
  const toTop = move(frame, e - 14, 18);
  const phone = pop(frame, e - 8, 14);
  return (
    <AbsoluteFill>
      <At x={CENTER_X} y={mix(toTop, 640, 370)}>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 520,
              height: 520,
              marginLeft: -260,
              marginTop: -260,
              borderRadius: 520,
              border: `10px solid ${COLORS.cyan}`,
              opacity: (1 - ring) * 0.6,
              transform: `scale(${mix(ring, 0.4, 1.5)})`,
            }}
          />
          <div style={{ opacity: Math.min(1, logo * 1.5), transform: `scale(${mix(logo, 0.4, 1) * mix(toTop, 1, 0.62)})` }}>
            <Logo width={480} />
          </div>
        </div>
      </At>
      <div style={{ opacity: 1 - toTop }}>
        <Headline text={TEXT.brandTitle} start={z + 12} y={900} size={58} color={COLORS.blueDeep} />
      </div>
      <At x={CENTER_X} y={mix(phone, 1300, 960) + drift(frame, 2, 5)}>
        <div style={{ opacity: Math.min(1, phone * 2) }}>
          <Phone width={300}>
            <ProfileScreen width={300 * 0.936} actions={ease(frame, e + 6, 20)} />
          </Phone>
        </div>
      </At>
      {FLOATERS.map((f, i) => {
        const p = pop(frame, e + 4 + i * 4, 11);
        return (
          <At key={f.label} x={f.x} y={f.y + drift(frame, i, 8)}>
            <div style={{ opacity: Math.min(1, p * 1.5), transform: `scale(${mix(p, 0.4, 1)})` }}>
              <Card glass style={{ ...arabic, width: 210, padding: '22px 0', textAlign: 'center', borderRadius: 30 }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Icon name={f.icon} size={62} color={f.color} stroke={2.2} />
                </div>
                <div style={{ fontSize: 32, fontWeight: 600, color: COLORS.ink, marginTop: 8 }}>{f.label}</div>
              </Card>
            </div>
          </At>
        );
      })}
    </AbsoluteFill>
  );
};

const SServices: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Headline text="كل ما يحتاجه نشاطك على الخريطة" start={0} y={300} size={56} />
      <div style={{ ...arabic, position: 'absolute', top: 470, left: 90, right: 130, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {SERVICES.map((s, i) => {
          const p = pop(frame, 6 + i * 13, 12);
          const dir = i % 2 ? -1 : 1;
          return (
            <div
              key={s.text}
              style={{
                opacity: Math.min(1, p * 1.6),
                transform: `translateX(${mix(p, 380 * dir, 0)}px) scale(${mix(p, 0.9, 1)})`,
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                background: 'white',
                border: `1.5px solid ${COLORS.line}`,
                borderRadius: 30,
                padding: '16px 22px',
                boxShadow: '0 18px 36px -22px rgba(14,46,96,0.4)',
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 22,
                  background: `linear-gradient(160deg, ${COLORS.cyan}, ${COLORS.blue})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon name={s.icon} size={42} color="white" stroke={2.1} />
              </div>
              <div style={{ fontSize: 40, fontWeight: 600, color: COLORS.ink }}>{s.text}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const FOCUS = { x: 510, y: 790 };
const SAds: React.FC = () => {
  const frame = useCurrentFrame();
  const focus = ease(frame, 18, 20);
  const mapIn = move(frame, 30, 30);
  const adCard = pop(frame, 62, 13);
  const pins = [0, 1, 2].map((i) => pop(frame, 50 + i * 5, 11));
  return (
    <AbsoluteFill>
      <ColorRibbons start={0} drawFrames={32} focus={focus} focusFade={mapIn * 0.7} opacity={mix(ease(frame, 70, 30), 1, 0.6)} focusPoint={FOCUS} />
      <Headline text={TEXT.adsTitle} start={8} y={300} size={58} />
      <At x={CENTER_X} y={FOCUS.y}>
        <div
          style={{
            width: 820,
            height: 520,
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
          <div style={{ position: 'absolute', left: -50, top: -200 }}>
            <MapArt width={920} height={920} />
          </div>
          {[
            { x: 230, y: 150 },
            { x: 610, y: 190 },
            { x: 400, y: 290 },
          ].map((p, i) => (
            <div key={i} style={{ position: 'absolute', left: p.x - 40, top: p.y - 100, transform: `translateY(${mix(pins[i], -80, 0)}px)`, opacity: Math.min(1, pins[i] * 2) }}>
              <MapPin size={i === 2 ? 90 : 62} color={i === 2 ? COLORS.blue : '#7FA8D6'} />
            </div>
          ))}
        </div>
      </At>
      <At x={CENTER_X} y={1090}>
        <div style={{ opacity: Math.min(1, adCard * 1.5), transform: `translateY(${mix(adCard, 90, 0)}px)` }}>
          <Card style={{ ...arabic, width: 740, padding: 22, boxSizing: 'border-box', display: 'flex', gap: 22, alignItems: 'center' }}>
            <div style={{ width: 140, height: 100, borderRadius: 18, overflow: 'hidden', flexShrink: 0 }}>
              <Storefront width={150} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: COLORS.ink, border: `2px solid ${COLORS.ink}`, borderRadius: 8, padding: '0 10px' }}>إعلان</span>
              <span style={{ fontSize: 38, fontWeight: 700, color: COLORS.ink }}>نشاطك التجاري</span>
            </div>
          </Card>
        </div>
      </At>
    </AbsoluteFill>
  );
};

const count = (frame: number, start: number, target: number) =>
  Math.round(
    interpolate(frame, [start, start + 40], [0, target], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) }),
  ).toLocaleString('en-US');

const SProof: React.FC = () => {
  const frame = useCurrentFrame();
  const card = pop(frame, 6, 13);
  const shot = pop(frame, 24, 13);
  const panel = pop(frame, 38, 13);
  const S = 1.78;
  return (
    <AbsoluteFill>
      <Headline text={TEXT.evidenceTitle} start={0} y={290} size={56} />
      <At x={CENTER_X} y={600}>
        <div style={{ opacity: Math.min(1, card * 1.5), transform: `scale(${mix(card, 0.7, 1)})` }}>
          <Card style={{ ...arabic, width: 860, padding: '28px 20px', boxSizing: 'border-box', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <Icon name="eye" size={70} color={COLORS.blue} />
              <span dir="ltr" style={{ unicodeBidi: 'isolate', fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 104, color: COLORS.blueDeep }}>
                {count(frame, 8, Number(EVIDENCE.photosTab.views.replace(/,/g, '')))}
              </span>
            </div>
            <div style={{ fontSize: 38, fontWeight: 600, color: COLORS.inkSoft }}>مشاهدة لصورنا على خرائط Google</div>
          </Card>
        </div>
      </At>
      <At x={CENTER_X} y={860}>
        <div style={{ opacity: Math.min(1, shot * 1.5), transform: `translateY(${mix(shot, 100, 0)}px)` }}>
          <Card style={{ padding: 20, borderRadius: 28 }}>
            <Img src={staticFile(EVIDENCE.screenshots.photosTab)} style={{ width: 452 * S, display: 'block', borderRadius: 12 }} />
          </Card>
        </div>
      </At>
      <At x={CENTER_X} y={1075}>
        <div style={{ opacity: Math.min(1, panel * 1.5), transform: `translateY(${mix(panel, 100, 0)}px)` }}>
          <Card style={{ padding: 20, borderRadius: 28 }}>
            <div style={{ width: 501 * 1.6, height: 128 * 1.6, overflow: 'hidden', borderRadius: 12 }}>
              <Img src={staticFile(EVIDENCE.screenshots.panel)} style={{ width: 501 * 1.6, display: 'block' }} />
            </div>
          </Card>
        </div>
      </At>
    </AbsoluteFill>
  );
};

const SCta: React.FC = () => {
  const frame = useCurrentFrame();
  const icon = pop(frame, 4, 11);
  const t1 = pop(frame, 8, 13);
  const t2 = pop(frame, 16, 13);
  return (
    <AbsoluteFill style={{ ...arabic }}>
      <At x={CENTER_X} y={480}>
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 150,
            background: COLORS.blue,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: SHADOW,
            transform: `scale(${icon}) rotate(${mix(icon, -60, 0)}deg)`,
          }}
        >
          <Icon name="link" size={84} color="white" stroke={2.4} />
        </div>
      </At>
      <div style={{ position: 'absolute', top: 610, left: 60, right: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 96, fontWeight: 700, color: COLORS.ink, opacity: Math.min(1, t1 * 1.5), transform: `scale(${mix(t1, 0.8, 1)})` }}>أرسل رابط نشاطك</div>
        <div style={{ fontSize: 54, fontWeight: 600, color: COLORS.blue, marginTop: 10, opacity: Math.min(1, t2 * 1.5), transform: `translateY(${mix(t2, 30, 0)}px)` }}>
          ولنحدّد معًا فرص تطويره
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = pop(frame, 4, 12);
  const tag = ease(frame, 18, 16);
  return (
    <AbsoluteFill style={{ ...arabic }}>
      <At x={CENTER_X} y={520}>
        <div style={{ opacity: Math.min(1, logo * 1.5), transform: `scale(${mix(logo, 0.5, 1)})` }}>
          <Logo width={480} />
        </div>
      </At>
      <At x={CENTER_X} y={820}>
        <div style={{ opacity: tag, transform: `translateY(${mix(tag, 24, 0)}px)`, fontSize: 60, fontWeight: 700, color: COLORS.blueDeep }}>
          حضورٌ أوضح، ووصولٌ أسهل
        </div>
      </At>
    </AbsoluteFill>
  );
};

const SCENES: Record<StoryId, React.FC> = {
  hook: SHook,
  brand: SBrand,
  services: SServices,
  ads: SAds,
  proof: SProof,
  cta: SCta,
  outro: SOutro,
};

// ---------------------------------------------------------------- composition
const VOICE = T.placed.map((p) => [sec(p.voiceOutStart), sec(p.outEnd)] as const);
const musicVolume = (f: number) => {
  const end = T.totalFrames;
  const fadeOut = interpolate(f, [end - 45, end - 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ducked = VOICE.some(([a, b]) => f >= a - 6 && f <= b + 6);
  return (ducked ? AUDIO.musicDuckedVolume : AUDIO.musicVolume) * fadeOut;
};

export const ZediaStory: React.FC = () => {
  const ctaFrom = T.sectionFrames('cta').from;
  const barFrom = T.sectionFrames('ads').from;
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Background />
      {T.placed.map((p) => {
        const { from, duration } = T.sectionFrames(p.id);
        const Scene = SCENES[p.id];
        const last = p.id === 'outro';
        return (
          <Sequence key={p.id} from={from} durationInFrames={last ? duration : duration + OVERLAP} name={`story: ${p.id}`}>
            <SceneShell duration={last ? duration + 100 : duration} overlap={OVERLAP}>
              <Scene />
            </SceneShell>
          </Sequence>
        );
      })}

      <Sequence from={barFrom} durationInFrames={ctaFrom - barFrom + 12} name="brand bar">
        <BrandBar fadeOutAt={ctaFrom - barFrom} y={BAR_Y} />
      </Sequence>
      <Sequence from={ctaFrom + 12} durationInFrames={T.totalFrames - ctaFrom - 12} name="call button">
        <NumberBar y={1060} />
      </Sequence>

      <Captions items={T.captions} bottom={CAPTION_BOTTOM} />

      {T.placed.map((p) => (
        <Sequence key={`vo-${p.id}`} from={sec(p.voiceOutStart)} durationInFrames={sec(p.srcEnd) - sec(p.srcStart)} name={`voice: ${p.id}`}>
          <Audio src={staticFile(AUDIO.voice)} trimBefore={sec(p.srcStart)} trimAfter={sec(p.srcEnd)} />
        </Sequence>
      ))}
      <Audio src={staticFile(AUDIO.music)} volume={musicVolume} />
    </AbsoluteFill>
  );
};
