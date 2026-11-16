import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const CHEVRON_SIZE = 20;
const CHIP_TOP = 4;

export const useChildAuthorizationLinksStyles = createThemedStyles((colors) => ({
  section: { gap: space.s2, marginTop: space.s2 },
  list: { borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surface },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, padding: space.s3 },
  rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  rowPressed: { backgroundColor: colors.raised },
  rowText: { flex: 1 },
  chip: { flexDirection: 'row', marginTop: CHIP_TOP },
}));
