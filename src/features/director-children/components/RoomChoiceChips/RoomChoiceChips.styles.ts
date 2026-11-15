import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

const CHIP_HEIGHT = 40;
const BORDER_WIDTH = 1;

export const styles = StyleSheet.create({
  field: { gap: space.s2 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 },
  chip: { justifyContent: 'center', height: CHIP_HEIGHT, paddingHorizontal: space.s4, borderRadius: radius.full, borderWidth: BORDER_WIDTH },
});

export const useRoomChoiceChipsStyles = createThemedStyles((colors) => ({
  idle: { backgroundColor: colors.surface, borderColor: colors.border },
  selected: { backgroundColor: colors.blue, borderColor: colors.blue },
  error: { borderColor: colors.red },
}));
