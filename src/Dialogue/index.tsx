import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, Clip, fontFamily, Icon, Photo, SudanStripe, WhatsApp } from "../ShippingAd";
import { Character, Speaker } from "./Character";
import envelope from "./envelope.json";

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Speaker colours: A (asks) = gold, B (answers) = blue — both from the shop logo.
export const SPEAKER = {
  A: { bg: C.gold, fg: C.navy },
  B: { bg: C.blue, fg: C.white },
};

/*
 * Dialogue lines as cut from public/media/dialogue.mp3 (single ElevenLabs file, 51s).
 * `a` = [start, end] in the audio file (cut in the silences between lines),
 * `o` = offset added to place the line on the 60s video timeline (extra breathing room
 * between turns instead of time-stretching the voice).
 */
type Line = { sp: Speaker; a: [number, number]; o: number };
const LINES: Line[] = [
  { sp: "A", a: [0, 6.13], o: 0.6 },
  { sp: "B", a: [6.13, 9.77], o: 1.0 },
  { sp: "A", a: [9.77, 12.37], o: 1.4 },
  { sp: "B", a: [12.37, 19.21], o: 1.8 },
  { sp: "A", a: [19.21, 21.72], o: 2.3 },
  { sp: "B", a: [21.72, 28.78], o: 2.8 },
  { sp: "A", a: [28.78, 31.26], o: 3.6 },
  { sp: "B", a: [31.26, 35.22], o: 4.0 },
  { sp: "A", a: [35.22, 37.23], o: 4.6 },
  { sp: "B", a: [37.23, 42.54], o: 5.0 },
  { sp: "A", a: [42.54, 45.41], o: 5.6 },
  { sp: "B", a: [45.41, 51.0], o: 6.4 },
];
/** Video time (s) of an audio timestamp inside line i. */
const V = (i: number, audioT: number) => audioT + LINES[i].o;
const lineStart = (i: number) => V(i, LINES[i].a[0]);
const lineEnd = (i: number) => V(i, LINES[i].a[1]);

const END_CARD = 51.8;

/** Loudness (0..1) of speaker `sp` at video time t — drives the mouth animation. */
const talkLevel = (sp: Speaker, t: number) => {
  for (const l of LINES) {
    if (l.sp !== sp) continue;
    const at = t - l.o;
    if (at >= l.a[0] && at < l.a[1]) return (envelope as number[])[Math.floor(at * FPS)] ?? 0;
  }
  return 0;
};
const activeSpeaker = (t: number): Speaker | null => {
  for (let i = LINES.length - 1; i >= 0; i--) {
    if (t >= lineStart(i)) return t < lineEnd(i) + 0.5 ? LINES[i].sp : null;
  }
  return null;
};

/* ---------------- subtitle bubbles (speech translation) ---------------- */

// [video start, video end, speaker, text]  — max two short lines each.
const SUBS: [number, number, Speaker, string][] = [
  [V(0, 0.9), V(0, 4.3), "A", "عندي حاجات داير أرسلها لأهلي في السودان…"],
  [V(0, 4.3), lineEnd(0) + 0.3, "A", "أبدأ من وين؟"],
  [lineStart(1), V(1, 8.6), "B", "يا خي، إنت في بريدة؟"],
  [V(1, 8.6), lineEnd(1) + 0.3, "B", "طيب اتواصل مع أبو عفان!"],
  [lineStart(2), lineEnd(2) + 0.3, "A", "أبو عفان؟ عندهم شحن للسودان؟"],
  [lineStart(3), V(3, 15.9), "B", "أي طبعاً!"],
  [V(3, 15.9), lineEnd(3) + 0.3, "B", "شوف البناسب شحنتك!"],
  [lineStart(4), lineEnd(4) + 0.3, "A", "طيب لو الحاجات كتيرة… وعندي بضاعة كمان؟"],
  [lineStart(5), V(5, 23.5), "B", "برضو عندهم!"],
  [lineStart(6), lineEnd(6) + 0.3, "A", "كدا الكلام! أنا داير أعرف أنسب خيار لحاجاتي"],
  [lineStart(7), lineEnd(7) + 0.3, "B", "بس ورّي أبو عفان حاجاتك شنو، واسأله عن التفاصيل"],
  [lineStart(8), lineEnd(8) + 0.3, "A", "تمام يا زول! مكانهم وين؟"],
  [lineStart(10), lineEnd(10) + 0.3, "A", "خلاص! هسّع بتواصل مع أبو عفان"],
  [lineStart(11), V(11, 47.2), "B", "وإنت كمان… داير ترسل للسودان؟"],
  [V(11, 47.2), lineEnd(11) + 0.6, "B", "اتصل بالرقم الظاهر قدّامك، واعرف تفاصيل شحنتك!"],
];

