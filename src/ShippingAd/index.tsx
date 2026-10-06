import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "@fontsource/cairo/arabic-700.css";
import "@fontsource/cairo/arabic-800.css";
import "@fontsource/cairo/arabic-900.css";
import "@fontsource/cairo/latin-900.css";

const fontFamily = "Cairo";

// Brand colours taken from the shop logo / wall banner, plus Sudan flag accents.
export const C = {
  navy: "#0f2a5c",
  blue: "#2257b8",
  gold: "#d9a93a",
  red: "#d21034",
  green: "#007229",
  white: "#ffffff",
  black: "#0b0b0b",
};

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);
const SRC = staticFile("media/source.mp4");

// Safe area for Reels: keep important content away from edges and the bottom UI.
const SAFE = { top: 220, bottom: 420, side: 80 };

/* ---------------- shared pieces ---------------- */

const Clip: React.FC<{
  from: number; // seconds into the source video
  zoom?: [number, number];
  dim?: number;
  blur?: number;
}> = ({ from, zoom = [1.05, 1.15], dim = 0.25, blur = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const z = interpolate(frame, [0, durationInFrames], zoom);
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <OffthreadVideo
        src={SRC}
        muted
        trimBefore={s(from)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${z})`,
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: `rgba(8,20,45,${dim})` }} />
    </AbsoluteFill>
  );
};

const Photo: React.FC<{
  src: string;
  zoom?: [number, number];
  pan?: [number, number];
  origin?: string;
  dim?: number;
}> = ({ src, zoom = [1.1, 1.25], pan = [0, -40], origin = "50% 50%", dim = 0.25 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: origin,
          transform: `scale(${zoom[0] + (zoom[1] - zoom[0]) * p}) translateX(${pan[0] + (pan[1] - pan[0]) * p}px)`,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: `rgba(8,20,45,${dim})` }} />
    </AbsoluteFill>
  );
};

// Sudan flag stripe (red / white / black + green triangle) used as a recurring accent.
const SudanStripe: React.FC<{ width?: number; delay?: number }> = ({ width = 420, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const h = 12;
  return (
    <div
      style={{
        position: "relative",
        width: width * p,
        height: h * 3,
        overflow: "hidden",
        borderRadius: 6,
        boxShadow: "0 6px 18px rgba(0,0,0,.35)",
      }}
    >
      <div style={{ height: h, background: C.red }} />
      <div style={{ height: h, background: C.white }} />
      <div style={{ height: h, background: C.black }} />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 0,
          height: 0,
          borderTop: `${(h * 3) / 2}px solid transparent`,
          borderBottom: `${(h * 3) / 2}px solid transparent`,
          borderRight: `${h * 3}px solid ${C.green}`,
        }}
      />
    </div>
  );
};

const Headline: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  bg?: string;
}> = ({ text, delay = 0, size = 92, color = C.white, bg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.7 } });
  return (
    <div
      dir="rtl"
      style={{
        fontFamily,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.35,
        color,
        textAlign: "center",
        opacity: interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${(1 - p) * 60}px) scale(${0.85 + 0.15 * p})`,
        textShadow: bg ? undefined : "0 6px 24px rgba(0,0,0,.65)",
        background: bg,
        padding: bg ? "10px 40px" : undefined,
        borderRadius: 24,
      }}
    >
      {text}
    </div>
  );
};

// Packing tape sweeping across the screen – used as the transition between scenes.
const TapeWipe: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 14], [1400, -1400], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 760,
          left: -300,
          width: 1700,
          height: 340,
          transform: `translateX(${x}px) rotate(-12deg)`,
          background: `repeating-linear-gradient(90deg, rgba(217,169,58,.92) 0 120px, rgba(196,150,45,.92) 120px 240px)`,
          boxShadow: "0 0 40px rgba(0,0,0,.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          fontFamily,
          fontWeight: 900,
          fontSize: 46,
          color: C.navy,
          opacity: 0.95,
        }}
        dir="rtl"
      >
        <span>نسمات الفصول</span>
        <span>✦</span>
        <span>الشحن إلى السودان</span>
        <span>✦</span>
        <span>نسمات الفصول</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- scene 1: box being taped ---------------- */

