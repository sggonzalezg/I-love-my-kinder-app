import { View } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { STORY_COPY } from './story-copy';
import { styles } from './story-progress-bars.styles';

interface StoryProgressBarsProps {
  count: number;
  currentIndex: number;
  progress: SharedValue<number>;
}

export function StoryProgressBars({ count, currentIndex, progress }: StoryProgressBarsProps) {
  const currentFill = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  return (
    <View style={styles.bars} accessible accessibilityLabel={STORY_COPY.position(currentIndex + 1, count)}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={styles.track}>
          {index < currentIndex ? <View style={[styles.fill, styles.full]} /> : null}
          {index === currentIndex ? <Animated.View style={[styles.fill, currentFill]} /> : null}
        </View>
      ))}
    </View>
  );
}
