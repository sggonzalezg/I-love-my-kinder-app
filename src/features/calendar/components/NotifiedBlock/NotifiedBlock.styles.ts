import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const NOTIFIED_ICON_SIZE = 16;
const BLOCK_GAP = 6;
const BLOCK_PADDING_HORIZONTAL = 14;

export const styles = StyleSheet.create({
  block: { gap: BLOCK_GAP, marginVertical: space.s3, paddingVertical: space.s3, paddingHorizontal: BLOCK_PADDING_HORIZONTAL, borderRadius: radius.md },
  line: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  lineText: { flexShrink: 1 },
});

export const useNotifiedBlockStyles = createThemedStyles((colors) => ({
  block: { backgroundColor: colors.blue50 },
}));
