import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, size, space } from '@/theme/tokens';

export const PERMISSION_ICON_SIZE = 22;
export const CHEVRON_SIZE = 22;
export const CARD_PRESSED_SCALE = 0.98;
const CARD_PADDING = 14;
const CARD_BORDER_WIDTH = 2;

export const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: space.s3, padding: CARD_PADDING, borderRadius: radius.lg },
  pendingCard: { borderWidth: CARD_BORDER_WIDTH },
  icon: { width: size.touch, height: size.touch, borderRadius: size.touch / 2, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: space.s1 },
});

export const useOutingPermissionCardStyles = createThemedStyles((colors) => ({
  card: { backgroundColor: colors.surface, borderColor: colors.wait50 },
  pendingIcon: { backgroundColor: colors.wait50 },
  doneIcon: { backgroundColor: colors.ok50 },
}));
