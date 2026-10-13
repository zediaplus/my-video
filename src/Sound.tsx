import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import {FPS, sec, T, TOTAL_SECONDS} from './timing';

// Background effects are kept very quiet under the voiceover.
const SFX_VOLUME = 0.07;
const MUSIC_VOLUME = 0.03;

const Fx: React.FC<{at: number; file: string; gain?: number}> = ({at, file, gain = 1}) => (
  <Sequence from={sec(Math.max(0, at))} layout="none">
    <Audio src={staticFile(`sfx/${file}`)} volume={SFX_VOLUME * gain} />
  </Sequence>
);

export const Sound: React.FC = () => {
  const total = TOTAL_SECONDS * FPS;
  return (
    <>
      <Audio src={staticFile('voiceover.mp3')} />
      <Audio
        src={staticFile('sfx/music.wav')}
        volume={(f) =>
          MUSIC_VOLUME *
          interpolate(f, [0, FPS, total - 2 * FPS, total], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />

      <Fx at={0} file="whoosh.wav" />
      <Fx at={T.a0} file="bass.wav" gain={1.3} />
      {T.folds.map((e) => (
        <Fx key={`f${e}`} at={e - 0.5} file="fold.wav" />
      ))}
      {T.folds.map((e) => (
        <Fx key={`p${e}`} at={e} file="pop.wav" gain={0.7} />
      ))}
      <Fx at={T.recap} file="ding.wav" gain={0.6} />
      <Fx at={T.card - 0.15} file="whoosh.wav" />
      <Fx at={T.cardDiagram} file="click.wav" />
      <Fx at={T.cardA5 - 1.5} file="click.wav" />
      <Fx at={T.cardA5} file="ding.wav" gain={0.6} />
      {T.stickerSizes.map((s, i) => (
        <Fx key={`s${s}`} at={s} file={`pop${i + 1}.wav`} gain={0.7} />
      ))}
      <Fx at={T.stickerPhoto} file="stick.wav" />
      <Fx at={T.outro - 0.2} file="whoosh.wav" />
      <Fx at={T.outroLogo} file="whoosh.wav" gain={0.8} />
    </>
  );
};
