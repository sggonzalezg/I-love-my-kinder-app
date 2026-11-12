import { StyleSheet } from 'react-native';

import { fonts } from '@/theme/tokens';

export const SYNC_ICON_SIZE = 16;

export const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontFamily: fonts.text600, fontSize: 13, lineHeight: 16 },
});
