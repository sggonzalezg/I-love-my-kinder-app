import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const REACH_ICON_SIZE = 16;
const LINE_PADDING_HORIZONTAL = 14;

export const styles = StyleSheet.create({
  line: { flexDirection: 'row', alignItems: 'center', gap: space.s2, paddingVertical: space.s3, paddingHorizontal: LINE_PADDING_HORIZONTAL, borderRadius: radius.md },
  text: { flexShrink: 1 },
});

export const useAudienceReachLineStyles = createThemedStyles((colors) => ({
  line: { backgroundColor: colors.blue50 },
}));
