import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { drift, ease, mix, move, pop } from '../anim';
import { VIDEO } from '../config';
import { loadFonts } from '../fonts';
import { Icon, IconName } from '../components/Icon';
import { ProductShot, Storefront } from '../components/illustrations';
import { Phone } from '../components/Phone';
import { At, CENTER_X, Logo, SceneShell } from '../components/ui';
import { NumberBar } from '../scenes/Outro';
import { BlueWipe, L, LightBackground, PhotoSlot, Ring3D, Social, SocialTile, Words, ar } from './light';
import { CUT, SPEECH } from './theme';

loadFonts();

// Light version of the 30 s paid-ads & design spot. The voiceover is used untouched;
// a 0.6 s lead-in and a 2.7 s end hold were added around it (≈33 s total).
const PRE = 0.6;
export const ADS30L = { id: 'ZediaAds30Light', frames: 990 };
const fps = VIDEO.fps;
const F = (s: number) => Math.round(s * fps);
const OUT = (src: number) => src + PRE; // voice time → video time
const OVERLAP = 10;

// ---------------------------------------------------------------- shared pieces
const FeedMock: React.FC<{ w: number }> = ({ w }) => {
  const frame = useCurrentFrame();
  const scroll = mix(ease(frame, 0, 140), 0, -900);
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F3F6FB' }}>
      <div style={{ position: 'absolute', top: 64, left: 12, right: 12, transform: `translateY(${scroll}px)` }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 18, overflow: 'hidden', marginBottom: 14, boxShadow: '0 6px 16px -10px rgba(0,0,0,0.3)' }}>
            <div style={{ height: (w - 24) * 0.66, overflow: 'hidden' }}>
              {i % 2 ? <ProductShot width={w - 24} kind={i % 4 === 1 ? 'cup' : 'bag'} /> : <Storefront width={w - 24} variant={i % 3} />}
            </div>
            <div style={{ height: 40 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

const AD_COPY: { h: string; b: string; social: Social; slot: string; fb: React.ReactNode }[] = [
  { h: 'تشكيلة جديدة وصلت', b: 'تسوّق الآن', social: 'snapchat', slot: 'ad-1', fb: <ProductShot width={300} kind="bag" /> },
  { h: 'قهوتك المفضّلة بانتظارك', b: 'اطلب الآن', social: 'instagram', slot: 'ad-2', fb: <ProductShot width={300} kind="cup" /> },
  { h: 'زورونا اليوم', b: 'الموقع', social: 'tiktok', slot: 'ad-3', fb: <Storefront width={320} variant={2} /> },
  { h: 'احجز موعدك بسهولة', b: 'احجز الآن', social: 'google', slot: 'ad-4', fb: <Storefront width={320} variant={1} /> },
];

const AdCard: React.FC<{ i: number }> = ({ i }) => {
  const c = AD_COPY[i % AD_COPY.length];
  return (
    <div style={{ ...ar, width: '100%', height: '100%', background: 'white', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 50px -20px rgba(10,40,110,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
        <SocialTile name={c.social} size={40} tone="brand" />
        <div style={{ fontSize: 22, color: L.inkSoft, fontWeight: 600 }}>إعلان ممول</div>
      </div>
      <PhotoSlot name={c.slot} w={300} h={200} fallback={c.fb} />
      <div style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: L.ink, lineHeight: 1.35 }}>{c.h}</div>
        <div style={{ marginTop: 10, background: L.royal, color: 'white', borderRadius: 30, textAlign: 'center', fontSize: 24, fontWeight: 700, padding: '8px 0' }}>{c.b}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- S1 question (0 – 5.47)
const TILES: { n: Social; x: number; y: number; r: number }[] = [
  { n: 'instagram', x: 150, y: 860, r: -12 },
  { n: 'snapchat', x: 900, y: 820, r: 10 },
  { n: 'tiktok', x: 120, y: 1170, r: 8 },
  { n: 'x', x: 930, y: 1150, r: -8 },
  { n: 'whatsapp', x: 190, y: 1450, r: -6 },
  { n: 'youtube', x: 880, y: 1450, r: 12 },
  { n: 'google', x: 330, y: 760, r: 6 },
  { n: 'facebook', x: 700, y: 750, r: -10 },
];

const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const card = pop(frame, 50, 14);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 280, left: 60, right: 100 }}>
        <Words text="هل يصل إعلانك" start={10} size={112} />
        <div style={{ height: 14 }} />
        <Words text="إلى عملائك؟" start={26} size={112} hl={['عملائك؟']} />
      </div>
      <At x={CENTER_X} y={1170 + drift(frame, 1, 6)}>
        <div style={{ opacity: Math.min(1, card * 1.5), transform: `scale(${mix(card, 0.7, 1)}) translateY(${mix(card, 80, 0)}px)` }}>
          <PhotoSlot
            name="owner"
            w={560}
            h={700}
            radius={44}
            fallback={
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(160deg, ${L.soft}, #CFE2FF)` }}>
                <div style={{ transform: 'rotate(-6deg)' }}>
                  <Phone width={300}>
                    <FeedMock w={280} />
                  </Phone>
                </div>
              </div>
            }
          />
        </div>
      </At>
      {TILES.map((t, i) => {
        const p = pop(frame, 62 + i * 4, 11);
        return (
          <At key={t.n} x={t.x} y={t.y + drift(frame, i + 3, 12, 120)}>
            <div style={{ opacity: Math.min(1, p * 1.5), transform: `scale(${mix(p, 0.3, 1)})` }}>
              <SocialTile name={t.n} size={i > 5 ? 110 : 130} tilt={t.r + drift(frame, i, 4, 160)} />
            </div>
          </At>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S2 designs on blue (5.47 – 10.73)
const CHIPS = ['إعلانات ممولة', 'تصميم احترافي', 'استهداف مدروس'];
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = OUT(CUT.s2);
  const at = [SPEECH.chip1, SPEECH.chip2, SPEECH.chip3].map((s) => F(OUT(s) - t0));
  const current = frame >= at[2] - 2 ? 2 : frame >= at[1] - 2 ? 1 : 0;
  const ring = ease(frame, 6, 24);
  return (
    <AbsoluteFill>
      <BlueWipe start={0} origin="50% 60%" />
      <div style={{ position: 'absolute', top: 250, left: 60, right: 100, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {CHIPS.map((c, i) => (
          <div key={c} style={{ opacity: i === current ? 1 : 0.5, transition: 'none' }}>
            <Words text={c} start={at[i] - 4} size={84} color="white" hl={i === current ? [c.split(' ')[1]] : []} hlColor="white" hlText={L.royal} stagger={3} />
          </div>
        ))}
      </div>
      <At x={CENTER_X} y={1220}>
        <div style={{ opacity: ring, transform: `scale(${mix(ring, 0.7, 1)})` }}>
          <Ring3D items={Array.from({ length: 8 }).map((_, i) => <AdCard key={i} i={i} />)} radius={520} cardW={300} cardH={430} speed={0.8} tilt={-10} />
        </div>
      </At>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S3 targeting & inquiries (10.73 – 16.36)
const SATS: { icon: IconName; label: string; r: number; a0: number }[] = [
  { icon: 'pin', label: 'المنطقة', r: 300, a0: 200 },
  { icon: 'star', label: 'الاهتمامات', r: 300, a0: 340 },
  { icon: 'clock', label: 'التوقيت', r: 300, a0: 70 },
  { icon: 'eye', label: 'التحليل', r: 300, a0: 130 },
];
const MSGS = ['السلام عليكم، كم السعر؟', 'هل التوصيل متاح لبريدة؟', 'أبغى أحجز موعد'];
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = OUT(CUT.s3);
  const core = pop(frame, 8, 12);
  const msgAt = [11.3, 12.7, SPEECH.s3b + 0.2].map((s) => F(OUT(s) - t0));
  const C = { x: CENTER_X, y: 900 };
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 240, left: 60, right: 100 }}>
        <Words text="الوصول إلى الجمهور المناسب" start={4} size={70} />
        <div style={{ height: 10 }} />
        <Words text="يبدأ بخطة صحيحة" start={22} size={70} hl={['صحيحة']} />
      </div>
      {/* orbit of targeting criteria (reference video 1) */}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {[190, 300].map((r, i) => (
          <circle key={r} cx={C.x} cy={C.y} r={r * ease(frame, 4 + i * 6, 20)} fill="none" stroke={L.royal} strokeOpacity={0.18} strokeWidth={3} strokeDasharray={i ? '10 14' : undefined} />
        ))}
      </svg>
      <At x={C.x} y={C.y}>
        <div style={{ position: 'relative', transform: `scale(${core})` }}>
          <div
            style={{
              width: 210,
              height: 210,
              borderRadius: 210,
              background: `radial-gradient(circle at 35% 30%, #3D8BFF, ${L.royal} 55%, ${L.blueDeep})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 30px 60px -20px rgba(31,95,224,0.7)',
            }}
          >
            <Icon name="target" size={110} color="white" stroke={1.8} />
          </div>
          {[0, 1].map((k) => {
            const ph = (((frame + k * 30) % 60) / 60);
            return <div key={k} style={{ position: 'absolute', inset: 0, borderRadius: 210, border: `3px solid ${L.cyan}`, opacity: 1 - ph, transform: `scale(${mix(ph, 1, 1.7)})` }} />;
          })}
        </div>
      </At>
      {SATS.map((s, i) => {
        const p = pop(frame, 16 + i * 6, 12);
        const a = ((s.a0 + frame * 0.5) * Math.PI) / 180;
        return (
          <At key={s.label} x={C.x + Math.cos(a) * s.r} y={C.y + Math.sin(a) * s.r * 0.85}>
            <div style={{ ...ar, textAlign: 'center', opacity: Math.min(1, p * 1.5), transform: `scale(${p})` }}>
              <div style={{ width: 110, height: 110, borderRadius: 110, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 18px 36px -16px rgba(10,40,110,0.45)', margin: '0 auto' }}>
                <Icon name={s.icon} size={56} color={L.royal} stroke={2} />
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: L.ink, marginTop: 6 }}>{s.label}</div>
            </div>
          </At>
        );
      })}
      {MSGS.map((m, i) => {
        const p = pop(frame, msgAt[i], 12);
        return (
          <At key={m} x={CENTER_X + (i % 2 ? 60 : -40)} y={1300 + i * 100}>
            <div
              style={{
                ...ar,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: 'white',
                borderRadius: 30,
                padding: '14px 26px 14px 16px',
                boxShadow: '0 20px 40px -18px rgba(10,40,110,0.45)',
                opacity: Math.min(1, p * 1.5),
                transform: `translateX(${mix(p, i % 2 ? -200 : 200, 0)}px) scale(${mix(p, 0.8, 1)})`,
              }}
            >
              <SocialTile name="whatsapp" size={58} tone="brand" />
              <div>
                <div style={{ fontSize: 20, color: L.inkSoft, fontWeight: 600 }}>استفسار جديد</div>
                <div style={{ fontSize: 34, color: L.ink, fontWeight: 600 }}>{m}</div>
              </div>
            </div>
          </At>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S4 Saudi businesses → kingdom (16.36 – 23.53)
const BIZ: { slot: string; label: string; icon: IconName; fb: React.ReactNode; rot: number }[] = [
  { slot: 'store', label: 'متجر', icon: 'store', fb: <Storefront width={640} variant={0} />, rot: -6 },
  {
    slot: 'cafe',
    label: 'مقهى',
    icon: 'box',
    fb: (
      <div style={{ position: 'relative' }}>
        <Storefront width={640} variant={2} />
        <div style={{ position: 'absolute', right: 24, bottom: 20, width: 180, height: 180, borderRadius: 30, overflow: 'hidden', border: '6px solid white' }}>
          <ProductShot width={180} kind="cup" />
        </div>
      </div>
    ),
    rot: 5,
  },
  { slot: 'service', label: 'نشاط خدمي', icon: 'edit', fb: <Storefront width={640} variant={1} />, rot: -3 },
];
const CITIES = [
  { n: 'بريدة', x: 520, y: 900, main: true },
  { n: 'الرياض', x: 650, y: 1080 },
  { n: 'الدمام', x: 870, y: 980 },
  { n: 'جدة', x: 240, y: 1180 },
  { n: 'المدينة', x: 320, y: 950 },
  { n: 'تبوك', x: 230, y: 730 },
  { n: 'أبها', x: 420, y: 1340 },
  { n: 'حائل', x: 430, y: 760 },
];
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = OUT(CUT.s4);
  const ins = [F(OUT(SPEECH.s4a) - t0), F(OUT(17.3) - t0), F(OUT(18.75) - t0)];
  const netAt = F(OUT(SPEECH.s4c) - t0);
  const out = move(frame, netAt - 10, 16);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 240, left: 60, right: 100 }}>
        <Words text="من بريدة والقصيم" start={6} size={92} hl={['بريدة']} />
        <div style={{ height: 10 }} />
        <Words text="إلى جميع أنحاء المملكة" start={netAt - 4} size={80} color={L.royal} />
      </div>
      {BIZ.map((b, i) => {
        const p = pop(frame, ins[i] - 4, 13);
        const covered = i < 2 ? ease(frame, ins[i + 1] - 4, 14) : 0;
        return (
          <At key={b.slot} x={CENTER_X + mix(p, 700, 0) + covered * (i % 2 ? 40 : -40)} y={1020 - covered * 30 - out * 200}>
            <div
              style={{
                opacity: Math.min(1, p * 1.5) * (1 - out),
                transform: `rotate(${mix(p, b.rot * 3, b.rot)}deg) scale(${(1 - covered * 0.08) * mix(out, 1, 0.6)})`,
                background: 'white',
                padding: 16,
                borderRadius: 40,
                boxShadow: '0 40px 80px -30px rgba(10,40,110,0.5)',
              }}
            >
              <PhotoSlot name={b.slot} w={640} h={450} radius={28} fallback={b.fb} />
              <div style={{ ...ar, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '18px 0 6px', fontSize: 48, fontWeight: 700, color: L.ink }}>
                <Icon name={b.icon} size={48} color={L.royal} />
                {b.label}
              </div>
            </div>
          </At>
        );
      })}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {CITIES.slice(1).map((c, i) => {
          const p = ease(frame, netAt + 4 + i * 4, 16);
          return (
            <path
              key={c.n}
              d={`M${CITIES[0].x} ${CITIES[0].y} Q ${(CITIES[0].x + c.x) / 2} ${Math.min(CITIES[0].y, c.y) - 90}, ${c.x} ${c.y}`}
              stroke={L.royal}
              strokeWidth={5}
              strokeLinecap="round"
              fill="none"
              opacity={0.75}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
            />
          );
        })}
      </svg>
      {CITIES.map((c, i) => {
        const p = pop(frame, netAt + (c.main ? 0 : 10 + (i - 1) * 4), 11);
        const pulse = ((frame - netAt) % 40) / 40;
        return (
          <At key={c.n} x={c.x} y={c.y}>
            <div style={{ ...ar, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(1, p * 1.5), transform: `scale(${p})` }}>
              {c.main && frame > netAt && (
                <div style={{ position: 'absolute', top: -22, width: 84, height: 84, borderRadius: 84, border: `4px solid ${L.cyan}`, opacity: 1 - pulse, transform: `scale(${mix(pulse, 0.5, 2)})` }} />
              )}
              <div style={{ width: c.main ? 42 : 24, height: c.main ? 42 : 24, borderRadius: 42, background: c.main ? L.royal : L.cyan, border: '4px solid white', boxShadow: '0 6px 14px rgba(10,40,110,0.35)' }} />
              <div style={{ marginTop: 8, fontSize: c.main ? 46 : 34, fontWeight: 700, color: c.main ? L.royal : L.ink }}>{c.n}</div>
            </div>
          </At>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S5 brand & contact (23.53 – 33)
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = OUT(CUT.s5);
  const logo = pop(frame, 6, 13);
  const brand = F(OUT(SPEECH.brand) - t0);
  const pulse = ease(frame, brand, 10) * (1 - ease(frame, brand + 10, 14));
  const contact = F(OUT(SPEECH.contact) - t0);
  return (
    <AbsoluteFill>
      <At x={CENTER_X} y={620}>
        <div
          style={{
            width: 1400,
            height: 1400,
            borderRadius: '50%',
            background: `repeating-conic-gradient(from ${frame * 0.5}deg, rgba(31,95,224,0.07) 0deg 8deg, transparent 8deg 30deg)`,
            maskImage: 'radial-gradient(circle, black 10%, transparent 60%)',
          }}
        />
      </At>
      <At x={CENTER_X} y={620}>
        <div style={{ width: 620, height: 620, borderRadius: 620, background: 'radial-gradient(circle, rgba(43,184,240,0.25), transparent 65%)', transform: `scale(${1 + pulse * 0.15})` }} />
      </At>
      {/* logo exactly as supplied, transparent background — no plate */}
      <At x={CENTER_X} y={620}>
        <div style={{ opacity: Math.min(1, logo * 1.5), transform: `scale(${mix(logo, 0.6, 1) * (1 + pulse * 0.06)})` }}>
          <Logo width={560} />
        </div>
      </At>
      <div style={{ position: 'absolute', top: 930, left: 60, right: 100 }}>
        <Words text="اجعل إعلانك بداية" start={F(OUT(SPEECH.s5a) - t0)} size={76} stagger={3} />
        <div style={{ height: 10 }} />
        <Words text="لفرص جديدة" start={F(OUT(SPEECH.s5a) - t0) + 10} size={76} hl={['جديدة']} stagger={3} />
      </div>
      <At x={CENTER_X} y={1265}>
        <div style={{ opacity: ease(frame, contact - 4, 12) }}>
          <Words text="تواصل الآن" start={contact - 4} size={100} color={L.royal} />
        </div>
      </At>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- composition
const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0, to: F(OUT(CUT.s2)), C: S1 },
  { from: F(OUT(CUT.s2)), to: F(OUT(CUT.s3)), C: S2 },
  { from: F(OUT(CUT.s3)), to: F(OUT(CUT.s4)), C: S3 },
  { from: F(OUT(CUT.s4)), to: F(OUT(CUT.s5)), C: S4 },
  { from: F(OUT(CUT.s5)), to: ADS30L.frames, C: S5 },
];

// very light effects only
const SFX: { f: string; t: number; v: number }[] = [
  ...[CUT.s2, CUT.s3, CUT.s4, CUT.s5].map((t) => ({ f: 'whoosh', t: OUT(t) - 0.25, v: 0.08 })),
  ...[SPEECH.chip1, SPEECH.chip2, SPEECH.chip3].map((t) => ({ f: 'pop', t: OUT(t) - 0.08, v: 0.08 })),
  ...[11.3, 12.7, SPEECH.s3b + 0.2].map((t) => ({ f: 'ping', t: OUT(t), v: 0.1 })),
  { f: 'chime', t: OUT(SPEECH.brand) - 0.1, v: 0.12 },
];

export const ZediaAds30Light: React.FC = () => {
  const callFrom = F(OUT(SPEECH.contact)) + 6;
  return (
    <AbsoluteFill style={{ backgroundColor: L.bg }}>
      <LightBackground />
      {SCENES.map(({ from, to, C }, i) => {
        const last = i === SCENES.length - 1;
        const dur = to - from;
        return (
          <Sequence key={i} from={from} durationInFrames={last ? dur : dur + OVERLAP}>
            <SceneShell duration={last ? dur + 100 : dur} overlap={OVERLAP}>
              <C />
            </SceneShell>
          </Sequence>
        );
      })}
      <Sequence from={callFrom} durationInFrames={ADS30L.frames - callFrom} name="call button">
        <NumberBar y={1440} />
      </Sequence>

      <Sequence from={F(PRE)} name="voiceover (untouched)">
        <Audio src={staticFile('ads30/voiceover.mp3')} />
      </Sequence>
      <Audio
        src={staticFile('ads30/music.mp3')}
        volume={(f) => 0.07 * interpolate(f, [ADS30L.frames - 40, ADS30L.frames - 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
      />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, F(s.t))} durationInFrames={F(1.8)}>
          <Audio src={staticFile(`ads30/sfx-${s.f}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
