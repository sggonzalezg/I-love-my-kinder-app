import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const ACCOUNT_ICON_SIZE = 20;
const CHIP_PADDING_X = 14;

export const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: space.s2, maxWidth: '100%', paddingVertical: space.s2, paddingHorizontal: CHIP_PADDING_X, borderRadius: radius.full },
  email: { flexShrink: 1 },
});

export const useAccountChipStyles = createThemedStyles((colors) => ({
  chip: { backgroundColor: colors.surface },
}));
