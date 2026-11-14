import { StyleSheet } from 'react-native';

import { radius, size, space } from '@/theme/tokens';

export const SKELETON_ROW_HEIGHT = 64;
export const SKELETON_ROWS = 5;
const SECTION_TITLE_GAP = 10;
const SEPARATOR_HEIGHT = 1;

export const styles = StyleSheet.create({
  stack: { gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start' },
  section: { gap: SECTION_TITLE_GAP },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLink: { minHeight: size.touch, justifyContent: 'center' },
  noTeacher: { gap: space.s2 },
  list: { borderRadius: radius.lg, overflow: 'hidden' },
  separator: { height: SEPARATOR_HEIGHT },
});
