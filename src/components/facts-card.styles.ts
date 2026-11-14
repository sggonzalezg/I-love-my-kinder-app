import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const FACT_ICON_SIZE = 20;
const FACT_ICON_OFFSET = 2;

export const styles = StyleSheet.create({
  card: { borderRadius: radius.md, padding: space.s4, marginVertical: space.s4, gap: space.s1 },
  fact: { flexDirection: 'row', gap: space.s1 },
  icon: { marginTop: FACT_ICON_OFFSET },
  factText: { flex: 1 },
});

export const useFactsCardStyles = createThemedStyles((colors) => ({
  card: { backgroundColor: colors.surface },
}));
