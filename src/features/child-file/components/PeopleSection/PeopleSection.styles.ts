import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

const SEPARATOR_HEIGHT = 1;
const TITLE_GAP = 10;

export const styles = StyleSheet.create({
  section: { marginTop: space.s6, gap: TITLE_GAP },
  list: { borderRadius: radius.lg, overflow: 'hidden' },
  separator: { height: SEPARATOR_HEIGHT },
});

export const usePeopleSectionStyles = createThemedStyles((colors) => ({
  list: { backgroundColor: colors.surface },
  separator: { backgroundColor: colors.raised },
}));
