import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { fonts, space } from '@/theme/tokens';

export const CHECK_ICON_SIZE = 16;
const BOX_SIZE = 26;
const BOX_RADIUS = 7;
const BOX_BORDER_WIDTH = 2;
const ROW_MIN_HEIGHT = 48;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: space.s3, paddingVertical: space.s3, minHeight: ROW_MIN_HEIGHT },
  box: { width: BOX_SIZE, height: BOX_SIZE, borderRadius: BOX_RADIUS, borderWidth: BOX_BORDER_WIDTH, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1 },
  link: { fontFamily: fonts.text600 },
});

export const useConsentBoxColorStyles = createThemedStyles((colors) => ({
  unchecked: { backgroundColor: colors.surface, borderColor: colors.muted },
  missing: { backgroundColor: colors.surface, borderColor: colors.red },
  checked: { backgroundColor: colors.blue, borderColor: colors.blue },
}));
