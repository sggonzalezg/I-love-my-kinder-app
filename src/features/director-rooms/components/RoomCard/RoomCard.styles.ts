import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

const CARD_VERTICAL_PADDING = 14;
const SEPARATOR_HEIGHT = 1;

export const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, paddingVertical: CARD_VERTICAL_PADDING, paddingHorizontal: space.s4 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.s3 },
  title: { flex: 1 },
  separator: { height: SEPARATOR_HEIGHT },
});
