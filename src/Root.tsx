import React from 'react';
import { Composition, Still } from 'remotion';
import { VIDEO } from './config';
import { TOTAL_FRAMES } from './timeline';
import { ZediaVideo } from './Video';
import { POSTER, Poster } from './poster/Poster';
import { STORY, T as STORY_T, ZediaStory } from './story/Story';
import { ADS30, ZediaAds30 } from './ads30/Ads30';
import { ADS30L, ZediaAds30Light } from './ads30/Ads30Light';

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
  <Composition id={ADS30.id} component={ZediaAds30} durationInFrames={ADS30.frames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
  <Composition id={ADS30L.id} component={ZediaAds30Light} durationInFrames={ADS30L.frames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
  <Still id={POSTER.id} component={Poster} width={POSTER.width} height={POSTER.height} />
  </>
);
