import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const PREVIEW_LINES = 2;
const UNREAD_DOT_SIZE = 10;
const THUMBNAIL_SIZE = 56;
const ROW_MIN_HEIGHT = 64;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingVertical: space.s3, paddingHorizontal: space.s4, minHeight: ROW_MIN_HEIGHT },
  unreadDot: { width: UNREAD_DOT_SIZE, height: UNREAD_DOT_SIZE, borderRadius: UNREAD_DOT_SIZE / 2 },
  text: { flex: 1, minWidth: 0 },
  titleLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.s3 },
  title: { flexShrink: 1 },
  senderLine: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: space.s2 },
  seenChip: { flexDirection: 'row', marginTop: space.s2 },
  thumbnail: { width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE, borderRadius: radius.md },
});

export const useNoticeRowStyles = createThemedStyles((colors) => ({
  unreadDot: { backgroundColor: colors.red },
  thumbnail: { backgroundColor: colors.blue100 },
}));
