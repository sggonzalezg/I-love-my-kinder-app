import { StyleSheet } from 'react-native';
import { FadeIn, ReduceMotion } from 'react-native-reanimated';

import { duration, easeOut } from '@/theme/motion';
import { fonts, radius, space } from '@/theme/tokens';

export const HEART_SIZE = 30;
const HEART_WELL_SIZE = 52;
const TEXT_DELAY_MS = 600;

export const SEAL_TEXT_ENTERING = FadeIn.duration(duration.base).delay(TEXT_DELAY_MS).easing(easeOut).reduceMotion(ReduceMotion.System);

export const styles = StyleSheet.create({
  seal: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: space.s4, borderRadius: radius.lg },
  heartWell: { width: HEART_WELL_SIZE, height: HEART_WELL_SIZE, borderRadius: HEART_WELL_SIZE / 2, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1 },
  title: { fontFamily: fonts.display800, fontSize: 17, lineHeight: 21 },
});
