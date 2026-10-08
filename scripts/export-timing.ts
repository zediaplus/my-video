// Writes timing.json (scenes + captions on the video timeline) and captions.srt.
// Run: npm run timing
import fs from 'node:fs';
import { CAPTIONS_OUT, PLACED, TOTAL_FRAMES, VOICE_END_OUT, sectionFrames } from '../src/timeline';
import { VIDEO } from '../src/config';
import { stripHarakat } from '../src/components/captionText';

const r = (n: number) => Math.round(n * 1000) / 1000;
const srt = (t: number) => {
  const ms = Math.round(t * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const pad = (n: number, w = 2) => String(n).padStart(w, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms % 1000, 3)}`;
};

const timing = {
  fps: VIDEO.fps,
  totalFrames: TOTAL_FRAMES,
  totalSeconds: TOTAL_FRAMES / VIDEO.fps,
  voiceEndsAt: r(VOICE_END_OUT),
  scenes: PLACED.map((p) => ({
    id: p.id,
    start: r(sectionFrames(p.id).from / VIDEO.fps),
    end: r((sectionFrames(p.id).from + sectionFrames(p.id).duration) / VIDEO.fps),
    voiceStart: r(p.voiceOutStart),
    voiceEnd: r(p.outEnd),
    sourceIn: p.srcStart,
    sourceOut: p.srcEnd,
    pauseAddedBefore: p.gapBefore,
  })),
  captions: CAPTIONS_OUT.map((c) => ({ start: r(c.outStart), end: r(c.outEnd), sourceStart: c.start, sourceEnd: c.end, text: c.text })),
};
fs.writeFileSync('timing.json', JSON.stringify(timing, null, 2) + '\n');
fs.writeFileSync(
  'captions.srt',
  CAPTIONS_OUT.map((c, i) => `${i + 1}\n${srt(c.outStart)} --> ${srt(c.outEnd)}\n${stripHarakat(c.text)}\n`).join('\n'),
);
console.log('scenes:', timing.scenes.map((s) => `${s.id}@${s.start}`).join(' '));
console.log('voice ends at', timing.voiceEndsAt, 's of', timing.totalSeconds);
