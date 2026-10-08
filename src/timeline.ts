import { AUDIO, CAPTIONS, SECTIONS, SectionId, VIDEO } from './config';

// Map the recording's timeline (src seconds) onto a video's timeline (out seconds),
// accounting for the breathing gaps inserted before each section. Any cut of the
// recording (full ad, story, …) is just a different list of sections.

export type Section<Id extends string = string> = { id: Id; srcStart: number; srcEnd: number; gapBefore: number };
export type Placed<Id extends string> = Section<Id> & { outStart: number; voiceOutStart: number; outEnd: number };
export type Caption = (typeof CAPTIONS)[number];
export type CaptionOut = Caption & { outStart: number; outEnd: number };

export const sec = (s: number) => Math.round(s * VIDEO.fps);

export const buildTimeline = <Id extends string>(sections: Section<Id>[], totalSeconds: number) => {
  let t = 0;
  const placed: Placed<Id>[] = sections.map((s) => {
    const outStart = t;
    const voiceOutStart = outStart + s.gapBefore;
    const outEnd = voiceOutStart + (s.srcEnd - s.srcStart);
    t = outEnd;
    return { ...s, outStart, voiceOutStart, outEnd };
  });
  const totalFrames = sec(totalSeconds);
  const srcToOut = (src: number): number => {
    const s = placed.find((p) => src >= p.srcStart && src < p.srcEnd) ?? placed[placed.length - 1];
    return s.voiceOutStart + (src - s.srcStart);
  };
  const sectionFrames = (id: Id) => {
    const i = placed.findIndex((p) => p.id === id);
    const from = sec(placed[i].outStart);
    const to = i + 1 < placed.length ? sec(placed[i + 1].outStart) : totalFrames;
    return { from, duration: to - from };
  };
  // Frame (relative to the section's own start) at which a src cue is spoken.
  const cueIn = (id: Id, src: number) => sec(srcToOut(src)) - sectionFrames(id).from;
  // Only captions whose speech is inside one of the kept sections.
  const captions: CaptionOut[] = CAPTIONS.filter((c) => placed.some((p) => c.start >= p.srcStart && c.end <= p.srcEnd)).map((c) => ({
    ...c,
    outStart: srcToOut(c.start),
    outEnd: srcToOut(c.end),
  }));
  return { placed, totalFrames, srcToOut, sectionFrames, cueIn, captions };
};

// ---- the full ad ----
const MAIN = buildTimeline<SectionId>(SECTIONS, VIDEO.totalSeconds);
export const PLACED = MAIN.placed;
export const TOTAL_FRAMES = MAIN.totalFrames;
export const srcToOut = MAIN.srcToOut;
export const sectionFrames = MAIN.sectionFrames;
export const cueIn = MAIN.cueIn;
export const CAPTIONS_OUT = MAIN.captions;
export const VOICE_END_OUT = srcToOut(AUDIO.voiceDuration - 0.001);
