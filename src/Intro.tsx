import {AbsoluteFill} from 'remotion';
import {C} from './theme';
import {T} from './timing';
import {appear, Text, useTime} from './ui';

export const Intro: React.FC = () => {
  const t = useTime();
  const out = T.basics - 0.35;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 40}}>
      <div style={appear(t, T.question, out)}>
        <Text size={92} weight={700}>
          أي مقاس تحتاج للطباعة؟
        </Text>
      </div>
      <div style={appear(t, T.stepByStep, out)}>
        <Text size={58} weight={400} color={C.muted}>
          خلّينا نرتّبها لك{' '}
          <span style={{color: C.accent, fontWeight: 700}}>خطوة خطوة</span>
        </Text>
      </div>
    </AbsoluteFill>
  );
};
