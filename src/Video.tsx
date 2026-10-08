import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { AUDIO, CUES, SectionId, VIDEO } from './config';
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
import { NumberBar, Outro } from './scenes/Outro';
import { Photos } from './scenes/Photos';
import { Reviews } from './scenes/Reviews';
import { Setup } from './scenes/Setup';

loadFonts();

const OVERLAP = 12;

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

// Sound effects in video seconds — kept few and soft.
const at = (id: SectionId) => sectionFrames(id).from / VIDEO.fps;
const SFX: { file: string; t: number; vol?: number }[] = [
  { file: 'sfx-typing.wav', t: 0.25, vol: 0.55 },
  { file: 'sfx-whoosh.wav', t: srcToOut(CUES.showUp) - 0.2, vol: 0.3 },
  { file: 'sfx-whoosh.wav', t: at('brand') - 0.1, vol: 0.3 },
  { file: 'sfx-pop.wav', t: srcToOut(CUES.zedia) - 0.1 },
  ...[CUES.createProfile, CUES.verify, CUES.location, CUES.category].map((c) => ({ file: 'sfx-pop.wav', t: srcToOut(c) - 0.12 })),
  ...[CUES.services, CUES.description, CUES.contact, CUES.hours].map((c) => ({ file: 'sfx-click.wav', t: srcToOut(c) - 0.1, vol: 0.4 })),
  { file: 'sfx-click.wav', t: srcToOut(CUES.shoot) - 0.1, vol: 0.6 },
  { file: 'sfx-pop.wav', t: srcToOut(CUES.reviewsAsk) },
  { file: 'sfx-pop.wav', t: srcToOut(CUES.reply) },
  { file: 'sfx-whoosh.wav', t: at('ads') + 0.1, vol: 0.3 },
  ...[CUES.kpiVisibility, CUES.kpiCalls, CUES.kpiDirections].map((c) => ({ file: 'sfx-pop.wav', t: srcToOut(c) - 0.12, vol: 0.4 })),
  { file: 'sfx-whoosh.wav', t: at('evidence') + 0.1, vol: 0.3 },
  { file: 'sfx-click.wav', t: srcToOut(CUES.sendLink), vol: 0.5 },
  { file: 'sfx-chime.wav', t: srcToOut(CUES.finalBrand) - 0.15, vol: 0.45 },
];

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

      {SFX.map((s, i) => (
        <Sequence key={`sfx-${i}`} from={Math.max(0, sec(s.t))} durationInFrames={sec(2)} name={`sfx: ${s.file}`}>
          <Audio src={staticFile(`audio/${s.file}`)} volume={(s.vol ?? 0.5) * AUDIO.sfxVolume * 2} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
