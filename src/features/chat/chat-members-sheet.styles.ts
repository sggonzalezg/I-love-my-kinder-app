import { StyleSheet } from 'react-native';

import { radius, size, space } from '@/theme/tokens';

export const DIRECTION_ICON_SIZE = 20;

export const styles = StyleSheet.create({
  content: { gap: space.s2 },
  section: { marginTop: space.s3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingVertical: space.s2 },
  directionIcon: { width: size.touch, height: size.touch, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1 },
  close: { marginTop: space.s2 },
});
