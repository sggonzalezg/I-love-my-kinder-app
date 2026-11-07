import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const useChildPermissionBlockStyles = createThemedStyles((colors) => ({
  block: { gap: space.s4 },
  sentencePlate: { borderRadius: radius.md, padding: space.s4, backgroundColor: colors.raised },
  callCard: { borderRadius: radius.md, padding: space.s4, gap: space.s3, alignItems: 'flex-start', backgroundColor: colors.surface },
}));
