import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { duration, easeOut } from '@/theme/motion';
import { radius } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { Screen } from './screen';
import { Skeleton } from './skeleton';
import { Text } from './text';
import { TopBar } from './top-bar';

export function PlaceholderScreen({ title, note }: { title: string; note: string }) {
  const c = useColors();
  const reduced = useReducedMotion();
  const enter = (i: number) => (reduced ? undefined : FadeInDown.duration(duration.slow).delay(i * 40).easing(easeOut).withInitialValues({ transform: [{ translateY: 12 }] }));

  return (
    <Screen header={<TopBar title={title} />}>
      <Animated.View entering={enter(0)} style={[styles.card, { backgroundColor: c.surface }]}>
        <Image source={require('@/assets/images/logo-client.png')} style={styles.logo} contentFit="contain" accessibilityLabel="I love my kinder, Jardín Maternal e Inicial" />
        <Text tone="muted" style={styles.center}>
          {note}
        </Text>
      </Animated.View>
      {[1, 2, 3].map((i) => (
        <Animated.View key={i} entering={enter(i)} style={[styles.row, { backgroundColor: c.surface }]}>
          <Skeleton width={44} height={44} round />
          <View style={styles.lines}>
            <Skeleton width="60%" height={14} />
            <Skeleton width="40%" height={12} />
          </View>
        </Animated.View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: 16, alignItems: 'center', gap: 12 },
  logo: { width: 160, height: 160 },
  center: { textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.lg, minHeight: 64 },
  lines: { flex: 1, gap: 8 },
});