const Box: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame, fps, config: { damping: 12 } });
  const flaps = interpolate(frame, [18, 36], [70, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const tape = interpolate(frame, [38, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const W = 460;
  return (
    <div style={{ position: "relative", width: W, height: 380, transform: `translateY(${(1 - drop) * -700}px)` }}>
      {/* body */}
      <div style={{ position: "absolute", inset: 0, top: 70, background: "linear-gradient(#c8955a,#a8743f)", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
      {/* flaps */}
      <div style={{ position: "absolute", top: 40, left: 0, width: W / 2, height: 40, background: "#d6a56a", transformOrigin: "left bottom", transform: `rotate(${-flaps}deg)`, borderRadius: 6 }} />
      <div style={{ position: "absolute", top: 40, right: 0, width: W / 2, height: 40, background: "#d6a56a", transformOrigin: "right bottom", transform: `rotate(${flaps}deg)`, borderRadius: 6 }} />
      {/* tape strip */}
      <div style={{ position: "absolute", top: 40, left: W / 2 - 45, width: 90, height: 200 * tape, background: "rgba(217,169,58,.95)", borderRadius: 4, boxShadow: "0 0 0 2px rgba(15,42,92,.25) inset" }} />
      {/* brand stamp */}
      <Img src={staticFile("media/logo.jpg")} style={{ position: "absolute", bottom: 40, left: W / 2 - 120, width: 240, borderRadius: 16, opacity: interpolate(frame, [60, 75], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), mixBlendMode: "multiply" }} />
    </div>
  );
};

const Scene1: React.FC = () => (
  <AbsoluteFill>
    <Clip from={98} blur={14} dim={0.55} zoom={[1.2, 1.3]} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 70, padding: SAFE.side }}>
      <Box />
      <Sequence from={s(1.6)} layout="none">
        <Headline text="عندك حاجات داير ترسلها للسودان؟" size={84} />
      </Sequence>
      <Sequence from={s(2.2)} layout="none">
        <SudanStripe />
      </Sequence>
    </AbsoluteFill>
    <Sequence from={38}>
      <Audio src={staticFile("media/tape.wav")} volume={0.8} />
    </Sequence>
  </AbsoluteFill>
);

/* ---------------- scene 2: storefront + interior ---------------- */

const Scene2: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={s(2.6)}>
      <Clip from={131.5} dim={0.2} zoom={[1.0, 1.12]} />
    </Sequence>
    <Sequence from={s(2.6)}>
      <Clip from={8} dim={0.25} />
    </Sequence>
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: SAFE.bottom + 40 }}>
      <Sequence from={10} layout="none">
        <Headline text="شركة نسمات الفصول" size={70} color={C.white} bg={`linear-gradient(90deg, ${C.navy}, ${C.blue})`} />
      </Sequence>
      <div style={{ height: 30 }} />
      <Sequence from={s(1.4)} layout="none">
        <Headline text="من بريدة… لأهلك في السودان" size={68} />
      </Sequence>
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ---------------- scene 3: packing ---------------- */

const Scene3: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={s(3.6)}>
      <Photo src="media/3.jpg" origin="85% 50%" zoom={[1.15, 1.35]} pan={[0, -60]} dim={0.2} />
    </Sequence>
    <Sequence from={s(3.6)}>
      <Clip from={36} dim={0.3} zoom={[1.05, 1.2]} />
    </Sequence>
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: SAFE.bottom + 40, gap: 26 }}>
      <Sequence from={8} layout="none">
        <Headline text="تغليف وتجهيز" size={110} color={C.navy} bg={C.gold} />
      </Sequence>
      <Sequence from={s(2.4)} layout="none">
        <Headline text="للشحن إلى السودان" size={86} />
      </Sequence>
      <Sequence from={s(2.8)} layout="none">
        <SudanStripe width={360} />
      </Sequence>
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ---------------- scene 4: services ---------------- */

