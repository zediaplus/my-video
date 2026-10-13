import {Composition} from 'remotion';
import {TakwinSizes} from './Video';
import {FPS, TOTAL_SECONDS} from './timing';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="TakwinSizes"
    component={TakwinSizes}
    durationInFrames={Math.round(TOTAL_SECONDS * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
