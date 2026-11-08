import { StyleSheet } from 'react-native';

import { radius, size, space } from '@/theme/tokens';
import { createThemedStyles } from '@/theme/themed-styles';

const BUBBLE_MAX_WIDTH = '82%';
const BUBBLE_TAIL_RADIUS = 4;
const FAILED_OUTLINE_WIDTH = 2;
export const SEEN_ICON_SIZE = 14;
export const RETRY_ICON_SIZE = 16;

export const styles = StyleSheet.create({
  message: { maxWidth: BUBBLE_MAX_WIDTH, alignSelf: 'flex-start', gap: 2 },
  own: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  sender: { marginLeft: space.s1 },
  bubble: { borderRadius: radius.lg, borderBottomLeftRadius: BUBBLE_TAIL_RADIUS, paddingVertical: 9, paddingHorizontal: 13 },
  ownBubble: { borderBottomLeftRadius: radius.lg, borderBottomRightRadius: BUBBLE_TAIL_RADIUS },
  footer: { flexDirection: 'row', alignItems: 'center', gap: space.s1, marginHorizontal: space.s1 },
  photoWithText: { marginBottom: 6 },
  retry: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: size.touch },
});

export const useFailedOutlineStyles = createThemedStyles((colors) => ({
  failed: { borderWidth: FAILED_OUTLINE_WIDTH, borderColor: colors.red },
}));
