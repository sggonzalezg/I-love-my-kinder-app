import { StyleSheet } from 'react-native';
import type { CSSTransitionProperties } from 'react-native-reanimated';

import { cssEaseOut, duration } from '@/theme/motion';
import { createThemedStyles } from '@/theme/themed-styles';
import { radius, size, space } from '@/theme/tokens';

export const CHEVRON_SIZE = 18;
export const ERROR_ICON_SIZE = 18;
export const TRIGGER_PRESSED_SCALE = 0.98;

export const chevronTransition: CSSTransitionProperties = {
  transitionProperty: 'transform',
  transitionDuration: duration.base,
  transitionTimingFunction: cssEaseOut,
};

const FIELD_PHOTO_SIZE = 24;
const BORDER_WIDTH = 1.5;
const RING_WIDTH = 2;
const PILL_HEIGHT = size.touch;
const FIELD_PADDING_RIGHT = 14;

export const styles = StyleSheet.create({
  wrapper: { gap: space.s2 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s3,
    height: size.input,
    paddingLeft: space.s4,
    paddingRight: FIELD_PADDING_RIGHT,
    borderRadius: radius.md,
    borderWidth: BORDER_WIDTH,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: space.s1,
    height: PILL_HEIGHT,
    paddingHorizontal: space.s4,
    borderRadius: radius.full,
    borderWidth: BORDER_WIDTH,
  },
  value: { flex: 1 },
  photo: { width: FIELD_PHOTO_SIZE, height: FIELD_PHOTO_SIZE, borderRadius: radius.full },
  messageRow: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  ring: { borderWidth: RING_WIDTH },
  chevronOpen: { transform: [{ rotate: '180deg' }] },
  chevronClosed: { transform: [{ rotate: '0deg' }] },
});

export const useTriggerColorStyles = createThemedStyles((colors) => ({
  idle: { backgroundColor: colors.surface, borderColor: colors.border },
  open: { backgroundColor: colors.surface, borderColor: colors.blue },
  error: { backgroundColor: colors.surface, borderColor: colors.red },
  disabled: { backgroundColor: colors.raised, borderColor: colors.raised },
  filtering: { backgroundColor: colors.blue50, borderColor: colors.blue200 },
  roomSwitch: { backgroundColor: colors.blue50, borderColor: colors.blue50 },
}));
