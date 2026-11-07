import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const usePermissionRequestCardStyles = createThemedStyles((colors) => ({
  card: { borderRadius: radius.md, padding: space.s4, flexDirection: 'row', gap: space.s3, backgroundColor: colors.wait50 },
  text: { flex: 1, gap: space.s1 },
}));
