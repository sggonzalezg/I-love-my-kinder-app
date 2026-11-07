import { createThemedStyles } from '@/theme/themed-styles';
import { radius, screenMargin, space } from '@/theme/tokens';

export const useOutingPermissionScreenStyles = createThemedStyles((colors) => ({
  root: { flex: 1 },
  error: { gap: space.s3, alignItems: 'flex-start' },
  footer: {
    paddingHorizontal: screenMargin,
    paddingTop: space.s3,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    backgroundColor: colors.raised,
  },
}));

export function footerBottomPadding(safeAreaBottom: number) {
  return { paddingBottom: safeAreaBottom + space.s3 };
}
