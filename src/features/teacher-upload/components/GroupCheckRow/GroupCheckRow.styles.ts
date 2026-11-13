import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { space } from '@/theme/tokens';

export const CHECK_ICON_SIZE = 16;
const BOX_SIZE = 26;
const BOX_RADIUS = 7;
const BOX_BORDER_WIDTH = 2;
const ROW_MIN_HEIGHT = 48;
const SEPARATOR_WIDTH = 1;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingVertical: space.s3, paddingHorizontal: space.s4, minHeight: ROW_MIN_HEIGHT },
  separated: { borderTopWidth: SEPARATOR_WIDTH },
  box: { width: BOX_SIZE, height: BOX_SIZE, borderRadius: BOX_RADIUS, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1 },
});

export const useGroupCheckRowStyles = createThemedStyles((colors) => ({
  row: { backgroundColor: colors.surface, borderColor: colors.raised },
  rowPressed: { backgroundColor: colors.raised, borderColor: colors.raised },
  boxOff: { borderWidth: BOX_BORDER_WIDTH, borderColor: colors.muted, backgroundColor: colors.surface },
  boxOn: { backgroundColor: colors.blue },
}));
