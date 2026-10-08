import { Easing, interpolate, spring } from 'remotion';
import { VIDEO } from './config';

const smooth = Easing.bezier(0.22, 1, 0.36, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0→1 eased progress from `start` over `dur` frames. */
export const ease = (frame: number, start: number, dur = 18) =>
  interpolate(frame, [start, start + dur], [0, 1], { easing: smooth, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** 0→1 symmetric in-out progress, for moves between two positions. */
export const move = (frame: number, start: number, dur = 24) =>
  interpolate(frame, [start, start + dur], [0, 1], { easing: inOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** Spring with a small, controlled overshoot — used for cards popping in. */
export const pop = (frame: number, start: number, damping = 13) =>
  spring({ frame: frame - start, fps: VIDEO.fps, config: { damping, mass: 0.7, stiffness: 120 } });

/** Calm spring, no visible bounce. */
export const settle = (frame: number, start: number) =>
  spring({ frame: frame - start, fps: VIDEO.fps, config: { damping: 200 } });

export const mix = (p: number, a: number, b: number) => a + (b - a) * p;

/** Slow deterministic float for idle depth (amplitude in px). */
export const drift = (frame: number, seed: number, amp = 6, period = 150) =>
  Math.sin(((frame + seed * 37) / period) * Math.PI * 2) * amp;
