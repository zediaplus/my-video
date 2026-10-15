"""Cut the voiceover to ~40s: drop filler phrases and tighten pauses.

Writes public/voiceover-cut.wav and src/voice-map.json (old→new time anchors
used by src/timing.ts to remap every cue)."""
import json, os, subprocess
import numpy as np

ROOT = os.path.join(os.path.dirname(__file__), "..")
SR = 44100
PAD_IN, PAD_OUT = 0.04, 0.07

# Spoken phrases in the original file (seconds) and whether to keep them.
PHRASES = [
    (0.06, 1.50, True),   # أي مقاس تحتاج للطباعة؟
    (2.02, 3.60, True),   # خلّينا نرتّبها لك خطوة خطوة
    (4.26, 5.26, False),  # نبدأ بالأساس
    (5.56, 6.66, True),   # مقاس A0
    (7.22, 9.12, True),   # مساحته متر مربع كامل
    (9.74, 11.20, False), # وسرّ السلسلة كلها بسيط
    (11.70, 14.72, True), # كلما نطوي الورق نصفين…
    (15.16, 15.66, True), (16.20, 16.78, True), (17.16, 17.84, True),  # A1 A2 A3
    (18.14, 19.68, True), # وهنا المقاس الأشهر
    (20.08, 20.70, True), # A4
    (21.16, 23.56, True), # للمستندات والعروض والمطبوعات اليومية
    (24.04, 24.50, False),# ونكمل
    (24.90, 25.58, True), (25.94, 26.40, True),  # A5 وA6
    (27.08, 27.70, True), # أما الكروت
    (28.10, 30.40, True), # كرت الأعمال 9×5
    (30.90, 34.28, True), # وكرت 14×10 للبطاقات والعروض
    (34.74, 37.04, True), # وللعبوات عندنا استيكرات دائرية
    (37.52, 37.92, True), (38.14, 38.68, True), (38.86, 39.96, True), (40.24, 40.70, True), (41.00, 42.00, True),
    (42.52, 44.02, False),# اختر الحجم المناسب لعبوتك
    (44.58, 46.14, True), (46.36, 46.78, True),  # تكوين للطباعة الرقمية، بريدة
    (47.08, 47.96, True), (48.34, 48.98, True),  # قل لنا مقاسك… وعلينا الباقي
]
GAP = 0.12          # silence between phrases (on top of the padding)
SCENE_GAP = 0.3    # before a new scene
SCENE_STARTS = {5.56, 11.70, 27.08, 34.74, 44.58, 47.08}

raw = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", os.path.join(ROOT, "public", "voiceover.mp3"), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
    capture_output=True, check=True,
).stdout
a = np.frombuffer(raw, dtype=np.float32)

out, anchors, t_new = [], [], 0.0
kept = [p for p in PHRASES if p[2]]
for k, (s, e, _) in enumerate(kept):
    if k:
        gap = SCENE_GAP if s in SCENE_STARTS else GAP
        out.append(np.zeros(int(gap * SR), np.float32)); t_new += gap
    s0, e0 = max(0.0, s - PAD_IN), e + PAD_OUT
    piece = a[int(s0 * SR):int(e0 * SR)].copy()
    f = int(0.015 * SR)
    piece[:f] *= np.linspace(0, 1, f); piece[-f:] *= np.linspace(1, 0, f)
    anchors += [[round(s0, 3), round(t_new, 3)], [round(e0, 3), round(t_new + len(piece) / SR, 3)]]
    out.append(piece); t_new += len(piece) / SR

y = np.concatenate(out)
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", os.path.join(ROOT, "public", "voiceover-cut.wav")],
    input=y.tobytes(), check=True,
)
json.dump({"duration": round(t_new, 3), "anchors": anchors}, open(os.path.join(ROOT, "src", "voice-map.json"), "w"))
print("new duration", round(t_new, 2))
