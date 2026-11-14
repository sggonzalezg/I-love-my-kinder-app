import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

const SEPARATOR_HEIGHT = 1;
const SECTION_TITLE_GAP = 10;

export const styles = StyleSheet.create({
  section: { marginTop: space.s2, gap: SECTION_TITLE_GAP },
  sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  list: { borderRadius: radius.lg, overflow: 'hidden' },
  separator: { height: SEPARATOR_HEIGHT },
});

export const useGroupRosterStyles = createThemedStyles((colors) => ({
  list: { backgroundColor: colors.surface },
  separator: { backgroundColor: colors.raised },
}));
