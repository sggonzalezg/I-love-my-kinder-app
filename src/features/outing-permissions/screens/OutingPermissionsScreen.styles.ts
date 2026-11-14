import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const SKELETON_TILES_HEIGHT = 76;
export const SKELETON_ROW_HEIGHT = 64;
export const SKELETON_ROWS = 4;
export const DONE_ICON_SIZE = 18;

export const styles = StyleSheet.create({
  feedback: { gap: space.s3, paddingTop: space.s4 },
  list: { borderRadius: radius.lg, overflow: 'hidden' },
  caption: { marginTop: space.s3, marginHorizontal: space.s1 },
  done: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.s2, marginTop: space.s5 },
  bottom: { height: space.s6 },
});

export const useOutingPermissionsScreenStyles = createThemedStyles((colors) => ({
  list: { backgroundColor: colors.surface },
}));
