import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { drift, ease, mix, move, pop } from '../anim';
import { VIDEO } from '../config';
import { loadFonts } from '../fonts';
import { Icon, IconName } from '../components/Icon';
import { ProductShot, Storefront } from '../components/illustrations';
import { Phone } from '../components/Phone';
import { At, CENTER_X, Logo, SceneShell } from '../components/ui';
import { NumberBar } from '../scenes/Outro';
import { CUT, D, DarkBackground, Glass, Hl, SPEECH, Title, ar } from './theme';

loadFonts();

// 30 s paid-ads & digital-design spot (exactly 900 frames), synced to the supplied voiceover.
export const ADS30 = { id: 'ZediaAds30', frames: 900 };
const fps = VIDEO.fps;
const F = (s: number) => Math.round(s * fps);
const OVERLAP = 10;

// ---------------------------------------------------------------- shared bits
const FeedPost: React.FC<{ w: number; i: number }> = ({ w, i }) => (
  <div style={{ background: '#0E1A33', borderRadius: 18, overflow: 'hidden', marginBottom: 14 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, direction: 'rtl' }}>
      <div style={{ width: 34, height: 34, borderRadius: 34, background: [D.cyan, '#F5B651', '#7C9CFF'][i % 3] }} />
      <div style={{ width: w * 0.35, height: 10, borderRadius: 6, background: 'rgba(255,255,255,0.3)' }} />
    </div>
    <div style={{ height: w * 0.62, overflow: 'hidden' }}>
      {i % 3 === 0 ? <Storefront width={w} variant={i % 2} /> : <ProductShot width={w} kind={i % 3 === 1 ? 'cup' : 'bag'} />}
    </div>
    <div style={{ display: 'flex', gap: 14, padding: 12, direction: 'rtl' }}>
      {(['star', 'chat', 'link'] as IconName[]).map((n) => (
        <Icon key={n} name={n} size={24} color="rgba(255,255,255,0.7)" />
      ))}
    </div>
  </div>
);

const AdDesign: React.FC<{ w: number; v: 0 | 1 | 2 }> = ({ w, v }) => {
  const copy = [
    { h: 'تشكيلة جديدة وصلت', b: 'تسوّق الآن', img: <ProductShot width={w} kind="bag" /> },
    { h: 'قهوتك المفضّلة بانتظارك', b: 'اطلب الآن', img: <ProductShot width={w} kind="cup" /> },
    { h: 'زورونا اليوم', b: 'الموقع', img: <Storefront width={w * 1.05} variant={2} /> },
  ][v];
  return (
    <div style={{ ...ar, position: 'absolute', inset: 0, background: '#0B1530', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: w * 0.16 }} />
      <div style={{ padding: '0 14px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 30, background: D.cyan }} />
        <div style={{ fontSize: w * 0.05, color: D.text, fontWeight: 600 }}>نشاطك</div>
        <div style={{ fontSize: w * 0.04, color: D.textSoft }}>· إعلان ممول</div>
      </div>
      <div style={{ height: w * 0.9, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>{copy.img}</div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: w * 0.075, fontWeight: 700, color: D.white, lineHeight: 1.35 }}>{copy.h}</div>
        <div
          style={{
            marginTop: 14,
            background: `linear-gradient(90deg, ${D.cyan}, ${D.blue})`,
            color: D.navy0,
            fontWeight: 700,
            fontSize: w * 0.055,
            borderRadius: 40,
            padding: '10px 0',
            textAlign: 'center',
          }}
        >
          {copy.b}
        </div>
      </div>
    </div>
  );
};

const DarkScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: 'absolute', inset: 0, background: '#081127' }}>{children}</div>
);

