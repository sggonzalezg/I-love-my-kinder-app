import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

export const LOCK_ICON_SIZE = 20;
const CARD_PADDING_VERTICAL = 14;

export const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: space.s3, paddingHorizontal: space.s4, paddingVertical: CARD_PADDING_VERTICAL, borderRadius: radius.lg },
  text: { flex: 1, gap: space.s1 },
});
