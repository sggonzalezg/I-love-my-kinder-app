import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

export const ALLERGY_CARD_ICON_SIZE = 22;
const CARD_VERTICAL_PADDING = 14;

export const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: space.s3, paddingVertical: CARD_VERTICAL_PADDING, paddingHorizontal: space.s4, borderRadius: radius.lg },
  text: { flex: 1 },
});
