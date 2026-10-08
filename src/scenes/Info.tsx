import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ease, mix, settle } from '../anim';
import { COLORS, CUES, TEXT } from '../config';
import { cueIn } from '../timeline';
import { Phone, ProfileScreen } from '../components/Phone';
import { At, CENTER_X, Headline } from '../components/ui';

const PHONE_W = 470;

export const Info: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (src: number) => cueIn('info', src);
  const zoom = settle(frame, 0);
  const rowCues = [CUES.services, CUES.description, CUES.contact, CUES.hours].map(c);
  const rows = rowCues.map((f) => ease(frame, f - 4, 18));
  const clarity = ease(frame, c(CUES.clarity), 30);

  return (
    <AbsoluteFill>
      <Headline text={TEXT.infoTitle} start={4} y={220} size={62} />
      <At x={CENTER_X} y={mix(zoom, 980, 880)}>
        <div style={{ transform: `scale(${mix(zoom, 0.8, 1) * mix(clarity, 1, 1.04)})` }}>
          <Phone width={PHONE_W}>
            <ProfileScreen width={PHONE_W * 0.936} rows={rows} rowLabels={TEXT.infoRows} />
          </Phone>
          {/* calm focus ring once everything is in place */}
          <div
            style={{
              position: 'absolute',
              inset: -18,
              borderRadius: PHONE_W * 0.17,
              border: `4px solid ${COLORS.cyan}`,
              opacity: clarity * 0.7,
            }}
          />
        </div>
      </At>
    </AbsoluteFill>
  );
};
