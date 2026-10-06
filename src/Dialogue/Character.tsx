import React from "react";
import { C } from "../ShippingAd";

export type Speaker = "A" | "B";

const SKIN = "#6b4226";
const SKIN_DARK = "#4f2f1b";
const CLOTH = "#f6f3ec";
const CLOTH_SHADE = "#dcd6c8";

/**
 * Flat-style Sudanese character (bust).
 * A = the one asking: white jalabiya + taqiyah cap, curious brows.
 * B = the one answering: white imma (turban) + shawl in brand colours, moustache.
 * `level` (0..1) is the live voice loudness and opens the mouth.
 */
export const Character: React.FC<{ who: Speaker; level: number; active: boolean; frame: number }> = ({ who, level, active, frame }) => {
  const seed = who === "A" ? 0 : 37;
  const blink = (frame + seed) % 105 < 4;
  const open = active ? Math.min(1, level * 1.3) : 0;
  const bob = Math.sin((frame + seed) / 14) * 4 + (active ? Math.sin(frame / 4) * 2 * open : 0);
  const tilt = active ? Math.sin(frame / 9) * 2.5 : Math.sin((frame + seed) / 30) * 0.8;
  const ring = who === "A" ? C.gold : C.blue;
  const browLift = who === "A" && active ? 6 : 0;

  return (
    <div style={{ position: "relative", width: 360, height: 500, transform: `scale(${(active ? 1 : 0.93) * 1.25})`, transformOrigin: "bottom center", filter: active ? "none" : "saturate(.75) brightness(.9)", transition: "none" }}>
      {/* speaker glow */}
      <div style={{ position: "absolute", left: 30, top: 40, width: 300, height: 300, borderRadius: 150, background: ring, opacity: active ? 0.45 : 0.12, filter: "blur(30px)" }} />
      <svg viewBox="0 0 360 500" width={360} height={500} style={{ position: "absolute", inset: 0, transform: `translateY(${bob}px) rotate(${tilt}deg)`, transformOrigin: "50% 90%" }}>
        {/* body / jalabiya */}
        <path d="M40 500 C 50 375, 110 318, 180 318 C 250 318, 310 375, 320 500 Z" fill={CLOTH} />
        <path d="M180 332 C 250 332, 310 380, 320 500 L 260 500 C 255 420, 230 360, 180 345 Z" fill={CLOTH_SHADE} opacity={0.6} />
        {/* neck opening */}
        <path d="M150 318 Q180 365 210 318" fill={SKIN_DARK} />
        <path d="M180 360 V 430" stroke={CLOTH_SHADE} strokeWidth={4} />
        {who === "B" && (
          /* shawl (tobe) over the shoulder with Sudan / brand stripes */
          <g>
            <path d="M70 410 C 110 350, 230 340, 300 400 L 312 440 C 240 380, 120 390, 82 450 Z" fill={C.navy} />
            <path d="M76 428 C 118 370, 232 362, 305 418" stroke={C.gold} strokeWidth={6} fill="none" />
            <path d="M80 442 C 120 386, 232 378, 309 432" stroke={C.red} strokeWidth={4} fill="none" />
          </g>
        )}
        {/* neck */}
        <rect x="158" y="262" width="44" height="60" rx="16" fill={SKIN_DARK} />
        {/* ears */}
        <ellipse cx="100" cy="200" rx="14" ry="22" fill={SKIN_DARK} />
        <ellipse cx="260" cy="200" rx="14" ry="22" fill={SKIN_DARK} />
        {/* head */}
        <ellipse cx="180" cy="195" rx="80" ry="92" fill={SKIN} />
        {/* headwear */}
        {who === "A" ? (
          <g>
            <path d="M104 150 C 106 92, 254 92, 256 150 Z" fill={C.white} />
            <path d="M104 150 L 256 150" stroke="#e3ddd0" strokeWidth={8} />
            {[0, 1, 2, 3, 4].map((i) => (
              <path key={i} d={`M${128 + i * 26} 132 l8 -10 l8 10`} stroke={C.gold} strokeWidth={3} fill="none" />
            ))}
          </g>
        ) : (
          <g>
            <ellipse cx="180" cy="128" rx="104" ry="52" fill={C.white} />
            <ellipse cx="180" cy="104" rx="88" ry="44" fill="#f2efe8" />
            <path d="M84 132 C 130 92, 230 92, 276 132" stroke="#e1dbcd" strokeWidth={6} fill="none" />
            <path d="M98 112 C 140 76, 220 76, 262 112" stroke="#e1dbcd" strokeWidth={5} fill="none" />
            <path d="M120 90 C 150 66, 210 66, 240 90" stroke="#e1dbcd" strokeWidth={4} fill="none" />
          </g>
        )}
        {/* brows */}
        <path d={`M132 ${172 - browLift} q 16 -10 32 0`} stroke="#1d120c" strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d={`M196 ${172 - browLift * (who === "A" ? 0.4 : 1)} q 16 -10 32 0`} stroke="#1d120c" strokeWidth={6} fill="none" strokeLinecap="round" />
        {/* eyes */}
        {[148, 212].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={195} rx={13} ry={blink ? 1.5 : 14} fill={C.white} />
            {!blink && <circle cx={x + (who === "A" ? -3 : 3)} cy={197} r={7} fill="#1d120c" />}
          </g>
        ))}
        {/* nose */}
        <path d="M180 205 q -10 22 0 26 q 8 2 12 -3" stroke={SKIN_DARK} strokeWidth={4} fill="none" strokeLinecap="round" />
        {/* beard / moustache */}
        {who === "B" ? (
          <path d="M146 246 q 34 -16 68 0 q -34 6 -68 0 Z" fill="#1d120c" />
        ) : (
          <path d="M120 230 Q 125 285 180 290 Q 235 285 240 230 Q 230 270 180 274 Q 130 270 120 230 Z" fill="#2a1a12" opacity={0.55} />
        )}
        {/* mouth */}
        <ellipse cx="180" cy={258} rx={15 + open * 5} ry={3 + open * 15} fill="#3a1410" />
        {open > 0.25 && <ellipse cx="180" cy={258 + open * 9} rx={9} ry={4 * open} fill="#c0504d" />}
      </svg>
    </div>
  );
};
