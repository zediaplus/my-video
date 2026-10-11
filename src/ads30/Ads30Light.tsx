import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { drift, ease, mix, move, pop } from '../anim';
import { VIDEO } from '../config';
import { loadFonts } from '../fonts';
import { Icon, IconName } from '../components/Icon';
import { ProductShot, Storefront } from '../components/illustrations';
import { Phone } from '../components/Phone';
import { At, CENTER_X, Logo, SceneShell } from '../components/ui';
import { NumberBar } from '../scenes/Outro';
import { L, PhotoSlot, Ring3D, ar } from './light';
import { CUT } from './theme';

loadFonts();

// Paid-ads & design spot in the style of the user's reference posters (VTraffic / Osiz):
// white top melting into deep blue, glowing light arcs, heavy two-tone headlines,
// the 3D social tiles cut out of the user's own reference image, glass UI panels.
// Voiceover untouched; 0.6 s lead-in + 2.7 s end hold (33 s total).
const PRE = 0.6;
export const ADS30L = { id: 'ZediaAds30Light', frames: 990 };
const fps = VIDEO.fps;
const F = (s: number) => Math.round(s * fps);
const OUT = (src: number) => src + PRE;
const OVERLAP = 10;

/** Speech segments of the voiceover (src seconds, silencedetect −42 dB). Text is revealed inside them. */
const SEG = {
  q: [0.0, 2.1],
  q2: [2.45, 4.65],
  c1: [5.09, 6.46],
  c2: [6.63, 8.25],
  c3: [8.46, 9.98],
  plan: [10.28, 13.78],
  leads: [14.09, 15.61],
  buraidah: [15.91, 18.42],
  b2: [18.81, 19.99],
  kingdom: [20.15, 22.78],
  chance: [23.09, 25.18],
  brand: [25.48, 26.16],
  contact: [26.46, 29.52],
} as const;

const INK = '#0B1B3A';
const GRAD = 'linear-gradient(90deg, #2BB8F0 0%, #1F5FE0 60%, #0A3D91 100%)';

// ---------------------------------------------------------------- style primitives
const PosterBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F8FF 34%, #CFE0FF 50%, #3F7FEA 64%, #1546B8 80%, #0A2E7A 100%)' }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="arcGlow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        {[0, 1, 2, 3].map((i) => {
          const y = 1010 + i * 46 + Math.sin(frame / 50 + i) * 14;
          const d = `M-120 ${y + 160} Q 540 ${y - 230 - i * 10}, 1200 ${y + 160}`;
          return (
            <g key={i}>
              <path d={d} stroke="#FFFFFF" strokeOpacity={0.55 - i * 0.1} strokeWidth={26 - i * 5} fill="none" filter="url(#arcGlow)" />
              <path d={d} stroke="#FFFFFF" strokeOpacity={0.8 - i * 0.15} strokeWidth={3} fill="none" />
            </g>
          );
        })}
      </svg>
      {/* tiny sparkle, as on the poster */}
      <div style={{ position: 'absolute', left: 900, top: 1600, transform: `scale(${0.8 + 0.2 * Math.sin(frame / 12)})`, opacity: 0.7 }}>
        <svg width={60} height={60} viewBox="0 0 24 24">
          <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" fill="#BFD6FF" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/** Words revealed one by one across a spoken segment (letters of a word never split). */