// ---------------------------------------------------------------- 00–04.9 hook
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const tilt = ease(frame, 0, 120);
  const scroll = mix(ease(frame, 4, 100), 0, -1450);
  const tap = ease(frame, 78, 18);
  const W = 430;
  return (
    <AbsoluteFill>
      <Title lines={['هل يصل إعلانك', <>إلى <Hl>عملائك</Hl>؟</>]} start={4} y={250} size={92} gap={10} />
      <At x={CENTER_X} y={1120 + drift(frame, 1, 6)}>
        <div style={{ transform: `perspective(1800px) rotateY(${mix(tilt, -24, -6)}deg) rotateX(${mix(tilt, 12, 4)}deg) scale(${mix(tilt, 0.92, 1)})` }}>
          <Phone width={W}>
            <DarkScreen>
              <div style={{ position: 'absolute', top: 60, left: 12, right: 12, transform: `translateY(${scroll}px)` }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <FeedPost key={i} w={W - 50} i={i} />
                ))}
              </div>
              {/* thumb tap */}
              <div
                style={{
                  position: 'absolute',
                  left: '58%',
                  top: '62%',
                  width: 90,
                  height: 90,
                  marginLeft: -45,
                  marginTop: -45,
                  borderRadius: 90,
                  border: `4px solid ${D.cyan}`,
                  opacity: tap > 0 && tap < 1 ? 1 - tap : 0,
                  transform: `scale(${mix(tap, 0.3, 1.6)})`,
                }}
              />
            </DarkScreen>
          </Phone>
          {/* glass light sweep */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: W * 0.14,
              background: `linear-gradient(115deg, transparent ${mix(ease(frame, 20, 60), -40, 120) - 15}%, rgba(255,255,255,0.18) ${mix(ease(frame, 20, 60), -40, 120)}%, transparent ${mix(ease(frame, 20, 60), -40, 120) + 15}%)`,
            }}
          />
        </div>
      </At>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 04.9–10.1 designs
