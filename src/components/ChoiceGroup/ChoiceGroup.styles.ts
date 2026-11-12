import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { fonts, radius, size, space } from '@/theme/tokens';

export const CHOICE_PRESSED_SCALE = 0.96;
const BORDER_WIDTH = 1.5;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.s2 },
  cell: { flex: 1 },
  choice: { minHeight: size.teacherChoice, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', padding: 6 },
  label: { fontFamily: fonts.text700, fontSize: 15, lineHeight: 17, textAlign: 'center' },
});

export const useChoiceGroupStyles = createThemedStyles((colors) => ({
  idle: { backgroundColor: colors.surface, borderWidth: BORDER_WIDTH, borderColor: colors.border },
  selected: { backgroundColor: colors.blue, borderWidth: BORDER_WIDTH, borderColor: colors.blue },
  idleLabel: { color: colors.ink },
  selectedLabel: { color: colors.onBlue },
}));
