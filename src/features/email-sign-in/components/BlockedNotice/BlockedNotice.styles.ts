import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const ILLUSTRATION_SIZE = 152;
export const LOCK_ICON_SIZE = 28;
export const CHIP_ICON_SIZE = 20;
const CHIP_PADDING_X = 14;
const ACTION_GAP = 10;

export const styles = StyleSheet.create({
  root: { alignItems: 'center', paddingTop: space.s12, paddingBottom: space.s6 },
  illustration: { width: ILLUSTRATION_SIZE, height: ILLUSTRATION_SIZE, borderRadius: ILLUSTRATION_SIZE / 2, marginBottom: space.s5 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: space.s2, maxWidth: '100%', paddingVertical: space.s2, paddingHorizontal: CHIP_PADDING_X, borderRadius: radius.full },
  chipText: { flexShrink: 1 },
  title: { textAlign: 'center', marginTop: space.s4, marginBottom: space.s2 },
  body: { textAlign: 'center' },
  actions: { alignSelf: 'stretch', marginTop: space.s6, gap: ACTION_GAP },
});

export const useBlockedNoticeStyles = createThemedStyles((colors) => ({
  chip: { backgroundColor: colors.surface },
}));
