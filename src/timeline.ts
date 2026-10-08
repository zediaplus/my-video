import { AUDIO, CAPTIONS, SECTIONS, SectionId, VIDEO } from './config';

// Map the recording's timeline (src seconds) onto the video's timeline (out seconds),
// accounting for the breathing gaps inserted before each section.

type PlacedSection = (typeof SECTIONS)[number] & { outStart: number; voiceOutStart: number; outEnd: number };

export const PLACED: PlacedSection[] = (() => {
  let t = 0;
  return SECTIONS.map((s) => {
    const outStart = t;
    const voiceOutStart = outStart + s.gapBefore;
    const outEnd = voiceOutStart + (s.srcEnd - s.srcStart);
    t = outEnd;
    return { ...s, outStart, voiceOutStart, outEnd };
  });
})();

export const srcToOut = (src: number): number => {
  const s = PLACED.find((p) => src >= p.srcStart && src < p.srcEnd) ?? PLACED[PLACED.length - 1];
  return s.voiceOutStart + (src - s.srcStart);
};

export const sec = (s: number) => Math.round(s * VIDEO.fps);

export const TOTAL_FRAMES = sec(VIDEO.totalSeconds);

export const sectionFrames = (id: SectionId) => {
  const i = PLACED.findIndex((p) => p.id === id);
  const from = sec(PLACED[i].outStart);
  const to = i + 1 < PLACED.length ? sec(PLACED[i + 1].outStart) : TOTAL_FRAMES;
  return { from, duration: to - from };
};

// Frame (relative to the section's own start) at which a src cue is spoken.
export const cueIn = (id: SectionId, src: number) => sec(srcToOut(src)) - sectionFrames(id).from;

export const CAPTIONS_OUT = CAPTIONS.map((c) => ({ ...c, outStart: srcToOut(c.start), outEnd: srcToOut(c.end) }));

export const VOICE_END_OUT = srcToOut(AUDIO.voiceDuration - 0.001);
