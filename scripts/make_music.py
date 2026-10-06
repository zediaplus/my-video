"""Generate an original 40s Sudanese-flavoured background track (royalty-free, synthesized).

Pentatonic melody (Sudanese music is largely pentatonic) over a 6/8 dalooka-style
drum pattern and a soft bass drone. Output: public/media/music.wav
"""
import wave

import numpy as np

SR = 44100
DUR = 40.0
BPM = 104  # dotted-quarter pulse; each beat split into 3 eighths (6/8 feel)
EIGHTH = 60 / BPM / 3
N = int(SR * DUR)
out = np.zeros(N)
rng = np.random.default_rng(7)


def add(sig, t):
    i = int(t * SR)
    if i >= N:
        return
    seg = sig[: N - i]
    out[i : i + len(seg)] += seg


def env(n, a=0.005, r=0.2):
    t = np.arange(n) / SR
    return np.minimum(t / a, 1) * np.exp(-t / r)


def doum(t):  # low drum hit
    n = int(0.35 * SR)
    tt = np.arange(n) / SR
    f = 90 * np.exp(-tt * 8) + 55
    add(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.12) * 0.9, t)


def tek(t, g=0.35):  # high slap
    n = int(0.08 * SR)
    noise = rng.standard_normal(n)
    tone = np.sin(2 * np.pi * 420 * np.arange(n) / SR)
    add((noise * 0.6 + tone * 0.4) * env(n, 0.001, 0.025) * g, t)


def shaker(t, g=0.08):
    n = int(0.05 * SR)
    add(np.diff(rng.standard_normal(n + 1)) * env(n, 0.004, 0.015) * g, t)


def pluck(freq, t, g=0.22, length=0.6):  # oud/tambour-like pluck (Karplus-Strong)
    n = int(length * SR)
    p = int(SR / freq)
    buf = rng.uniform(-1, 1, p)
    sig = np.zeros(n)
    for i in range(n):
        sig[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    add(sig * g, t)


# Pentatonic scale (A minor-pentatonic-like flavour common in Sudanese songs)
A = 220.0
scale = [A * 2 ** (s / 12) for s in [0, 3, 5, 7, 10, 12, 15, 17]]

# 6/8 dalooka pattern over 6 eighths: D . T D T .
pattern = ["D", None, "T", "D", "T", None]
melody = [4, None, 3, 2, None, 3, 4, None, 5, 4, 3, None,
          2, None, 1, 2, None, 3, 2, None, 1, 0, None, None]

t = 0.0
step = 0
while t < DUR:
    p = pattern[step % 6]
    intro = t < 1.0
    if p == "D" and not intro:
        doum(t)
    elif p == "T" and not intro:
        tek(t)
    shaker(t)
    m = melody[step % len(melody)]
    if m is not None and t > 2.0:
        pluck(scale[m], t)
        if step % 12 == 0:
            pluck(scale[m] / 2, t, g=0.15, length=1.0)
    t += EIGHTH
    step += 1

# soft bass drone on the root
tt = np.arange(N) / SR
out += 0.05 * np.sin(2 * np.pi * (A / 2) * tt) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.25 * tt))

# fades
fade = np.ones(N)
fi, fo = int(0.5 * SR), int(2.5 * SR)
fade[:fi] = np.linspace(0, 1, fi)
fade[-fo:] = np.linspace(1, 0, fo)
out *= fade
out /= np.max(np.abs(out)) * 1.1

with wave.open("public/media/music.wav", "w") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((out * 32767).astype(np.int16).tobytes())
print("wrote public/media/music.wav")
