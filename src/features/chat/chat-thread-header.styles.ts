import { StyleSheet } from 'react-native';

import { radius, size, space } from '@/theme/tokens';

const HEADER_MIN_HEIGHT = 56;
export const GROUP_ICON_SIZE = 22;

export const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: space.s1, paddingBottom: space.s2, paddingHorizontal: space.s3, minHeight: HEADER_MIN_HEIGHT },
  groupIcon: { width: size.touch, height: size.touch, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  titles: { flex: 1, minWidth: 0, minHeight: size.touch, justifyContent: 'center' },
});
