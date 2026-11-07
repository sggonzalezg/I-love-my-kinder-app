import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const usePermissionRecordCardStyles = createThemedStyles((colors) => ({
  card: { flexDirection: 'row', gap: space.s3, alignItems: 'center', padding: space.s4, borderRadius: radius.md },
  authorized: { backgroundColor: colors.ok50 },
  declined: { backgroundColor: colors.red50 },
  text: { flex: 1 },
}));
