import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useBackgroundColorStyles } from '@/theme/color-styles';
import { duration, easeOut } from '@/theme/motion';

import { styles } from './ProgressTrack.styles';

interface ProgressTrackProps {
  /** 0 to 1. */
  fraction: number;
  thin?: boolean;
}

export function ProgressTrack({ fraction, thin }: ProgressTrackProps) {
  const backgroundStyles = useBackgroundColorStyles();
  const scale = useSharedValue(fraction);

  useEffect(() => {
    scale.set(withTiming(fraction, { duration: duration.slow, easing: easeOut, reduceMotion: ReduceMotion.System }));
  }, [fraction, scale]);

  const fill = useAnimatedStyle(() => ({ transform: [{ scaleX: scale.get() }] }));

  return (
    <View style={[styles.track, thin && styles.thin, backgroundStyles.blue100]} importantForAccessibility="no-hide-descendants">
      <Animated.View style={[styles.fill, backgroundStyles.blue, fill]} />
    </View>
  );
}
