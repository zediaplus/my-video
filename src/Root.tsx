import React from 'react';
import { Composition } from 'remotion';
import { VIDEO } from './config';
import { TOTAL_FRAMES } from './timeline';
import { ZediaVideo } from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition
    id={VIDEO.id}
    component={ZediaVideo}
    durationInFrames={TOTAL_FRAMES}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
);
