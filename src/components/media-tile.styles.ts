import { StyleSheet } from 'react-native';

import { radius, space, type } from '@/theme/tokens';

const TILE_ASPECT_RATIO = 3 / 4;
const BADGE_BACKGROUND = 'rgba(0,0,0,0.62)';
const BADGE_OFFSET = 6;
export const BADGE_ICON_SIZE = 12;
export const RETRY_ICON_SIZE = 20;

export const styles = StyleSheet.create({
  tile: { flex: 1, aspectRatio: TILE_ASPECT_RATIO, overflow: 'hidden' },
  image: { ...StyleSheet.absoluteFill },
  retry: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.s1 },
  retryLabel: { ...type.caption, fontFamily: type.smallStrong.fontFamily, textAlign: 'center' },
  badge: {
    position: 'absolute',
    right: BADGE_OFFSET,
    bottom: BADGE_OFFSET,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.s2,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: BADGE_BACKGROUND,
  },
});
