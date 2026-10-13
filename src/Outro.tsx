import {AbsoluteFill} from 'remotion';
import {C} from './theme';
import {T} from './timing';
import {appear, Chip, ramp, Text, useTime} from './ui';

// Logo itself glides to the centre (see Logo.tsx); this adds the spoken lines.
export const Outro: React.FC = () => {
  const t = useTime();
  const end = 1 - ramp(t, 50.0, 0.6);
  return (
    <AbsoluteFill style={{opacity: end}}>
      <div style={{position: 'absolute', top: 1010, left: 0, right: 0, ...appear(t, T.digital)}}>
        <Text size={64} weight={600} color={C.muted}>
          للطباعة الرقمية
        </Text>
      </div>
      <div style={{position: 'absolute', top: 1110, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...appear(t, T.city)}}>
        <Chip accent style={{fontSize: 50, padding: '8px 40px'}}>
          بريدة
        </Chip>
      </div>
      <div style={{position: 'absolute', top: 1300, left: 0, right: 0, ...appear(t, T.yourSize)}}>
        <Text size={80} weight={700}>
          قل لنا مقاسك…
        </Text>
      </div>
      <div style={{position: 'absolute', top: 1415, left: 0, right: 0, ...appear(t, T.rest)}}>
        <Text size={80} weight={700} color={C.accent}>
          وعلينا الباقي
        </Text>
      </div>
    </AbsoluteFill>
  );
};