const SyncWords: React.FC<{
  text: string;
  a: number; // frame the segment starts (scene-local)
  b: number; // frame it ends
  size?: number;
  grad?: string[]; // words drawn with the blue gradient
  color?: string;
  weight?: number;
}> = ({ text, a, b, size = 92, grad = [], color = INK, weight = 700 }) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  const total = words.reduce((s, w) => s + w.length + 1, 0);
  let acc = 0;
  return (
    <div style={{ ...ar, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.26, fontSize: size, fontWeight: weight, lineHeight: 1.22, color }}>
      {words.map((w, i) => {
        const at = a + ((b - a) * acc) / total - 3;
        acc += w.length + 1;
        const p = ease(frame, at, 9);
        const g = grad.includes(w);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${mix(p, size * 0.45, 0)}px) scale(${mix(p, 0.92, 1)})`,
              filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
              ...(g ? { backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', paddingBottom: size * 0.08 } : {}),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

type Tile = 'youtube' | 'instagram' | 'linkedin' | 'facebook' | 'snapchat' | 'x' | 'google' | 'share';
/** 3D social tile cut out of the user's own reference poster. */
const IconTile: React.FC<{ n: Tile; w: number; rot?: number }> = ({ n, w, rot = 0 }) => (
  <Img src={staticFile(`ads30/icons/${n}.png`)} style={{ width: w, display: 'block', transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 18px 24px rgba(5,30,90,0.45))' }} />
);

const segF = (s: readonly [number, number], t0: number) => [F(OUT(s[0]) - t0), F(OUT(s[1]) - t0)] as const;

// ---------------------------------------------------------------- shared mockups
const FeedMock: React.FC<{ w: number }> = ({ w }) => {
  const frame = useCurrentFrame();
  const scroll = mix(ease(frame, 0, 150), 0, -900);
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F3F6FB' }}>
      <div style={{ position: 'absolute', top: 64, left: 12, right: 12, transform: `translateY(${scroll}px)` }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 18, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ height: (w - 24) * 0.66, overflow: 'hidden' }}>
              {i % 2 ? <ProductShot width={w - 24} kind={i % 4 === 1 ? 'cup' : 'bag'} /> : <Storefront width={w - 24} variant={i % 3} />}
            </div>
            <div style={{ height: 36 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

const AD_COPY: { h: string; b: string; tile: Tile; slot: string; fb: React.ReactNode }[] = [
  { h: 'تشكيلة جديدة وصلت', b: 'تسوّق الآن', tile: 'snapchat', slot: 'ad-1', fb: <ProductShot width={440} kind="bag" /> },
  { h: 'قهوتك المفضّلة بانتظارك', b: 'اطلب الآن', tile: 'instagram', slot: 'ad-2', fb: <ProductShot width={440} kind="cup" /> },
  { h: 'زورونا اليوم', b: 'الموقع', tile: 'google', slot: 'ad-3', fb: <Storefront width={470} variant={2} /> },
  { h: 'احجز موعدك بسهولة', b: 'احجز الآن', tile: 'facebook', slot: 'ad-4', fb: <Storefront width={470} variant={1} /> },
  { h: 'عرض الأسبوع', b: 'اكتشف المزيد', tile: 'x', slot: 'ad-5', fb: <ProductShot width={440} kind="box" /> },
];

const AdCard: React.FC<{ i: number }> = ({ i }) => {
  const c = AD_COPY[i % AD_COPY.length];
  return (
    <div style={{ ...ar, width: '100%', height: '100%', background: 'white', borderRadius: 40, overflow: 'hidden', boxShadow: '0 40px 70px -24px rgba(5,25,80,0.65)', border: '3px solid rgba(255,255,255,0.9)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px' }}>
        <IconTile n={c.tile} w={64} />
        <div style={{ fontSize: 30, color: L.inkSoft, fontWeight: 600 }}>إعلان ممول</div>
      </div>
      <PhotoSlot name={c.slot} w={440} h={300} fallback={c.fb} />
      <div style={{ padding: '18px 24px' }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: INK, lineHeight: 1.3 }}>{c.h}</div>
        <div style={{ marginTop: 16, background: 'linear-gradient(90deg,#2C8BFF,#1F5FE0)', color: 'white', borderRadius: 40, textAlign: 'center', fontSize: 34, fontWeight: 700, padding: '12px 0' }}>{c.b}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- S1 (0 – 5.47)
const BURST: { n: Tile; x: number; y: number; w: number; r: number }[] = [
  { n: 'youtube', x: 790, y: 860, w: 190, r: 0 },
  { n: 'instagram', x: 230, y: 980, w: 180, r: 0 },
  { n: 'linkedin', x: 760, y: 1090, w: 170, r: 0 },
  { n: 'facebook', x: 880, y: 1290, w: 200, r: 0 },
  { n: 'snapchat', x: 180, y: 1270, w: 175, r: 0 },
  { n: 'x', x: 330, y: 1520, w: 230, r: 0 },
  { n: 'google', x: 700, y: 1510, w: 220, r: 0 },
  { n: 'share', x: 880, y: 1640, w: 150, r: 0 },
];
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const [qa, qb] = segF(SEG.q, 0);
  const [q2a] = segF(SEG.q2, 0);
  const phone = pop(frame, 4, 14);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 250, left: 60, right: 100 }}>
        <SyncWords text="هل يصل إعلانك إلى عملائك؟" a={qa} b={qb} size={110} grad={['عملائك؟']} />
      </div>
      <At x={CENTER_X} y={1240 + drift(frame, 1, 6)}>
        <div style={{ opacity: Math.min(1, phone * 1.5), transform: `translateY(${mix(phone, 200, 0)}px) rotate(${mix(phone, 10, -4)}deg)` }}>
          <Phone width={380}>
            <FeedMock w={360} />
          </Phone>
        </div>
      </At>
      {BURST.map((t, i) => {
        const p = pop(frame, q2a - 6 + i * 3, 11);
        // tiles fly out from behind the phone, then float
        const x = mix(p, CENTER_X, t.x);
        const y = mix(p, 1240, t.y);
        return (
          <At key={t.n} x={x + drift(frame, i, 10, 130)} y={y + drift(frame, i + 4, 14, 110)}>
            <div style={{ opacity: Math.min(1, p * 2), transform: `scale(${mix(p, 0.2, 1)}) rotate(${drift(frame, i + 9, 6, 140)}deg)` }}>
              <IconTile n={t.n} w={t.w} />
            </div>
          </At>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S2 (5.47 – 10.73) — ring fills the screen
const CHIPS: { t: string; g: string[]; seg: readonly [number, number] }[] = [
  { t: 'إعلانات ممولة', g: ['ممولة'], seg: SEG.c1 },
  { t: 'تصميم احترافي', g: ['احترافي'], seg: SEG.c2 },
  { t: 'استهداف مدروس', g: ['مدروس'], seg: SEG.c3 },
];
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = OUT(CUT.s2);
  const ring = ease(frame, 0, 22);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 210, left: 60, right: 100, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {CHIPS.map((c) => {
          const [a, b] = segF(c.seg, t0);
          return <SyncWords key={c.t} text={c.t} a={a} b={b} size={84} grad={frame >= a ? c.g : []} />;
        })}
      </div>
      <At x={CENTER_X} y={1210}>
        <div style={{ opacity: ring, transform: `scale(${mix(ring, 0.6, 1)})` }}>
          <Ring3D items={Array.from({ length: 7 }).map((_, i) => <AdCard key={i} i={i} />)} radius={600} cardW={440} cardH={640} speed={0.9} tilt={-8} />
        </div>
      </At>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S3 (10.73 – 16.36) — campaign panel (Osiz-style)
const MSGS = ['السلام عليكم، كم السعر؟', 'هل التوصيل متاح لبريدة؟', 'أبغى أحجز موعد'];
const Field: React.FC<{ label: string; children: React.ReactNode; p: number }> = ({ label, children, p }) => (
  <div style={{ opacity: Math.min(1, p * 1.5), transform: `translateY(${mix(p, 24, 0)}px)`, marginBottom: 22 }}>
    <div style={{ fontSize: 26, color: L.inkSoft, fontWeight: 600, marginBottom: 10 }}>{label}</div>
    {children}
  </div>
);
const Chip: React.FC<{ t: string; on?: boolean }> = ({ t, on }) => (
  <div style={{ padding: '10px 22px', borderRadius: 30, fontSize: 28, fontWeight: 600, background: on ? '#1F5FE0' : '#EAF1FF', color: on ? 'white' : '#1F5FE0' }}>{t}</div>
);
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = OUT(CUT.s3);
  const [pa, pb] = segF(SEG.plan, t0);
  const [la, lb] = segF(SEG.leads, t0);
  const mid = Math.round(pa + (pb - pa) * 0.58);
  const panel = pop(frame, 4, 14);
  const f = (k: number) => pop(frame, 14 + k * 9, 12);
  const slider = ease(frame, 40, 30);
  const press = la - 6;
  const pressed = ease(frame, press, 5) * (1 - ease(frame, press + 6, 8));
  const ripple = ease(frame, press + 2, 22);
  const cursor = move(frame, press - 22, 20);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 230, left: 60, right: 100 }}>
        <SyncWords text="الوصول إلى الجمهور المناسب" a={pa} b={mid} size={74} />
        <SyncWords text="يبدأ بخطة صحيحة" a={mid} b={pb} size={84} grad={['بخطة', 'صحيحة']} />
      </div>
      <At x={CENTER_X} y={1120 + drift(frame, 2, 5)}>
        <div
          style={{
            ...ar,
            width: 820,
            padding: '34px 40px 40px',
            boxSizing: 'border-box',
            borderRadius: 44,
            background: 'linear-gradient(160deg, rgba(255,255,255,0.97), rgba(236,243,255,0.92))',
            border: '2px solid rgba(255,255,255,0.95)',
            boxShadow: '0 50px 90px -30px rgba(5,25,80,0.7), 0 0 60px -10px rgba(43,184,240,0.5)',
            opacity: Math.min(1, panel * 1.5),
            transform: `perspective(1800px) rotateY(${mix(panel, 18, 0)}deg) scale(${mix(panel, 0.85, 1)})`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: INK }}>إدارة الحملة</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <IconTile n="snapchat" w={56} />
              <IconTile n="instagram" w={56} />
              <IconTile n="google" w={56} />
            </div>
          </div>
          <Field label="المنطقة" p={f(0)}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Chip t="بريدة" on />
              <Chip t="القصيم" on />
              <Chip t="المملكة" />
            </div>
          </Field>
          <Field label="الجمهور" p={f(1)}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Chip t="المهتمون بنشاطك" on />
              <Chip t="القريبون منك" />
            </div>
          </Field>
          <Field label="الميزانية" p={f(2)}>
            <div style={{ height: 14, borderRadius: 14, background: '#E3ECFB', position: 'relative', direction: 'ltr' }}>
              <div style={{ width: `${mix(slider, 10, 62)}%`, height: '100%', borderRadius: 14, background: GRAD }} />
              <div style={{ position: 'absolute', top: -9, left: `calc(${mix(slider, 10, 62)}% - 16px)`, width: 32, height: 32, borderRadius: 32, background: 'white', border: '5px solid #1F5FE0' }} />
            </div>
          </Field>
          {/* the glowing "promote" button (Osiz reference) */}
          <div style={{ position: 'relative', marginTop: 10 }}>
            <div
              style={{
                background: 'linear-gradient(90deg,#2C8BFF,#1F5FE0)',
                color: 'white',
                textAlign: 'center',
                fontSize: 44,
                fontWeight: 700,
                padding: '22px 0',
                borderRadius: 28,
                transform: `scale(${1 - pressed * 0.05})`,
                boxShadow: `0 0 ${30 + pressed * 60}px rgba(43,184,240,${0.5 + pressed * 0.5})`,
              }}
            >
              روّج إعلانك
            </div>
            {frame > press && (
              <div style={{ position: 'absolute', left: '50%', top: '50%', width: 200, height: 200, marginLeft: -100, marginTop: -100, borderRadius: 200, border: '5px solid #2BB8F0', opacity: 1 - ripple, transform: `scale(${mix(ripple, 0.3, 3)})` }} />
            )}
            {/* pointer */}
            <div style={{ position: 'absolute', left: mix(cursor, 760, 470), top: mix(cursor, 260, 40), opacity: ease(frame, press - 24, 8) * (1 - ease(frame, press + 18, 10)) }}>
              <svg width={70} height={70} viewBox="0 0 24 24">
                <path d="M5 3l14 7-6 2-2 6z" fill="white" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </At>
      {/* inquiries arrive one after another after the button is pressed */}
      {MSGS.map((m, i) => {
        const step = Math.max(1, Math.round((lb - la) / 3));
        const p = pop(frame, la + i * step, 11);
        const current = Math.min(2, Math.max(0, Math.floor((frame - la) / step)));
        return (
          <At key={m} x={i % 2 ? 360 : 690} y={1560}>
            <div style={{ display: i === current ? 'block' : 'none' }}>
              <div
                style={{
                  ...ar,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  background: 'white',
                  borderRadius: 30,
                  padding: '14px 24px 14px 14px',
                  boxShadow: '0 24px 40px -16px rgba(5,25,80,0.6)',
                  opacity: Math.min(1, p * 1.5),
                  transform: `scale(${mix(p, 0.6, 1)})`,
                }}
              >
                <div style={{ width: 58, height: 58, borderRadius: 18, background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="chat" size={34} color="white" stroke={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: 20, color: L.inkSoft, fontWeight: 600 }}>استفسار جديد</div>
                  <div style={{ fontSize: 32, color: INK, fontWeight: 600, whiteSpace: 'nowrap' }}>{m}</div>
                </div>
              </div>
            </div>
          </At>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S4 (16.36 – 23.53)
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
// approximate relative positions only (not a map)
const CITIES = [
  { n: 'بريدة', x: 520, y: 1080, main: true },
  { n: 'الرياض', x: 650, y: 1260 },
  { n: 'الدمام', x: 880, y: 1160 },
  { n: 'جدة', x: 230, y: 1370 },
  { n: 'المدينة', x: 300, y: 1130 },
  { n: 'تبوك', x: 220, y: 900 },
  { n: 'أبها', x: 430, y: 1530 },
  { n: 'حائل', x: 420, y: 940 },
];
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = OUT(CUT.s4);
  const [ba, bb] = segF(SEG.buraidah, t0);
  const [b2a] = segF(SEG.b2, t0);
  const [ka, kb] = segF(SEG.kingdom, t0);
  const ins = [ba, Math.round((ba + bb) / 2) + 6, b2a];
  const out = move(frame, ka - 10, 16);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 230, left: 60, right: 100 }}>
        <SyncWords text="من بريدة والقصيم" a={ba} b={bb} size={104} grad={['بريدة', 'والقصيم']} />
        <SyncWords text="إلى جميع أنحاء المملكة" a={ka} b={kb} size={84} />
      </div>
      {BIZ.map((b, i) => {
        const p = pop(frame, ins[i] - 4, 13);
        const covered = i < 2 ? ease(frame, ins[i + 1] - 4, 14) : 0;
        return (
          <At key={b.slot} x={CENTER_X + mix(p, 760, 0) + covered * (i % 2 ? 40 : -40)} y={1160 - covered * 30 - out * 260}>
            <div
              style={{
                opacity: Math.min(1, p * 1.5) * (1 - out),
                transform: `rotate(${mix(p, b.rot * 3, b.rot)}deg) scale(${(1 - covered * 0.08) * mix(out, 1, 0.6)})`,
                background: 'white',
                padding: 18,
                borderRadius: 44,
                boxShadow: '0 50px 90px -30px rgba(5,25,80,0.7)',
              }}
            >
              <PhotoSlot name={b.slot} w={700} h={490} radius={30} fallback={b.fb} />
              <div style={{ ...ar, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '18px 0 6px', fontSize: 52, fontWeight: 700, color: INK }}>
                <Icon name={b.icon} size={52} color="#1F5FE0" />
                {b.label}
              </div>
            </div>
          </At>
        );
      })}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {CITIES.slice(1).map((c, i) => {
          const p = ease(frame, ka + 4 + i * 4, 16);
          return (
            <path
              key={c.n}
              d={`M${CITIES[0].x} ${CITIES[0].y} Q ${(CITIES[0].x + c.x) / 2} ${Math.min(CITIES[0].y, c.y) - 90}, ${c.x} ${c.y}`}
              stroke="#FFFFFF"
              strokeWidth={5}
              strokeLinecap="round"
              fill="none"
              opacity={0.9}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
              style={{ filter: 'drop-shadow(0 0 8px #9FD8FF)' }}
            />
          );
        })}
      </svg>
      {CITIES.map((c, i) => {
        const p = pop(frame, ka + (c.main ? 0 : 10 + (i - 1) * 4), 11);
        const pulse = ((frame - ka) % 40) / 40;
        return (
          <At key={c.n} x={c.x} y={c.y}>
            <div style={{ ...ar, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(1, p * 1.5), transform: `scale(${p})` }}>
              {c.main && frame > ka && (
                <div style={{ position: 'absolute', top: -22, width: 86, height: 86, borderRadius: 86, border: '4px solid #FFFFFF', opacity: 1 - pulse, transform: `scale(${mix(pulse, 0.5, 2)})` }} />
              )}
              <div style={{ width: c.main ? 44 : 24, height: c.main ? 44 : 24, borderRadius: 44, background: c.main ? '#FFFFFF' : '#9FD8FF', boxShadow: '0 0 24px #9FD8FF' }} />
              <div style={{ marginTop: 8, fontSize: c.main ? 48 : 34, fontWeight: 700, color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,20,70,0.5)' }}>{c.n}</div>
            </div>
          </At>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S5 (23.53 – 33)
const FOOT = ['إعلانات ممولة', 'تصميم احترافي', 'استهداف مدروس'];
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = OUT(CUT.s5);
  const [ca, cb] = segF(SEG.chance, t0);
  const [ra] = segF(SEG.brand, t0);
  const [ta] = segF(SEG.contact, t0);
  const logo = pop(frame, ra - 4, 12);
  const cta = pop(frame, ta - 2, 12);
  const foot = ease(frame, ta + 20, 16);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 210, left: 60, right: 100 }}>
        <SyncWords text="اجعل إعلانك بداية" a={ca} b={Math.round((ca + cb) / 2)} size={92} />
        <SyncWords text="لفرص جديدة" a={Math.round((ca + cb) / 2)} b={cb} size={104} grad={['لفرص', 'جديدة']} />
      </div>
      {/* logo exactly as supplied, no background */}
      <At x={CENTER_X} y={720}>
        <div style={{ opacity: Math.min(1, logo * 1.5), transform: `scale(${mix(logo, 0.5, 1)})` }}>
          <Logo width={430} />
        </div>
      </At>
      <At x={CENTER_X} y={1120}>
        <div
          style={{
            ...ar,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            background: 'linear-gradient(90deg,#2C8BFF,#1F5FE0)',
            border: '3px solid rgba(255,255,255,0.7)',
            borderRadius: 80,
            padding: '24px 60px',
            color: 'white',
            fontSize: 64,
            fontWeight: 700,
            boxShadow: '0 30px 60px -20px rgba(5,25,80,0.7)',
            opacity: Math.min(1, cta * 1.5),
            transform: `scale(${mix(cta, 0.7, 1)})`,
          }}
        >
          تواصل الآن
          <span style={{ fontSize: 60 }}>←</span>
        </div>
      </At>
      <div style={{ ...ar, position: 'absolute', top: 1470, left: 60, right: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, color: 'white', fontSize: 34, fontWeight: 500, opacity: foot }}>
        {FOOT.map((t, i) => (
          <React.Fragment key={t}>
            {i > 0 && <span style={{ opacity: 0.6 }}>|</span>}
            <span>{t}</span>
          </React.Fragment>
        ))}
      </div>
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
  { f: 'pop', t: OUT(SEG.leads[0]) - 0.2, v: 0.08 },
  { f: 'chime', t: OUT(SEG.brand[0]) - 0.1, v: 0.12 },
];

export const ZediaAds30Light: React.FC = () => {
  const callFrom = F(OUT(SEG.contact[0])) + 10;
  return (
    <AbsoluteFill style={{ backgroundColor: '#FFFFFF' }}>
      <PosterBackground />
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
        <NumberBar y={1310} />
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
