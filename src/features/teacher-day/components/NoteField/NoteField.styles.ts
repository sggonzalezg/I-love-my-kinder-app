import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space, type as typeScale } from '@/theme/tokens';

const NOTE_MIN_HEIGHT = 72;
const BORDER_WIDTH = 1.5;

export const styles = StyleSheet.create({
  input: { ...typeScale.body, minHeight: NOTE_MIN_HEIGHT, paddingTop: 14, paddingBottom: space.s3, paddingHorizontal: space.s4, borderRadius: radius.md, textAlignVertical: 'top' },
  hint: { marginTop: 6 },
});

export const useNoteFieldStyles = createThemedStyles((colors) => ({
  input: { backgroundColor: colors.surface, borderWidth: BORDER_WIDTH, borderColor: colors.border, color: colors.ink },
}));
