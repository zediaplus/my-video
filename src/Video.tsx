import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CardScene} from './CardScene';
import {useFonts} from './Fonts';
import {Intro} from './Intro';
import {Outro} from './Outro';
import {PaperStage} from './PaperStage';
import {Sound} from './Sound';
import {StickerScene} from './StickerScene';
import {C} from './theme';
import {sec, T, TOTAL_SECONDS} from './timing';

// Scenes read the absolute time; Span only decides when each one is mounted.
const Span: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const f = useCurrentFrame();
  return f >= sec(from) && f < sec(to) ? <>{children}</> : null;
};

export const TakwinSizes: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${C.bgInner} 0%, ${C.bgOuter} 100%)`}}>
      <Span from={0} to={T.a0 + 0.2}>
        <Intro />
      </Span>
      <AbsoluteFill style={{transform: 'translateY(-130px)'}}>
      <Span from={T.a0 - 0.1} to={T.stageOut + 0.6}>
        <PaperStage />
      </Span>
      <Span from={T.cards - 0.1} to={T.cardsOut + 0.4}>
        <CardScene />
      </Span>
      <Span from={T.packaging - 0.1} to={T.stickersOut + 0.4}>
        <StickerScene />
      </Span>
      </AbsoluteFill>
      <Span from={T.outro - 0.1} to={TOTAL_SECONDS}>
        <Outro />
      </Span>
      <Sound />
    </AbsoluteFill>
  );
};
