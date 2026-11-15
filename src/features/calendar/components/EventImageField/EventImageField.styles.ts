import { StyleSheet } from 'react-native';

import { mediaPlateColor, radius, size, space } from '@/theme/tokens';

const ATTACH_ROW_HEIGHT = 56;
const PREVIEW_HEIGHT = 200;
const CONTROL_INSET = space.s2;
export const ATTACH_PRESSED_SCALE = 0.98;
export const ATTACH_ICON_SIZE = 22;
export const REMOVE_ICON_SIZE = 18;

export const styles = StyleSheet.create({
  field: { gap: 6 },
  attach: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s3,
    minHeight: ATTACH_ROW_HEIGHT,
    paddingHorizontal: space.s4,
    borderRadius: radius.md,
  },
  attachText: { flex: 1 },
  preview: { height: PREVIEW_HEIGHT, borderRadius: radius.lg, overflow: 'hidden' },
  image: { width: '100%', height: PREVIEW_HEIGHT },
  controls: { position: 'absolute', top: CONTROL_INSET, right: CONTROL_INSET, flexDirection: 'row', gap: space.s2 },
  control: {
    minHeight: size.touch,
    minWidth: size.touch,
    paddingHorizontal: space.s3,
    borderRadius: radius.full,
    backgroundColor: mediaPlateColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraDenied: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: space.s2 },
});
