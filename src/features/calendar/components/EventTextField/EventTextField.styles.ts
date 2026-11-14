import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, size, space, type as typeScale } from '@/theme/tokens';

const BORDER_WIDTH = 1.5;
const MULTILINE_MIN_HEIGHT = 90;

export const styles = StyleSheet.create({
  field: { gap: 6 },
  input: { ...typeScale.body, minHeight: size.input, paddingHorizontal: space.s4, paddingVertical: space.s3, borderRadius: radius.md },
  multiline: { minHeight: MULTILINE_MIN_HEIGHT, textAlignVertical: 'top' },
});

export const useEventTextFieldStyles = createThemedStyles((colors) => ({
  input: { backgroundColor: colors.surface, borderWidth: BORDER_WIDTH, borderColor: colors.border, color: colors.ink },
}));
