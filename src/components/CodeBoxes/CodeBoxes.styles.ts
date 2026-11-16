import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { fonts, radius, space } from '@/theme/tokens';

const BOX_HEIGHT = 60;
const DIGIT_SIZE = 26;
const IDLE_BORDER = 1.5;
const MARKED_BORDER = 2;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.s2 },
  hiddenInput: { ...StyleSheet.absoluteFill, opacity: 0 },
  box: { flex: 1, height: BOX_HEIGHT, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: IDLE_BORDER },
  digit: { fontFamily: fonts.display800, fontSize: DIGIT_SIZE, lineHeight: DIGIT_SIZE + space.s1 },
});

export const useCodeBoxesStyles = createThemedStyles((colors) => ({
  box: { backgroundColor: colors.surface, borderColor: colors.border },
  current: { borderColor: colors.blue, borderWidth: MARKED_BORDER },
  correct: { borderColor: colors.ok, borderWidth: MARKED_BORDER },
  wrong: { borderColor: colors.red, borderWidth: MARKED_BORDER },
  digit: { color: colors.ink },
  digitCorrect: { color: colors.ok },
  digitWrong: { color: colors.red },
  digitDim: { color: colors.muted },
}));
