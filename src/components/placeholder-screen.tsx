import { Image } from 'expo-image';
import { View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { useBackgroundColorStyles } from '@/theme/color-styles';
import { duration, easeOut } from '@/theme/motion';

import { PLACEHOLDER_AVATAR_SIZE, PLACEHOLDER_SUBTITLE_LINE, PLACEHOLDER_TITLE_LINE, styles } from './placeholder-screen.styles';
import { Screen } from './screen';
import { Skeleton } from './skeleton';
import { Text } from './text';
import { TopBar } from './top-bar';

const SKELETON_ROWS = [1, 2, 3];
const ENTRANCE_STAGGER_MS = 40;
const ENTRANCE_OFFSET_Y = 12;

export function PlaceholderScreen({ title, note }: { title: string; note: string }) {
  const backgroundStyles = useBackgroundColorStyles();
  const reduced = useReducedMotion();
  const enter = (index: number) =>
    reduced ? undefined : FadeInDown.duration(duration.slow).delay(index * ENTRANCE_STAGGER_MS).easing(easeOut).withInitialValues({ transform: [{ translateY: ENTRANCE_OFFSET_Y }] });

  return (
    <Screen header={<TopBar title={title} />}>
      <Animated.View entering={enter(0)} style={[styles.card, backgroundStyles.surface]}>
        <Image source={require('@/assets/images/logo-client.png')} style={styles.logo} contentFit="contain" accessibilityLabel="I love my kinder, Jardín Maternal e Inicial" />
        <Text tone="muted" style={styles.center}>
          {note}
        </Text>
      </Animated.View>
      {SKELETON_ROWS.map((row) => (
        <Animated.View key={row} entering={enter(row)} style={[styles.row, backgroundStyles.surface]}>
          <Skeleton width={PLACEHOLDER_AVATAR_SIZE} height={PLACEHOLDER_AVATAR_SIZE} round />
          <View style={styles.lines}>
            <Skeleton width={PLACEHOLDER_TITLE_LINE.width} height={PLACEHOLDER_TITLE_LINE.height} />
            <Skeleton width={PLACEHOLDER_SUBTITLE_LINE.width} height={PLACEHOLDER_SUBTITLE_LINE.height} />
          </View>
        </Animated.View>
      ))}
    </Screen>
  );
}
