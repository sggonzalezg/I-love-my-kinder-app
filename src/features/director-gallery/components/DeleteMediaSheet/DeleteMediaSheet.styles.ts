import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

const THUMB_SIZE = 60;
export const VIDEO_ICON_SIZE = 22;

export const styles = StyleSheet.create({
  media: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingBottom: space.s3 },
  thumb: { width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: radius.md, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  details: { flex: 1, gap: 2 },
  title: { marginBottom: space.s2 },
  actions: { gap: space.s2, marginTop: space.s5 },
});
