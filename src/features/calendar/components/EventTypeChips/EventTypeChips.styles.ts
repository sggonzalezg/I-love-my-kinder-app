import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, size, space } from '@/theme/tokens';

export const CHIP_ICON_SIZE = 18;
export const CHIP_PRESSED_SCALE = 0.97;
const BORDER_WIDTH = 1.5;
const CHIP_PADDING = 14;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: size.touch, paddingHorizontal: CHIP_PADDING, borderRadius: radius.full },
});

export const useEventTypeChipsStyles = createThemedStyles((colors) => ({
  idle: { backgroundColor: colors.surface, borderWidth: BORDER_WIDTH, borderColor: colors.border },
  selected: { backgroundColor: colors.blue, borderWidth: BORDER_WIDTH, borderColor: colors.blue },
}));
