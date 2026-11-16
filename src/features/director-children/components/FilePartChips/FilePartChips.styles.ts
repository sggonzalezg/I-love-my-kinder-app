import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

const CHIP_HEIGHT = 40;

export const styles = StyleSheet.create({
  row: { gap: space.s2, paddingVertical: space.s3 },
  chip: { justifyContent: 'center', height: CHIP_HEIGHT, paddingHorizontal: space.s4, borderRadius: radius.full },
});

export const useFilePartChipsStyles = createThemedStyles((colors) => ({
  idle: { backgroundColor: colors.surface },
  selected: { backgroundColor: colors.blue },
}));
