import { StyleSheet } from 'react-native';

import { fonts, radius, space } from '@/theme/tokens';

export const ROUTINE_ICON_SIZE = 24;
const CARD_PADDING_VERTICAL = 14;
const HEADER_GAP = 10;

export const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, paddingVertical: CARD_PADDING_VERTICAL, paddingHorizontal: space.s4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: HEADER_GAP, marginBottom: space.s1 },
  title: { flex: 1, fontFamily: fonts.display800, fontSize: 18, lineHeight: 23 },
});
