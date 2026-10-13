"""Synthesize soft SFX + a minimal music bed into public/sfx (no external services)."""
import numpy as np, wave, os
SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
rng = np.random.default_rng(7)

def save(name, x):
    x = x / (np.abs(x).max() + 1e-9) * 0.8
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def t(d): return np.arange(int(SR * d)) / SR

def lowpass(x, a):
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc); y[i] = acc
    return y

def env(n, att, rel):
    e = np.ones(n); a = int(att * SR); r = int(rel * SR)
    e[:a] = np.linspace(0, 1, a); e[-r:] *= np.linspace(1, 0, r) ** 2
    return e

# whoosh: noise with moving lowpass cutoff
d = 0.9; n = int(SR * d); x = rng.standard_normal(n); y = np.empty(n); acc = 0
cut = np.sin(np.linspace(0, np.pi, n)) * 0.12 + 0.01
for i in range(n): acc += cut[i] * (x[i] - acc); y[i] = acc
save("whoosh.wav", y * np.sin(np.linspace(0, np.pi, n)) ** 2)

# bass pulse
tt = t(1.2); save("bass.wav", np.sin(2 * np.pi * (55 - 15 * tt) * tt) * np.exp(-tt * 4) * env(len(tt), 0.01, 0.2))

# paper fold: filtered noise bursts (crinkle)
tt = t(0.5); x = rng.standard_normal(len(tt)) * (rng.random(len(tt)) < 0.25)
x = x - lowpass(x, 0.05)
save("fold.wav", lowpass(x, 0.5) * np.exp(-((tt - 0.15) / 0.12) ** 2))

# pops at rising pitches
def pop(f):
    tt = t(0.18)
    return np.sin(2 * np.pi * f * tt * (1 + 0.6 * np.exp(-tt * 40))) * np.exp(-tt * 30)
save("pop.wav", pop(520))
for i, f in enumerate([440, 523, 587, 659, 784]): save(f"pop{i+1}.wav", pop(f))

# ding
tt = t(1.4); save("ding.wav", (np.sin(2*np.pi*1318*tt) + 0.3*np.sin(2*np.pi*2636*tt)) * np.exp(-tt * 4) * env(len(tt), 0.003, 0.1))

# click
tt = t(0.06); x = rng.standard_normal(len(tt)); save("click.wav", lowpass(x, 0.3) * np.exp(-tt * 120))

# sticker peel/stick
tt = t(0.45); x = rng.standard_normal(len(tt)); x = x - lowpass(x, 0.2)
save("stick.wav", x * np.exp(-((tt - 0.12) / 0.09) ** 2) * 0.6 + np.pad(pop(260), (int(0.3*SR), 0))[: len(tt)])

# music bed: warm minimal pad + soft pluck, 100 BPM, 52s
D = 52; tt = t(D); beat = 60 / 100
chords = [[220, 277.2, 329.6], [196, 246.9, 293.7], [174.6, 220, 261.6], [196, 246.9, 329.6]]
pad = np.zeros_like(tt); bar = beat * 4
for k in range(int(D / bar) + 1):
    s = int(k * bar * SR); e = min(len(tt), int((k + 1) * bar * SR) + int(0.4 * SR))
    if s >= len(tt): break
    seg = tt[: e - s]; c = chords[k % 4]
    v = sum(np.sin(2*np.pi*f*seg) + 0.25*np.sin(2*np.pi*2*f*seg + 0.3) for f in c)
    pad[s:e] += v * env(e - s, 0.6, 0.6)
pluck = np.zeros_like(tt); notes = [440, 554.4, 659.3, 554.4, 493.9, 587.3, 659.3, 587.3]
for k in range(int(D / beat)):
    s = int(k * beat * SR); seg = tt[: int(0.5 * SR)]; e = min(len(tt), s + len(seg))
    f = notes[k % len(notes)] * (0.5 if k % 2 else 1)
    pluck[s:e] += (np.sin(2*np.pi*f*seg) * np.exp(-seg * 9))[: e - s]
mus = lowpass(pad, 0.08) * 0.5 + pluck * 0.35
save("music.wav", mus * env(len(tt), 1.5, 3.0))
print("ok")
