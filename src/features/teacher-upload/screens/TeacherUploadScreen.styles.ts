import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const ERROR_ICON_SIZE = 16;
const SECTION_MARGIN_TOP = 24;
const SECTION_MARGIN_BOTTOM = 10;
const LINE_GAP = 6;

export const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: space.s3,
    marginTop: SECTION_MARGIN_TOP,
    marginBottom: SECTION_MARGIN_BOTTOM,
  },
  sectionTitle: { flexShrink: 1 },
  list: { borderRadius: radius.lg, overflow: 'hidden' },
  errorLine: { flexDirection: 'row', alignItems: 'center', gap: LINE_GAP, marginTop: LINE_GAP },
  errorText: { flex: 1 },
  help: { marginTop: LINE_GAP },
  uploadButton: { marginVertical: space.s5 },
  banner: { marginTop: space.s4 },
  notice: { gap: space.s3, alignItems: 'flex-start', marginTop: space.s4 },
});

export const useTeacherUploadStyles = createThemedStyles((colors) => ({
  list: { backgroundColor: colors.surface },
}));
