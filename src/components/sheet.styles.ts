import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, screenMargin, space } from '@/theme/tokens';

const GRAB_WIDTH = 36;
const GRAB_HEIGHT = 5;

export const useSheetStyles = createThemedStyles((colors) => ({
  root: { flex: 1 },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: colors.scrim },
  anchor: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: screenMargin,
  },
  grabStrip: { alignSelf: 'stretch', alignItems: 'center', paddingTop: space.s3, paddingBottom: space.s4 },
  grab: { width: GRAB_WIDTH, height: GRAB_HEIGHT, borderRadius: radius.full, backgroundColor: colors.border },
}));

export function sheetBottomPadding(bottomInset: number) {
  return { paddingBottom: bottomInset + space.s5 };
}
