import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const SKELETON_TITLE_HEIGHT = 64;
export const SKELETON_IMAGE_HEIGHT = 240;
const SUSPENDED_TITLE_MARGIN = 10;

export const styles = StyleSheet.create({
  suspendedTitle: { marginTop: SUSPENDED_TITLE_MARGIN },
  bodyCard: { padding: space.s4, borderRadius: radius.lg, gap: space.s3, marginTop: space.s3 },
  calendarButton: { marginTop: space.s4, marginBottom: space.s6 },
  skeleton: { gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});

export const useNoticeDetailScreenStyles = createThemedStyles((colors) => ({
  bodyCard: { backgroundColor: colors.surface },
}));