const Bubble: React.FC<{ sp: Speaker; text: string; dur: number }> = ({ sp, text, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const out = interpolate(frame, [dur - 6, dur], [1, 0], clamp);
  const right = sp === "A";
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: right ? "flex-end" : "flex-start", padding: "0 70px 860px" }}>
      <div
        dir="rtl"
        style={{
          position: "relative",
          maxWidth: 780,
          padding: "22px 36px",
          borderRadius: 36,
          [right ? "borderBottomRightRadius" : "borderBottomLeftRadius"]: 6,
          background: SPEAKER[sp].bg,
          color: SPEAKER[sp].fg,
          fontFamily,
          fontWeight: 800,
          fontSize: 50,
          lineHeight: 1.45,
          textAlign: "right",
          boxShadow: "0 16px 40px rgba(0,0,0,.4)",
          opacity: p * out,
          transform: `translateY(${(1 - p) * 40}px) scale(${0.8 + 0.2 * p})`,
          transformOrigin: right ? "bottom right" : "bottom left",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- centre cards ---------------- */

const Pop: React.FC<{ children: React.ReactNode; dur?: number; y?: number }> = ({ children, dur = 9999, y = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const out = interpolate(frame, [dur - 6, dur], [1, 0], clamp);
  return (
    <div style={{ opacity: Math.min(1, p * 1.5) * out, transform: `translateY(${y + (1 - p) * 50}px) scale(${0.7 + 0.3 * p})` }}>
      {children}
    </div>
  );
};

const Tag: React.FC<{ text: string; bg?: string; fg?: string; size?: number; icon?: React.ReactNode }> = ({ text, bg = C.white, fg = C.navy, size = 64, icon }) => (
  <div
    dir="rtl"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 20,
      background: bg,
      color: fg,
      fontFamily,
      fontWeight: 900,
      fontSize: size,
      padding: "14px 44px",
      borderRadius: 30,
      boxShadow: "0 18px 44px rgba(0,0,0,.4)",
      whiteSpace: "nowrap",
    }}
  >
    {icon}
    {text}
  </div>
);

const PinIcon: React.FC<{ size?: number }> = ({ size = 70 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2C8 2 5 5 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-4-3-7-7-7z" fill={C.red} />
    <circle cx="12" cy="9" r="3" fill={C.white} />
  </svg>
);

const PackIcon: React.FC = () => (
  <svg viewBox="0 0 96 96" width={120} height={120}>
    <g fill="none" stroke={C.navy} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
      <path d="M14 34 L48 20 L82 34 L82 70 L48 84 L14 70 Z" />
      <path d="M14 34 L48 48 L82 34 M48 48 V84" />
      <path d="M31 27 L65 41 V52" stroke={C.gold} strokeWidth={7} />
    </g>
  </svg>
);

const ServicePill: React.FC<{ label: string; icon: string }> = ({ label, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 13 } });
  return (
    <div
      dir="rtl"
      style={{
        width: 760,
        height: 124,
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "0 30px",
        background: "rgba(255,255,255,.97)",
        borderRadius: 30,
        borderRight: `18px solid ${C.gold}`,
        boxShadow: "0 18px 44px rgba(0,0,0,.4)",
        transform: `translateX(${(1 - p) * 900}px)`,
      }}
    >
      <div style={{ width: 100, height: 100, borderRadius: 50, background: "#e8eefb", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.8 + 0.2 * p}) rotate(${(1 - p) * -90}deg)` }}>
        <div style={{ transform: "scale(.78)" }}>{icon === "pack" ? <PackIcon /> : <Icon kind={icon} />}</div>
      </div>
      <div style={{ fontFamily, fontWeight: 900, fontSize: 64, color: C.navy }}>{label}</div>
    </div>
  );
};

// A column of service pills that appear one by one as they are spoken.
const ServiceStack: React.FC<{ items: [number, string, string][]; until: number }> = ({ items, until }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const out = interpolate(t, [until - 0.25, until], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 300, opacity: out }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {items.map(([at, label, icon]) =>
          t >= at ? (
            <Sequence key={label} from={s(at)} layout="none">
              <ServicePill label={label} icon={icon} />
            </Sequence>
          ) : null,
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- backgrounds ---------------- */

const Fade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(frame, [0, 8], [0, 1], clamp) }}>{children}</AbsoluteFill>;
};

const BG: [number, number, React.ReactNode][] = [
  [0, 7.0, <Photo key="p3a" src="media/3.jpg" origin="82% 62%" zoom={[1.7, 1.95]} pan={[0, -30]} dim={0.3} />],
  [7.0, 10.6, <Clip key="front" from={131.5} dim={0.3} zoom={[1.0, 1.1]} />],
  [10.6, 14.1, <Clip key="inside" from={8} dim={0.35} />],
  [14.1, 18.5, <Photo key="p3b" src="media/3.jpg" origin="80% 45%" zoom={[1.25, 1.4]} pan={[0, -50]} dim={0.4} />],
  [18.5, 24.4, <Clip key="poster" from={36} dim={0.45} zoom={[1.05, 1.2]} />],
  [24.4, 32.3, <Clip key="banner" from={58} dim={0.55} blur={5} zoom={[1.1, 1.25]} />],
  [32.3, 37.0, <Clip key="prep" from={26} dim={0.35} zoom={[1.1, 1.25]} />],
  [37.0, 41.9, <Clip key="sign" from={98} dim={0.4} zoom={[1.0, 1.12]} />],
  [41.9, END_CARD, <Clip key="front2" from={127} dim={0.3} zoom={[1.0, 1.1]} />],
  [END_CARD, 60, <Clip key="endbg" from={8} dim={0.55} blur={16} zoom={[1.2, 1.2]} />],
];

/* ---------------- end card ---------------- */

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
      <div
        dir="rtl"
        style={{
          width: 920,
          padding: "40px 40px 36px",
          background: C.white,
          borderRadius: 44,
          boxShadow: "0 40px 90px rgba(0,0,0,.55)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          fontFamily,
          opacity: p,
          transform: `scale(${0.8 + 0.2 * p})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Img src={staticFile("media/logo.jpg")} style={{ width: 170, borderRadius: 14, mixBlendMode: "multiply" }} />
          <div style={{ fontWeight: 900, fontSize: 40, color: C.navy, lineHeight: 1.25 }}>
            شركة نسمات الفصول
            <div style={{ fontWeight: 700, fontSize: 26, color: C.blue }}>للتغليف والشحن إلى السودان</div>
          </div>
        </div>
        <div style={{ fontWeight: 900, fontSize: 62, color: C.navy, marginTop: 6 }}>داير ترسل للسودان؟</div>
        <div style={{ fontWeight: 800, fontSize: 52, color: C.red }}>للتواصل: أبو عفان</div>
        <div
          dir="ltr"
          style={{
            unicodeBidi: "isolate",
            display: "flex",
            alignItems: "center",
            gap: 22,
            fontWeight: 900,
            fontSize: 112,
            letterSpacing: 3,
            color: C.white,
            background: `linear-gradient(90deg, ${C.navy}, ${C.blue})`,
            borderRadius: 28,
            padding: "4px 36px",
          }}
        >
          <WhatsApp size={88} />
          <span>0500855361</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 38, color: C.navy, marginTop: 4 }}>
          <PinIcon size={44} />
          بريدة – السادة – مقابل ملتقى الخبازين
        </div>
        <div style={{ marginTop: 8 }}>
          <SudanStripe width={480} delay={8} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- main ---------------- */

