import {AbsoluteFill} from 'remotion';
import {C} from './theme';
import {T} from './timing';
import {appear, Text, useTime} from './ui';

export const Intro: React.FC = () => {
  const t = useTime();
  const out = T.a0 - 0.4;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 40}}>
      <div style={appear(t, T.question + 0.3, out)}>
        <Text size={104} weight={700}>
          أي مقاس تحتاج؟
        </Text>
      </div>
      <div style={appear(t, T.byFolding, out)}>
        <Text size={58} weight={400} color={C.muted}>
          خلّينا نرتّبها لك…{' '}
          <span style={{color: C.accent, fontWeight: 700}}>بالطيّ</span>
        </Text>
      </div>
    </AbsoluteFill>
  );
};