const Icon: React.FC<{ kind: string }> = ({ kind }) => {
  const p = { fill: "none", stroke: C.navy, strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, React.ReactNode> = {
    sea: (<><path {...p} d="M12 52 L20 66 H76 L86 52 Z" /><path {...p} d="M30 52 V36 H62 V52" /><path {...p} d="M44 36 V24" /><path {...p} d="M8 78 q8 -6 16 0 t16 0 t16 0 t16 0 t16 0" /></>),
    air: (<path {...p} d="M10 54 L86 30 q6 -2 4 4 L70 50 L74 78 L66 80 L56 56 L36 64 L34 74 L28 76 L24 62 L10 58 Z" />),
    pallet: (<><rect {...p} x="22" y="22" width="52" height="38" /><path {...p} d="M48 22 V60" /><path {...p} d="M14 66 H82 M14 78 H82 M20 66 V78 M48 66 V78 M76 66 V78" /></>),
    fridge: (<><rect {...p} x="28" y="10" width="40" height="76" rx="6" /><path {...p} d="M28 38 H68 M36 20 V30 M36 46 V60" /></>),
    container: (<><rect {...p} x="10" y="26" width="76" height="44" rx="3" /><path {...p} d="M24 32 V64 M36 32 V64 M48 32 V64 M60 32 V64 M72 32 V64" /></>),
    fast: (<><path {...p} d="M34 30 H70 V62 H34 Z" /><path {...p} d="M70 42 H82 L90 52 V62 H70" /><circle {...p} cx="44" cy="68" r="6" /><circle {...p} cx="78" cy="68" r="6" /><path {...p} d="M8 38 H24 M12 48 H26 M6 58 H24" /></>),
  };
  return <svg viewBox="0 0 96 96" width={120} height={120}>{paths[kind]}</svg>;
};

const ServiceCard: React.FC<{ label: string; icon: string; delay: number }> = ({ label, icon, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 13 } });
  const out = interpolate(frame, [s(3.4), s(3.66)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      dir="rtl"
      style={{
        width: 820,
        height: 230,
        display: "flex",
        alignItems: "center",
        gap: 40,
        padding: "0 50px",
        background: "rgba(255,255,255,.96)",
        borderRadius: 36,
        borderRight: `22px solid ${C.gold}`,
        boxShadow: "0 25px 60px rgba(0,0,0,.45)",
        transform: `translateX(${(1 - p) * 1100}px) scale(${0.9 + 0.1 * p})`,
        opacity: out,
      }}
    >
      <div style={{ width: 150, height: 150, borderRadius: 75, background: "#e8eefb", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${(1 - p) * -90}deg)` }}>
        <Icon kind={icon} />
      </div>
      <div style={{ fontFamily, fontWeight: 900, fontSize: 92, color: C.navy }}>{label}</div>
    </div>
  );
};

const PAIRS: [string, string, string, string][] = [
  ["شحن بحري", "sea", "شحن جوي", "air"],
  ["شحن طبالي", "pallet", "شحن برادات", "fridge"],
  ["شحن كونتينرات", "container", "شحن سريع", "fast"],
];
const PAIR_LEN = s(11 / 3);

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Clip from={58} dim={0.5} blur={6} zoom={[1.1, 1.3]} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.navy}cc, transparent 35%, transparent 65%, ${C.navy}ee)` }} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: SAFE.top + 20 }}>
        <Headline text="خدماتنا" size={96} color={C.gold} />
        <div style={{ marginTop: 10 }}>
          <SudanStripe width={300} delay={6} />
        </div>
      </AbsoluteFill>
      {PAIRS.map(([a, ia, b, ib], i) => (
        <Sequence key={a} from={i * PAIR_LEN} durationInFrames={PAIR_LEN}>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 50, paddingTop: 80 }}>
            <ServiceCard label={a} icon={ia} delay={0} />
            <ServiceCard label={b} icon={ib} delay={7} />
          </AbsoluteFill>
          <Audio src={staticFile("media/whoosh.wav")} volume={0.5} />
        </Sequence>
      ))}
      {/* progress dots */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: SAFE.bottom + 20 }}>
        <div style={{ display: "flex", gap: 18 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: Math.floor(frame / PAIR_LEN) === i ? 60 : 20, height: 20, borderRadius: 10, background: Math.floor(frame / PAIR_LEN) === i ? C.gold : "rgba(255,255,255,.6)" }} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- scene 5: location ---------------- */