const CHIPS = ['إعلانات ممولة', 'تصميم احترافي', 'استهداف مدروس'];
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = CUT.s2;
  const chipAt = [SPEECH.chip1, SPEECH.chip2, SPEECH.chip3].map((s) => F(s - t0));
  const W = 320;
  const PH = [
    { x: 250, rot: -12, s: 0.86, v: 1 as const, d: 6 },
    { x: 770, rot: 12, s: 0.86, v: 2 as const, d: 10 },
    { x: CENTER_X, rot: 0, s: 1, v: 0 as const, d: 0 },
  ];
  return (
    <AbsoluteFill>
      <div style={{ ...ar, position: 'absolute', top: 270, left: 60, right: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
        {CHIPS.map((c, i) => {
          const p = pop(frame, chipAt[i] - 3, 12);
          return (
            <React.Fragment key={c}>
              {i > 0 && <div style={{ width: 3, height: 50, borderRadius: 3, background: 'rgba(255,255,255,0.35)', opacity: p }} />}
              <Glass glow={0.6} style={{ padding: '14px 24px', borderRadius: 50, opacity: Math.min(1, p * 1.5), transform: `scale(${mix(p, 0.6, 1)})` }}>
                <div style={{ fontSize: 40, fontWeight: 700, color: i === 2 ? D.cyan : D.white, whiteSpace: 'nowrap' }}>{c}</div>
              </Glass>
            </React.Fragment>
          );
        })}
      </div>
      {PH.map((p, i) => {
        const e = pop(frame, p.d, 13);
        const focus = i === 2 ? 1 : 0;
        return (
          <At key={i} x={mix(e, CENTER_X, p.x)} y={1060 + drift(frame, i + 2, 8)}>
            <div style={{ opacity: Math.min(1, e * 1.5), transform: `rotate(${mix(e, 0, p.rot)}deg) scale(${mix(e, 0.7, p.s)})`, filter: focus ? undefined : 'brightness(0.8)' }}>
              <Phone width={W}>
                <AdDesign w={W - 20} v={p.v} />
              </Phone>
            </div>
          </At>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 10.1–15.8 targeting & inquiries
const MESSAGES = ['السلام عليكم، كم السعر؟', 'هل التوصيل متاح لبريدة؟', 'أبغى أحجز موعد'];
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = CUT.s3;
  const radar = pop(frame, 4, 14);
  const sweep = (frame * 4) % 360;
  const panel = pop(frame, 40, 13);
  const phone = pop(frame, 16, 13);
  const msgAt = [11.3, 12.7, SPEECH.s3b + 0.2].map((s) => F(s - t0));
  const dots = Array.from({ length: 12 }).map((_, i) => {
    const a = (i / 12) * 360 + (i % 3) * 11;
    const r = 70 + ((i * 53) % 140);
    return { a, r };
  });
  return (
    <AbsoluteFill>
      <Title lines={['الوصول إلى الجمهور المناسب', <>يبدأ بـ<Hl>خطة صحيحة</Hl></>]} start={4} y={240} size={66} gap={10} />
      {/* audience radar */}
      <At x={300} y={760}>
        <div style={{ width: 440, height: 440, position: 'relative', opacity: Math.min(1, radar * 1.5), transform: `scale(${mix(radar, 0.6, 1)})` }}>
          {[1, 0.7, 0.4].map((k) => (
            <div key={k} style={{ position: 'absolute', inset: `${(1 - k) * 50}%`, borderRadius: '50%', border: `2px solid rgba(56,211,245,${0.25 + k * 0.2})` }} />
          ))}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: `conic-gradient(from ${sweep}deg, rgba(56,211,245,0.45), rgba(56,211,245,0) 70deg, transparent 360deg)`,
            }}
          />
          {dots.map((d, i) => {
            const diff = (sweep - d.a + 360) % 360;
            const lit = diff < 120 ? 1 - diff / 120 : 0;
            const x = 220 + Math.cos((d.a * Math.PI) / 180) * d.r;
            const y = 220 + Math.sin((d.a * Math.PI) / 180) * d.r;
            return (
              <div
                key={i}
                style={{ position: 'absolute', left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 18, background: lit > 0.1 ? D.cyan : 'rgba(255,255,255,0.35)', boxShadow: `0 0 ${20 * lit}px ${D.cyan}` }}
              />
            );
          })}
          <div style={{ position: 'absolute', left: 220 - 44, top: 220 - 44, width: 88, height: 88, borderRadius: 88, background: D.white, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px ${D.cyan}` }}>
            <Icon name="target" size={56} color={D.blue} stroke={2.2} />
          </div>
        </div>
      </At>
      {/* campaign analysis (shapes only — no invented figures) */}
      <At x={300} y={1230}>
        <Glass style={{ ...ar, width: 420, padding: 26, opacity: Math.min(1, panel * 1.5), transform: `translateY(${mix(panel, 60, 0)}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: D.text, fontSize: 32, fontWeight: 700 }}>
            <Icon name="eye" size={36} color={D.cyan} />
            تحليل الحملة
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 150, marginTop: 20, direction: 'ltr' }}>
            {[0.45, 0.6, 0.5, 0.75, 0.9].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h * ease(frame, 50 + i * 4, 20) * 100}%`, borderRadius: 10, background: `linear-gradient(180deg, ${D.cyan}, ${D.blue})` }} />
            ))}
          </div>
        </Glass>
      </At>
      {/* customer inquiries arriving on the phone */}
      <At x={780} y={1080 + drift(frame, 3, 6)}>
        <div style={{ opacity: Math.min(1, phone * 1.5), transform: `translateY(${mix(phone, 120, 0)}px)` }}>
          <Phone width={330}>
            <DarkScreen>
              <div style={{ ...ar, position: 'absolute', top: 54, left: 0, right: 0, textAlign: 'center', color: D.text, fontWeight: 700, fontSize: 24, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                الرسائل
              </div>
              <div style={{ ...ar, position: 'absolute', top: 120, left: 14, right: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {MESSAGES.map((m, i) => {
                  const p = pop(frame, msgAt[i], 12);
                  return (
                    <div
                      key={m}
                      style={{
                        alignSelf: 'flex-start',
                        maxWidth: '88%',
                        background: i === 2 ? D.blue : 'rgba(255,255,255,0.12)',
                        color: D.white,
                        fontSize: 22,
                        fontWeight: 500,
                        lineHeight: 1.5,
                        padding: '10px 14px',
                        borderRadius: 18,
                        opacity: Math.min(1, p * 1.5),
                        transform: `scale(${mix(p, 0.6, 1)})`,
                        transformOrigin: 'right top',
                      }}
                    >
                      <div style={{ fontSize: 16, color: D.cyanSoft, marginBottom: 2 }}>استفسار جديد</div>
                      {m}
                    </div>
                  );
                })}
              </div>
            </DarkScreen>
          </Phone>
        </div>
      </At>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 15.8–22.9 Saudi businesses → kingdom-wide
const BIZ: { label: string; icon: IconName; node: React.ReactNode }[] = [
  { label: 'متجر', icon: 'store', node: <Storefront width={600} variant={0} /> },
  {
    label: 'مقهى',
    icon: 'box',
    node: (
      <div style={{ position: 'relative' }}>
        <Storefront width={600} variant={2} />
        <div style={{ position: 'absolute', right: 20, bottom: 10, width: 170, height: 170, borderRadius: 30, overflow: 'hidden', border: '6px solid white' }}>
          <ProductShot width={170} kind="cup" />
        </div>
      </div>
    ),
  },
  { label: 'نشاط خدمي', icon: 'edit', node: <Storefront width={600} variant={1} /> },
];
// Approximate relative positions only (not a map).
const CITIES = [
  { n: 'بريدة', x: 520, y: 880, main: true },
  { n: 'الرياض', x: 650, y: 1050 },
  { n: 'الدمام', x: 860, y: 960 },
  { n: 'جدة', x: 250, y: 1150 },
  { n: 'المدينة', x: 330, y: 930 },
  { n: 'تبوك', x: 240, y: 720 },
  { n: 'أبها', x: 420, y: 1300 },
  { n: 'حائل', x: 430, y: 760 },
];
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = CUT.s4;
  // three cards evenly across the first part of the sentence, then the reach network
  const switches = [F(SPEECH.s4a - t0), F(17.3 - t0), F(18.75 - t0)];
  const active = frame >= switches[2] ? 2 : frame >= switches[1] ? 1 : 0;
  const netAt = F(SPEECH.s4c - t0);
  const out = move(frame, netAt - 10, 16);
  const pos = mix(move(frame, switches[1] - 6, 14), 0, 1) + mix(move(frame, switches[2] - 6, 14), 0, 1);
  return (
    <AbsoluteFill>
      <Title lines={[<>من <Hl>بريدة والقصيم</Hl></>, 'إلى جميع أنحاء المملكة']} start={6} y={240} size={78} gap={10} />
      <div style={{ opacity: 1 - out, transform: `scale(${mix(out, 1, 0.8)})` }}>
        {BIZ.map((b, i) => {
          const off = i - pos;
          const p = pop(frame, i === 0 ? 2 : switches[i] - 6, 14);
          return (
            <At key={b.label} x={CENTER_X + off * 640} y={980}>
              <div style={{ opacity: Math.min(1, p * 1.5) * (1 - Math.min(1, Math.abs(off)) * 0.6), transform: `scale(${mix(Math.min(1, Math.abs(off)), 1, 0.8)})` }}>
                <Glass glow={i === active ? 0.7 : 0.2} style={{ padding: 16, borderRadius: 40 }}>
                  <div style={{ borderRadius: 28, overflow: 'hidden', width: 600, height: 420 }}>{b.node}</div>
                  <div style={{ ...ar, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '16px 0 4px', color: D.white, fontSize: 46, fontWeight: 700 }}>
                    <Icon name={b.icon} size={46} color={D.cyan} />
                    {b.label}
                  </div>
                </Glass>
              </div>
            </At>
          );
        })}
      </div>
      {/* kingdom-wide reach network */}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {CITIES.slice(1).map((c, i) => {
          const p = ease(frame, netAt + 4 + i * 4, 16);
          return (
            <path
              key={c.n}
              d={`M${CITIES[0].x} ${CITIES[0].y} Q ${(CITIES[0].x + c.x) / 2} ${Math.min(CITIES[0].y, c.y) - 90}, ${c.x} ${c.y}`}
              stroke={D.cyan}
              strokeWidth={4}
              fill="none"
              opacity={0.8}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
              style={{ filter: `drop-shadow(0 0 8px ${D.cyan})` }}
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
                <div style={{ position: 'absolute', top: -20, width: 80, height: 80, borderRadius: 80, border: `3px solid ${D.cyan}`, opacity: 1 - pulse, transform: `scale(${mix(pulse, 0.5, 2)})` }} />
              )}
              <div style={{ width: c.main ? 40 : 22, height: c.main ? 40 : 22, borderRadius: 40, background: c.main ? D.white : D.cyan, boxShadow: `0 0 24px ${D.cyan}` }} />
              <div style={{ marginTop: 10, fontSize: c.main ? 44 : 32, fontWeight: c.main ? 700 : 600, color: c.main ? D.white : D.text }}>{c.n}</div>
            </div>
          </At>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 22.9–30 brand & contact
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = CUT.s5;
  const logo = pop(frame, 4, 13);
  const brandPulse = ease(frame, F(SPEECH.brand - t0), 10) * (1 - ease(frame, F(SPEECH.brand - t0) + 10, 14));
  const contact = pop(frame, F(SPEECH.contact - t0) - 4, 12);
  return (
    <AbsoluteFill>
      {/* rotating sky-cyan light rays */}
      <At x={CENTER_X} y={640}>
        <div
          style={{
            width: 1500,
            height: 1500,
            borderRadius: '50%',
            background: `repeating-conic-gradient(from ${frame * 0.6}deg, rgba(56,211,245,0.16) 0deg 8deg, transparent 8deg 30deg)`,
            maskImage: 'radial-gradient(circle, black 10%, transparent 60%)',
            opacity: ease(frame, 0, 20),
          }}
        />
      </At>
      <At x={CENTER_X} y={640}>
        <div style={{ opacity: Math.min(1, logo * 1.5), transform: `scale(${mix(logo, 0.6, 1) * (1 + brandPulse * 0.06)})` }}>
          <div style={{ background: 'rgba(255,255,255,0.96)', borderRadius: 48, padding: '30px 46px', boxShadow: `0 0 ${60 + brandPulse * 60}px rgba(56,211,245,0.55), 0 30px 60px -20px rgba(0,0,0,0.6)` }}>
            <Logo width={420} />
          </div>
        </div>
      </At>
      <Title lines={['اجعل إعلانك بداية', <Hl key="h">لفرص جديدة</Hl>]} start={F(SPEECH.s5a - t0)} y={930} size={74} gap={8} />
      <At x={CENTER_X} y={1240}>
        <div style={{ ...ar, fontSize: 84, fontWeight: 700, color: D.white, opacity: Math.min(1, contact * 1.5), transform: `scale(${mix(contact, 0.7, 1)})`, textShadow: `0 0 30px ${D.cyan}` }}>
          تواصل الآن
        </div>
      </At>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- composition
const SCENES: { from: number; to: number; C: React.FC; exit?: number }[] = [
  { from: 0, to: F(CUT.s2), C: S1, exit: 1.3 },
  { from: F(CUT.s2), to: F(CUT.s3), C: S2 },
  { from: F(CUT.s3), to: F(CUT.s4), C: S3 },
  { from: F(CUT.s4), to: F(CUT.s5), C: S4 },
  { from: F(CUT.s5), to: ADS30.frames, C: S5 },
];

const SFX: { f: string; t: number; v: number }[] = [
  ...[CUT.s2, CUT.s3, CUT.s4, CUT.s5].map((t) => ({ f: 'whoosh', t: t - 0.25, v: 0.22 })),
  ...[SPEECH.chip1, SPEECH.chip2, SPEECH.chip3].map((t) => ({ f: 'pop', t: t - 0.08, v: 0.25 })),
  ...[11.3, 12.7, SPEECH.s3b + 0.2].map((t) => ({ f: 'ping', t, v: 0.3 })),
  { f: 'chime', t: SPEECH.brand - 0.1, v: 0.3 },
];

export const ZediaAds30: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: D.navy0 }}>
    <DarkBackground />
    {SCENES.map(({ from, to, C, exit }, i) => {
      const last = i === SCENES.length - 1;
      const dur = to - from;
      return (
        <Sequence key={i} from={from} durationInFrames={last ? dur : dur + OVERLAP}>
          <SceneShell duration={last ? dur + 100 : dur} overlap={OVERLAP} exitScale={exit ?? 1.06}>
            <C />
          </SceneShell>
        </Sequence>
      );
    })}
    <Sequence from={F(SPEECH.contact) + 6} durationInFrames={ADS30.frames - F(SPEECH.contact) - 6} name="call button">
      <NumberBar y={1420} />
    </Sequence>

    {/* voiceover exactly as supplied, from frame 0 */}
    <Audio src={staticFile('ads30/voiceover.mp3')} />
    <Audio src={staticFile('ads30/music.mp3')} volume={0.075} />
    {SFX.map((s, i) => (
      <Sequence key={i} from={Math.max(0, F(s.t))} durationInFrames={F(1.8)}>
        <Audio src={staticFile(`ads30/sfx-${s.f}.wav`)} volume={s.v} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
