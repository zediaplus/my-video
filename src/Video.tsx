import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { AUDIO, CUES, SectionId } from './config';
import { loadFonts } from './fonts';
import { PLACED, TOTAL_FRAMES, sec, sectionFrames, srcToOut } from './timeline';
import { Background } from './components/Background';
import { Captions } from './components/Captions';
import { SceneShell } from './components/ui';
import { Ads } from './scenes/Ads';
import { Brand } from './scenes/Brand';
import { Cta } from './scenes/Cta';
import { Evidence } from './scenes/Evidence';
import { Hook } from './scenes/Hook';
import { Info } from './scenes/Info';
import { Metrics } from './scenes/Metrics';
import { BrandBar, NumberBar, Outro } from './scenes/Outro';
import { Photos } from './scenes/Photos';
import { Reviews } from './scenes/Reviews';
import { Setup } from './scenes/Setup';

loadFonts();

const OVERLAP = 20;
// Logo + call bar stays on screen from the middle of the video until the final call button.
const BRAND_BAR_FROM = sectionFrames('reviews').from;

const SCENES: Record<SectionId, React.FC> = {
  hook: Hook,
  brand: Brand,
  setup: Setup,
  info: Info,
  photos: Photos,
  reviews: Reviews,
  ads: Ads,
  metrics: Metrics,
  evidence: Evidence,
  cta: Cta,
  outro: Outro,
};

// Music ducks under the voice and comes back up in the gaps and the ending.
const VOICE_RANGES = PLACED.map((p) => [sec(p.voiceOutStart), sec(p.outEnd)] as const);
const musicVolume = (f: number) => {
  let dist = Infinity;
  for (const [a, b] of VOICE_RANGES) {
    if (f >= a && f <= b) return AUDIO.musicDuckedVolume;
    dist = Math.min(dist, f < a ? a - f : f - b);
  }
  return interpolate(dist, [3, 15], [AUDIO.musicDuckedVolume, AUDIO.musicVolume], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

export const ZediaVideo: React.FC = () => {
  const numberFrom = sec(srcToOut(CUES.sendLink));
  return (
    <AbsoluteFill style={{ backgroundColor: '#F4F8FE' }}>
      <Background />

      {PLACED.map((p) => {
        const { from, duration } = sectionFrames(p.id);
        const Scene = SCENES[p.id];
        const last = p.id === 'outro';
        return (
          <Sequence key={p.id} from={from} durationInFrames={last ? duration : duration + OVERLAP} name={`scene: ${p.id}`}>
            <SceneShell duration={last ? duration + 100 : duration} overlap={OVERLAP}>
              <Scene />
            </SceneShell>
          </Sequence>
        );
      })}

      <Sequence from={BRAND_BAR_FROM} durationInFrames={numberFrom - BRAND_BAR_FROM + 12} name="brand bar">
        <BrandBar fadeOutAt={numberFrom - BRAND_BAR_FROM} />
      </Sequence>

      <Sequence from={numberFrom} durationInFrames={TOTAL_FRAMES - numberFrom} name="phone number">
        <NumberBar />
      </Sequence>

      <Captions />

      {/* voiceover: original speed, split only at natural pauses */}
      {PLACED.map((p) => (
        <Sequence key={`vo-${p.id}`} from={sec(p.voiceOutStart)} durationInFrames={sec(p.srcEnd) - sec(p.srcStart)} name={`voice: ${p.id}`}>
          <Audio src={staticFile(AUDIO.voice)} trimBefore={sec(p.srcStart)} trimAfter={sec(p.srcEnd)} />
        </Sequence>
      ))}

      <Audio src={staticFile(AUDIO.music)} volume={musicVolume} />

    </AbsoluteFill>
  );
};
