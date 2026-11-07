import { CircleX } from 'lucide-react-native';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { Text } from '@/components/text';
import type { PermissionStatus } from '@/lib/outing';
import { easeOut, signedRecord } from '@/theme/motion';
import { useColors } from '@/theme/use-theme';
import { usePermissionRecordCardStyles } from './permission-record-card.styles';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const CHECK_PATH = 'M5 12.5l4.5 4.5L19 7.5';
const CHECK_LENGTH = 21;
const ICON_SIZE = 24;
const CHECK_STROKE = 2.4;

interface PermissionRecordCardProps {
  status: Exclude<PermissionStatus, 'pending'>;
  line: string;
  justSigned: boolean;
}

export function PermissionRecordCard({ status, line, justSigned }: PermissionRecordCardProps) {
  const c = useColors();
  const styles = usePermissionRecordCardStyles();
  const reduced = useReducedMotion();
  const animate = justSigned && !reduced;
  const progress = useSharedValue(animate ? 0 : 1);
  const checkOffset = useSharedValue(animate ? CHECK_LENGTH : 0);

  useEffect(() => {
    if (!animate) return;
    progress.set(withTiming(1, { duration: signedRecord.enter, easing: easeOut }));
    checkOffset.set(withDelay(signedRecord.checkDelay, withTiming(0, { duration: signedRecord.checkDraw, easing: easeOut })));
  }, [animate, progress, checkOffset]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: progress.get(),
    transform: [{ scale: signedRecord.startScale + (1 - signedRecord.startScale) * progress.get() }],
  }));
  const checkProps = useAnimatedProps(() => ({ strokeDashoffset: checkOffset.get() }));

  const authorized = status === 'authorized';
  return (
    <Animated.View
      accessibilityRole="summary"
      style={[styles.card, authorized ? styles.authorized : styles.declined, cardStyle]}>
      {authorized ? (
        <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no">
          <AnimatedPath
            d={CHECK_PATH}
            stroke={c.ok}
            strokeWidth={CHECK_STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray={CHECK_LENGTH}
            animatedProps={checkProps}
          />
        </Svg>
      ) : (
        <CircleX size={ICON_SIZE} color={c.red} strokeWidth={2} />
      )}
      <View style={styles.text}>
        <Text variant="bodyStrong" color={authorized ? 'ok' : 'red'}>
          {line}
        </Text>
      </View>
    </Animated.View>
  );
}
