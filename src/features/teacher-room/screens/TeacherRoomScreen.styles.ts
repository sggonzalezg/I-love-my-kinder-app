import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, screenMargin, space } from '@/theme/tokens';

export const SKELETON_CARD_HEIGHT = 168;
export const SKELETON_ROW_HEIGHT = 64;
export const SKELETON_ROWS = 4;
const TOP_BAR_MIN_HEIGHT = 56;
const SEPARATOR_HEIGHT = 1;
const SECTION_TITLE_GAP = 10;

export const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', paddingTop: space.s2, paddingBottom: space.s3, paddingHorizontal: screenMargin, minHeight: TOP_BAR_MIN_HEIGHT },
  section: { marginTop: space.s2, gap: SECTION_TITLE_GAP },
  sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  list: { borderRadius: radius.lg, overflow: 'hidden' },
  separator: { height: SEPARATOR_HEIGHT },
  skeleton: { gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});

export const useTeacherRoomStyles = createThemedStyles((colors) => ({
  list: { backgroundColor: colors.surface },
  separator: { backgroundColor: colors.raised },
}));
