import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const PERMISSION_ICON_SIZE = 20;
const PERMISSION_ICON_PLATE = 40;
const PANEL_INSET = 14;

export const styles = StyleSheet.create({
  stack: { gap: space.s3 },
  was: { paddingVertical: space.s3, paddingHorizontal: PANEL_INSET, borderRadius: radius.lg },
  struck: { textDecorationLine: 'line-through' },
  card: { padding: space.s4, borderRadius: radius.lg },
  permission: { flexDirection: 'row', alignItems: 'flex-start', gap: space.s3, paddingVertical: PANEL_INSET, paddingHorizontal: space.s4, borderRadius: radius.lg },
  permissionIcon: { width: PERMISSION_ICON_PLATE, height: PERMISSION_ICON_PLATE, borderRadius: PERMISSION_ICON_PLATE / 2, alignItems: 'center', justifyContent: 'center' },
  permissionText: { flex: 1, gap: space.s1 },
});

export const useCancelledEventDetailsStyles = createThemedStyles((colors) => ({
  was: { backgroundColor: colors.raised },
  card: { backgroundColor: colors.surface },
}));
