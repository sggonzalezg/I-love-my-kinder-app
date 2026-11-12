import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

export const KIND_ICON_SIZE = 18;
const OPTION_MIN_HEIGHT = 40;

export const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderRadius: radius.full, padding: space.s1, gap: space.s1 },
  option: { flex: 1, minHeight: OPTION_MIN_HEIGHT, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 10, borderRadius: radius.full },
});
