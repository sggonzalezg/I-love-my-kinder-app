import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

const TIP_PADDING_Y = 14;

export const styles = StyleSheet.create({
  tip: { marginTop: space.s5, paddingVertical: TIP_PADDING_Y, paddingHorizontal: space.s4, borderRadius: radius.md, overflow: 'hidden' },
});

export const useSpamTipStyles = createThemedStyles((colors) => ({
  tip: { backgroundColor: colors.surface },
}));
