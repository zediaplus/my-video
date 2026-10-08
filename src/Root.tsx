import React from 'react';
import { Composition, Still } from 'remotion';
import { VIDEO } from './config';
import { TOTAL_FRAMES } from './timeline';
import { ZediaVideo } from './Video';
import { POSTER, Poster } from './poster/Poster';
import { STORY, T as STORY_T, ZediaStory } from './story/Story';

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id={VIDEO.id}
    component={ZediaVideo}
    durationInFrames={TOTAL_FRAMES}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
  <Composition
    id={STORY.id}
    component={ZediaStory}
    durationInFrames={STORY_T.totalFrames}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
  <Still id={POSTER.id} component={Poster} width={POSTER.width} height={POSTER.height} />
  </>
);
