"""Synthesise the background music used by the ad.

Everything here is generated from scratch (no samples), so the output is
original material owned by the project and needs no third-party licence.

Usage: python3 scripts/generate-audio.py [duration_seconds]
Writes to public/audio/.
"""
import os
import subprocess
import sys
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
rng = np.random.default_rng(7)


def write_wav(name, stereo):
    stereo = np.clip(stereo, -1, 1)
    data = (stereo * 32767).astype("<i2")
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def to_stereo(mono, width=0.0):
    return np.stack([mono * (1 - width), mono * (1 + width)], axis=1)


def env_adsr(n, a, d, s, r):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    sus = max(n - a - d - r, 0)
    e = np.concatenate([
        np.linspace(0, 1, a, endpoint=False),
        np.linspace(1, s, d, endpoint=False),
        np.full(sus, s),
        np.linspace(s, 0, r),
    ])
    return np.pad(e, (0, max(0, n - len(e))))[:n]


def lowpass(x, cutoff):
    # one-pole low-pass, good enough for soft pads
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


# ---------------------------------------------------------------- music
def music(duration):
    bpm = 100
    beat = 60 / bpm
    bar = beat * 4
    n = int(duration * SR)
    mix = np.zeros((n, 2))
    t_all = np.arange(n) / SR

    # Cmaj9 – Am7 – Fmaj7 – G6sus : bright, calm, modern
    chords = [
        [48, 55, 64, 67, 74],
        [45, 52, 60, 64, 67],
        [41, 48, 57, 64, 69],
        [43, 50, 59, 62, 64],
    ]
    bars = int(np.ceil(duration / bar))

    # pads
    for b in range(bars):
        start = int(b * bar * SR)
        length = int(bar * SR * 1.15)
        seg_t = np.arange(length) / SR
        pad = np.zeros(length)
        for note in chords[b % 4]:
            f = midi(note + 12)
            for det in (-0.08, 0.08):
                pad += np.sin(2 * np.pi * f * (1 + det / 100) * seg_t)
        pad *= env_adsr(length, 0.6, 0.4, 0.75, 0.9) * 0.022
        end = min(start + length, n)
        mix[start:end] += to_stereo(pad[: end - start], 0.15)

    # plucked arpeggio (eighth notes)
    pattern = [0, 2, 3, 4, 2, 3, 1, 3]
    for b in range(bars):
        notes = chords[b % 4]
        for i, idx in enumerate(pattern):
            start = int((b * bar + i * beat / 2) * SR)
            if start >= n:
                break
            length = int(0.45 * SR)
            seg_t = np.arange(length) / SR
            f = midi(notes[idx] + 12)
            tone = np.sin(2 * np.pi * f * seg_t) + 0.3 * np.sin(4 * np.pi * f * seg_t)
            tone *= np.exp(-seg_t * 9) * 0.05
            pan = 0.25 if i % 2 else -0.25
            end = min(start + length, n)
            mix[start:end] += to_stereo(tone[: end - start], pan)

    # soft kick on 1 and 3, light hat on off-beats, bass on chord root
    for b in range(bars):
        for k in range(4):
            start = int((b * bar + k * beat) * SR)
            if start >= n:
                break
            if k in (0, 2):
                length = int(0.35 * SR)
                seg_t = np.arange(length) / SR
                freq = 50 + 70 * np.exp(-seg_t * 30)
                kick = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-seg_t * 11) * 0.16
                end = min(start + length, n)
                mix[start:end] += to_stereo(kick[: end - start])
            hs = start + int(beat / 2 * SR)
            if hs < n:
                length = int(0.06 * SR)
                hat = rng.standard_normal(length)
                hat = np.diff(np.concatenate([[0], hat])) * np.exp(-np.arange(length) / SR * 70) * 0.018
                end = min(hs + length, n)
                mix[hs:end] += to_stereo(hat[: end - hs], 0.3)
        start = int(b * bar * SR)
        length = int(bar * SR)
        seg_t = np.arange(length) / SR
        f = midi(chords[b % 4][0] - 12)
        bass = np.sin(2 * np.pi * f * seg_t) * env_adsr(length, 0.02, 0.3, 0.6, 0.3) * 0.07
        end = min(start + length, n)
        mix[start:end] += to_stereo(bass[: end - start])

    # gentle intro swell and outro fade
    fade = np.ones(n)
    fi, fo = int(1.5 * SR), int(3.5 * SR)
    fade[:fi] = np.linspace(0, 1, fi)
    fade[-fo:] = np.linspace(1, 0, fo)
    mix *= fade[:, None]
    mix /= np.max(np.abs(mix)) / 0.7
    return mix


if __name__ == "__main__":
    duration = float(sys.argv[1]) if len(sys.argv) > 1 else 105
    os.makedirs(OUT, exist_ok=True)
    write_wav("music.wav", music(duration))
    # keep the repo light: encode the long music bed to MP3
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(OUT, "music.wav"),
                    "-b:a", "192k", os.path.join(OUT, "music.mp3")], check=True)
    os.remove(os.path.join(OUT, "music.wav"))
    print("audio written to", os.path.abspath(OUT))
