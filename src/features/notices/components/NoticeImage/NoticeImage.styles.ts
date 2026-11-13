import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const ICON_SIZE = 24;
export const ZOOM_ICON_SIZE = 18;
const IMAGE_HEIGHT = 240;
const BROKEN_HEIGHT = 160;
const ZOOM_SIZE = 44;
const ZOOM_OFFSET = 10;
const ZOOM_PLATE = 'rgba(13, 20, 38, 0.72)';

export const styles = StyleSheet.create({
  frame: { height: IMAGE_HEIGHT, borderRadius: radius.lg, overflow: 'hidden', marginTop: space.s1, marginBottom: space.s4 },
  image: { width: '100%', height: '100%' },
  zoom: {
    position: 'absolute',
    right: ZOOM_OFFSET,
    bottom: ZOOM_OFFSET,
    width: ZOOM_SIZE,
    height: ZOOM_SIZE,
    borderRadius: ZOOM_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ZOOM_PLATE,
  },
  broken: { height: BROKEN_HEIGHT, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', gap: space.s2, marginTop: space.s1, marginBottom: space.s4 },
});

export const useNoticeImageStyles = createThemedStyles((colors) => ({
  frame: { backgroundColor: colors.blue100 },
  broken: { backgroundColor: colors.raised },
}));
