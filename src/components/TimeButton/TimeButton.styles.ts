import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { fonts, radius, size } from '@/theme/tokens';

export const EMPTY_TIME = '--:--';
const BORDER_WIDTH = 1.5;
const INVALID_BORDER_WIDTH = 2;

export const styles = StyleSheet.create({
  container: { flex: 1 },
  button: { minHeight: size.timeButton, paddingVertical: 10, paddingHorizontal: 14, borderRadius: radius.md, gap: 2, justifyContent: 'center' },
  time: { fontFamily: fonts.display800, fontSize: 22, lineHeight: 24 },
});

export const useTimeButtonStyles = createThemedStyles((colors) => ({
  empty: { backgroundColor: colors.surface, borderWidth: BORDER_WIDTH, borderColor: colors.border },
  set: { backgroundColor: colors.blue50, borderWidth: BORDER_WIDTH, borderColor: colors.blue50 },
  invalid: { backgroundColor: colors.surface, borderWidth: INVALID_BORDER_WIDTH, borderColor: colors.red },
}));