const Pin: React.FC = () => {
  const frame = useCurrentFrame();
  const bounce = Math.abs(Math.sin(frame / 8)) * 18;
  return (
    <svg width={130} height={130} viewBox="0 0 24 24" style={{ transform: `translateY(${-bounce}px)`, filter: "drop-shadow(0 8px 12px rgba(0,0,0,.5))" }}>
      <path d="M12 2C8 2 5 5 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-4-3-7-7-7z" fill={C.red} />
      <circle cx="12" cy="9" r="3" fill={C.white} />
    </svg>
  );
};

const Scene5: React.FC = () => (
  <AbsoluteFill>
    <Clip from={127} dim={0.2} zoom={[1.0, 1.1]} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 45%, ${C.navy}f0 85%)` }} />
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: SAFE.bottom + 20, gap: 14 }}>
      <Pin />
      <Sequence from={8} layout="none">
        <Headline text="القصيم – بريدة – السادة" size={80} />
      </Sequence>
      <Sequence from={22} layout="none">
        <Headline text="مقابل ملتقى الخبازين" size={74} color={C.navy} bg={C.gold} />
      </Sequence>
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ---------------- scene 6: CTA card ---------------- */

const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame, fps, config: { damping: 16 } });
  // Card settles within ~1s and then stays completely still (last 5+ seconds static).
  const pulse = 1;
  return (
    <AbsoluteFill>
      <Clip from={8} blur={16} dim={0.55} zoom={[1.2, 1.2]} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 120 }}>
        <div
          dir="rtl"
          style={{
            width: 900,
            padding: "60px 50px 50px",
            background: C.white,
            borderRadius: 48,
            boxShadow: "0 40px 90px rgba(0,0,0,.55)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            transform: `scale(${0.7 + 0.3 * card})`,
            opacity: card,
            fontFamily,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Img src={staticFile("media/logo.jpg")} style={{ width: 300, borderRadius: 20, mixBlendMode: "multiply" }} />
          <div style={{ fontWeight: 900, fontSize: 52, color: C.navy }}>شركة نسمات الفصول</div>
          <div style={{ fontWeight: 800, fontSize: 64, color: C.navy, marginTop: 10 }}>جاهز ترسل شحنتك؟</div>
          <div style={{ fontWeight: 800, fontSize: 56, color: C.red }}>اتصل بأبو عفان</div>
          <div
            dir="ltr"
            style={{
              unicodeBidi: "isolate",
              fontWeight: 900,
              fontSize: 104,
              letterSpacing: 4,
              color: C.white,
              background: `linear-gradient(90deg, ${C.navy}, ${C.blue})`,
              borderRadius: 28,
              padding: "6px 36px",
              transform: `scale(${pulse})`,
              fontVariantNumeric: "tabular-nums",
              display: "flex",
              alignItems: "center",
              gap: 26,
            }}
          >
            <WhatsApp size={84} />
            <span>0500855361</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 46, color: C.navy, marginTop: 6 }}>شحن من القصيم إلى السودان</div>
          <div style={{ marginTop: 14 }}>
            <SudanStripe width={500} delay={10} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- WhatsApp mark + logo badge ---------------- */

const WhatsApp: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="16" fill="#25D366" />
    <path
      fill="#fff"
      d="M16 6.5a9.4 9.4 0 0 0-8.1 14.2L6.6 25.5l4.9-1.3A9.4 9.4 0 1 0 16 6.5zm0 17.2a7.8 7.8 0 0 1-4-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A7.8 7.8 0 1 1 16 23.7zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.4 6.4 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2 4.7 4.7 0 0 0 1 2.5 10.7 10.7 0 0 0 4.1 3.6c1.5.7 2.1.7 2.9.6a2.4 2.4 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.4-.3z"
    />
  </svg>
);

// Small brand badge kept in the top corner (inside the safe area) during the middle scenes.
const LogoBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const inP = spring({ frame, fps, config: { damping: 15 } });
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "flex-end", paddingTop: 110, paddingRight: SAFE.side - 20 }}>
      <div
        dir="rtl"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "rgba(255,255,255,.95)",
          borderRadius: 26,
          padding: "10px 22px 10px 14px",
          boxShadow: "0 10px 30px rgba(0,0,0,.35)",
          opacity: inP * out,
          transform: `translateY(${(1 - inP) * -60}px)`,
        }}
      >
        <Img src={staticFile("media/logo.jpg")} style={{ width: 120, borderRadius: 12, mixBlendMode: "multiply" }} />
        <div style={{ fontFamily, fontWeight: 900, fontSize: 34, color: C.navy, lineHeight: 1.2 }}>
          نسمات الفصول
          <div style={{ fontWeight: 700, fontSize: 22, color: C.blue }}>للتغليف والشحن إلى السودان</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- audio ---------------- */

// Voice-over lines: [start second, file]. Record each line (e.g. ElevenLabs) and save as
// public/media/vo/1.mp3 … 6.mp3, then set VOICEOVER_READY = true.
export const VOICEOVER_READY = true;
const VO: [number, number][] = [
  [0.6, 4.3],
  [5.3, 10.4],
  [10.6, 15.3],
  [17.4, 25.9],
  [28.4, 32.5],
  [33.6, 39.1],
];

const musicVolume = (f: number) => {
  const t = f / FPS;
  const fadeOut = interpolate(t, [38, 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (!VOICEOVER_READY) return 0.4 * fadeOut;
  const speaking = VO.some(([a, b]) => t > a - 0.3 && t < b + 0.3);
  return (speaking ? 0.12 : 0.35) * fadeOut;
};

/* ---------------- timeline ---------------- */

const SCENES: [React.FC, number, number][] = [
  [Scene1, 0, 5],
  [Scene2, 5, 10],
  [Scene3, 10, 17],
  [Scene4, 17, 28],
  [Scene5, 28, 33],
  [Scene6, 33, 40],
];

export const ShippingAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.navy, fontFamily }}>
    {SCENES.map(([Comp, a, b]) => (
      <Sequence key={a} from={s(a)} durationInFrames={s(b - a)}>
        <Comp />
      </Sequence>
    ))}
    {/* tape-sweep transitions centred on each cut */}
    {SCENES.slice(1).map(([, a]) => (
      <Sequence key={`t${a}`} from={s(a) - 7} durationInFrames={15}>
        <TapeWipe />
        <Audio src={staticFile("media/tape.wav")} volume={0.35} />
      </Sequence>
    ))}
    <Sequence from={s(5)} durationInFrames={s(28)}>
      <LogoBadge />
    </Sequence>
    {/* Original synthesized Sudanese-style track (scripts/make_music.py), ducked under the voice. */}
    <Audio src={staticFile("media/music.wav")} volume={musicVolume} />
    {VOICEOVER_READY &&
      VO.map(([a], i) => (
        <Sequence key={`vo${i}`} from={s(a)}>
          <Audio src={staticFile(`media/vo/${i + 1}.mp3`)} />
        </Sequence>
      ))}
  </AbsoluteFill>
);
