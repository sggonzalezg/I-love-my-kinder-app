import { StyleSheet } from 'react-native';

import { fonts, radius, size, space, tabular } from '@/theme/tokens';

const UNREAD_SIZE = 22;
export const GROUP_ICON_SIZE = 22;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingVertical: space.s3, paddingHorizontal: space.s3, borderRadius: radius.md },
  groupIcon: { width: size.touch, height: size.touch, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1, minWidth: 0 },
  titleLine: { flexDirection: 'row', justifyContent: 'space-between', gap: space.s2 },
  unread: { minWidth: UNREAD_SIZE, height: UNREAD_SIZE, paddingHorizontal: 6, borderRadius: UNREAD_SIZE / 2, alignItems: 'center', justifyContent: 'center' },
  unreadText: { fontFamily: fonts.text700, fontSize: 12, lineHeight: UNREAD_SIZE, ...tabular },
});
