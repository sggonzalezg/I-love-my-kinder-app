import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { space } from '@/theme/tokens';

const ROW_MIN_HEIGHT = 64;
const DIVIDER_WIDTH = 1;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingVertical: space.s3, paddingHorizontal: space.s4, minHeight: ROW_MIN_HEIGHT },
  divided: { borderTopWidth: DIVIDER_WIDTH },
  texts: { flex: 1, minWidth: 0 },
});

export const usePermissionRowStyles = createThemedStyles((colors) => ({
  divider: { borderTopColor: colors.raised },
}));
