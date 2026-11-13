import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

export const SOURCE_ICON_SIZE = 28;
const SOURCE_BUTTON_PADDING_VERTICAL = 18;
const SOURCE_BUTTONS_GAP = 10;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: SOURCE_BUTTONS_GAP },
  cell: { flex: 1 },
  button: { alignItems: 'center', gap: space.s2, paddingVertical: SOURCE_BUTTON_PADDING_VERTICAL, paddingHorizontal: space.s2, borderRadius: radius.lg },
  label: { textAlign: 'center' },
});
