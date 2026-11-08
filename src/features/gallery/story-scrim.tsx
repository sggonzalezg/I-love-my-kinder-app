import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { SCRIM_MAX_OPACITY, styles } from './story-scrim.styles';

interface StoryScrimProps {
  edge: 'top' | 'bottom';
}

/** Neutral black fade behind the bars and the bottom bar (design: the one allowed gradient). */
export function StoryScrim({ edge }: StoryScrimProps) {
  const gradientId = `story-scrim-${edge}`;
  const darkAtTop = edge === 'top';

  return (
    <Svg style={styles[edge]} pointerEvents="none">
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="black" stopOpacity={darkAtTop ? SCRIM_MAX_OPACITY : 0} />
          <Stop offset="1" stopColor="black" stopOpacity={darkAtTop ? 0 : SCRIM_MAX_OPACITY} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
    </Svg>
  );
}
