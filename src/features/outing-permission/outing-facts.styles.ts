import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const useOutingFactsStyles = createThemedStyles((colors) => ({
  facts: { gap: space.s4 },
  card: { borderRadius: radius.md, padding: space.s4, gap: space.s4, backgroundColor: colors.surface },
  row: { flexDirection: 'row', gap: space.s3 },
  rowText: { flex: 1 },
}));
