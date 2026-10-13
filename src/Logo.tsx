import {AbsoluteFill, Easing, Img, interpolate, staticFile} from 'remotion';
import {ramp, useTime} from './ui';
import {T} from './timing';

// Logo stays pinned at the top; in the outro it glides to the centre.
export const Logo: React.FC = () => {
  const t = useTime();
  const intro = ramp(t, 0, 0.9);
  const toCenter = interpolate(t, [T.outroLogo, T.outroLogo + 0.9], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const height = interpolate(toCenter, [0, 1], [210, 420]);
  const top = interpolate(toCenter, [0, 1], [70, 560]);
  return (
    <AbsoluteFill>
      <Img
        src={staticFile('img/logo.png')}
        style={{
          position: 'absolute',
          left: '50%',
          top,
          height,
          transform: `translateX(-50%) scale(${0.9 + 0.1 * intro})`,
          opacity: intro,
        }}
      />
    </AbsoluteFill>
  );
};