const Characters: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const act = activeSpeaker(t);
  const intro = spring({ frame, fps: FPS, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* soft floor gradient so the characters sit on something */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 52%, ${C.navy}e6 80%)` }} />
      <div style={{ position: "absolute", left: 70, bottom: 230, transform: `translateX(${(1 - intro) * -500}px)` }}>
        <Character who="B" level={talkLevel("B", t)} active={act === "B"} frame={frame} />
      </div>
      <div style={{ position: "absolute", right: 70, bottom: 230, transform: `translateX(${(1 - intro) * 500}px)` }}>
        <Character who="A" level={talkLevel("A", t)} active={act === "A"} frame={frame} />
      </div>
    </AbsoluteFill>
  );
};

const musicVolume = (f: number) => {
  const t = f / FPS;
  const fade = interpolate(t, [0, 0.6, 58, 60], [0, 1, 1, 0], clamp);
  const talking = LINES.some((_, i) => t > lineStart(i) - 0.2 && t < lineEnd(i) + 0.2);
  return (talking ? 0.09 : 0.26) * fade;
};

export const DialogueAd: React.FC = () => {
  const zol = V(0, 0.06);
  return (
    <AbsoluteFill style={{ backgroundColor: C.navy, fontFamily }}>
      {BG.map(([a, b, el]) => (
        <Sequence key={a} from={s(a)} durationInFrames={s(b - a) + (b === 60 ? 0 : 8)}>
          <Fade>{el}</Fade>
        </Sequence>
      ))}

      <Characters />

      {/* 0–7: «يا زول!» pop, then the question */}
      <Sequence from={s(zol)} durationInFrames={s(1.6)}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 700 }}>
          <Pop dur={s(1.6)}>
            <div dir="rtl" style={{ fontFamily, fontWeight: 900, fontSize: 190, color: C.gold, textShadow: "0 10px 40px rgba(0,0,0,.6)" }}>يا زول!</div>
          </Pop>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={s(zol + 1.4)} durationInFrames={s(lineEnd(0) + 0.4 - zol - 1.4)}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
          <Pop dur={s(lineEnd(0) + 0.4 - zol - 1.4)}>
            <Tag text="داير ترسل للسودان؟" size={78} />
          </Pop>
          <div style={{ marginTop: 26 }}><SudanStripe width={380} delay={8} /></div>
        </AbsoluteFill>
      </Sequence>

      {/* 7–14: Buraydah + contact chip */}
      <Sequence from={s(V(1, 6.9))} durationInFrames={s(lineEnd(2) - V(1, 6.9))}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 300, gap: 26 }}>
          <Pop dur={s(lineEnd(2) - V(1, 6.9))}>
            <Tag text="بريدة" size={92} icon={<PinIcon size={86} />} />
          </Pop>
          <Sequence from={s(V(1, 8.6) - V(1, 6.9))} layout="none">
            <Pop>
              <Tag text="للتواصل: أبو عفان" bg={SPEAKER.B.bg} fg={C.white} size={70} />
            </Pop>
          </Sequence>
          <Sequence from={s(V(2, 10.4) - V(1, 6.9))} layout="none">
            <Pop>
              <Tag text="شحن للسودان؟" bg={SPEAKER.A.bg} fg={C.navy} size={70} />
            </Pop>
          </Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* 14–21: packing, sea, air */}
      <Sequence  durationInFrames={s(lineEnd(3) + 0.4)}>
        <ServiceStack
          until={lineEnd(3) + 0.4}
          items={[
            [V(3, 13.0), "تغليف وتجهيز", "pack"],
            [V(3, 14.14), "شحن بحري", "sea"],
            [V(3, 14.9), "شحن جوي", "air"],
          ]}
        />
      </Sequence>

      {/* 21.5–24: big loads question */}
      <Sequence from={s(lineStart(4) + 0.2)} durationInFrames={s(lineEnd(4) - lineStart(4) + 0.3)}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 380 }}>
          <Pop dur={s(lineEnd(4) - lineStart(4) + 0.3)}>
            <Tag text="والحاجات الكتيرة؟" bg={SPEAKER.A.bg} size={84} />
          </Pop>
        </AbsoluteFill>
      </Sequence>

      {/* 24.5–31.6: pallets, fridges, containers, express */}
      <Sequence  durationInFrames={s(lineEnd(5) + 0.5)}>
        <ServiceStack
          until={lineEnd(5) + 0.5}
          items={[
            [V(5, 23.6), "شحن طبالي", "pallet"],
            [V(5, 24.85), "شحن برادات", "fridge"],
            [V(5, 26.2), "شحن كونتينرات", "container"],
            [V(5, 27.8), "شحن سريع", "fast"],
          ]}
        />
      </Sequence>

      {/* 32.3–39.2: best option / ask about details */}
      <Sequence from={s(V(6, 29.8))} durationInFrames={s(lineEnd(7) + 0.4 - V(6, 29.8))}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 330, gap: 28 }}>
          <Pop dur={s(lineEnd(7) + 0.4 - V(6, 29.8))}>
            <Tag text="شنو الخيار المناسب لشحنتك؟" size={62} />
          </Pop>
          <Sequence from={s(V(7, 33.5) - V(6, 29.8))} layout="none">
            <Pop>
              <Tag text="اسأل عن التفاصيل والمواعيد" bg={SPEAKER.B.bg} fg={C.white} size={62} />
            </Pop>
          </Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* 40–47.5: location */}
      <Sequence from={s(V(8, 36.4))} durationInFrames={s(lineEnd(9) + 0.6 - V(8, 36.4))}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 280, gap: 24 }}>
          <Pop>
            <PinIcon size={130} />
          </Pop>
          <Sequence from={s(lineStart(9) - V(8, 36.4))} layout="none">
            <Pop>
              <Tag text="القصيم – بريدة – حي السادة" size={66} />
            </Pop>
          </Sequence>
          <Sequence from={s(V(9, 40.2) - V(8, 36.4))} layout="none">
            <Pop>
              <Tag text="مقابل ملتقى الخبازين" bg={C.gold} size={70} />
            </Pop>
          </Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* 48–51.8: contact card build-up */}
      <Sequence from={s(lineStart(10))} durationInFrames={s(END_CARD - lineStart(10))}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 320, gap: 26 }}>
          <Pop dur={s(END_CARD - lineStart(10))}>
            <Tag text="أبو عفان" size={96} bg={C.white} fg={C.navy} />
          </Pop>
          <Sequence from={s(V(10, 44.0) - lineStart(10))} layout="none">
            <Pop dur={s(END_CARD - V(10, 44.0))}>
              <div dir="ltr" style={{ unicodeBidi: "isolate", display: "flex", alignItems: "center", gap: 20, fontFamily, fontWeight: 900, fontSize: 104, color: C.white, background: `linear-gradient(90deg, ${C.navy}, ${C.blue})`, padding: "6px 36px", borderRadius: 28, boxShadow: "0 18px 44px rgba(0,0,0,.4)" }}>
                <WhatsApp size={84} />
                <span>0500855361</span>
              </div>
            </Pop>
          </Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* 51.8–60: static end card, kept until the last frame */}
      <Sequence from={s(END_CARD)}>
        <EndCard />
      </Sequence>

      {/* speech bubbles */}
      {SUBS.map(([a, b, sp, text]) => (
        <Sequence key={text} from={s(a)} durationInFrames={s(b - a)}>
          <Bubble sp={sp} text={text} dur={s(b - a)} />
        </Sequence>
      ))}

      {/* ---------- audio ---------- */}
      <Audio src={staticFile("media/music60.wav")} volume={musicVolume} />
      <Audio src={staticFile("media/tape.wav")} volume={0.5} />
      {LINES.map((l, i) => (
        <Sequence key={i} from={s(lineStart(i))} durationInFrames={s(l.a[1] - l.a[0])}>
          <Audio src={staticFile("media/dialogue.mp3")} trimBefore={s(l.a[0])} trimAfter={s(l.a[1])} />
        </Sequence>
      ))}
      {/* light whoosh on every change of speaker */}
      {LINES.slice(1).map((_, i) => (
        <Sequence key={`w${i}`} from={s(lineStart(i + 1)) - 6} durationInFrames={15}>
          <Audio src={staticFile("media/whoosh.wav")} volume={0.18} />
        </Sequence>
      ))}
      {[zol, lineStart(10), V(10, 44.0)].map((t) => (
        <Sequence key={`c${t}`} from={s(t)} durationInFrames={6}>
          <Audio src={staticFile("media/click.wav")} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
