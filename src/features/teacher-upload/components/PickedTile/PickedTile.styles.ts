import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { fonts } from '@/theme/tokens';

export const REMOVE_ICON_SIZE = 14;
export const PLACEHOLDER_ICON_SIZE = 28;
export const REMOVE_HIT_SLOP = 8;
const TILE_RADIUS = 12;
const REMOVE_SIZE = 28;
const REMOVE_INSET = 4;
const BADGE_INSET = 6;
const BADGE_RADIUS = 6;
const BADGE_PADDING_HORIZONTAL = 6;
const BADGE_PADDING_VERTICAL = 1;
const BADGE_FONT_SIZE = 12;
const BADGE_LINE_HEIGHT = 18;
const TOO_LONG_OPACITY = 0.45;
const OVERLAY_BACKGROUND = 'rgba(0,0,0,0.6)';
const BADGE_BACKGROUND = 'rgba(0,0,0,0.62)';

export const styles = StyleSheet.create({
  tile: { flex: 1, aspectRatio: 1 },
  image: { width: '100%', height: '100%', borderRadius: TILE_RADIUS },
  placeholder: { width: '100%', height: '100%', borderRadius: TILE_RADIUS, alignItems: 'center', justifyContent: 'center' },
  tooLong: { opacity: TOO_LONG_OPACITY },
  remove: {
    position: 'absolute',
    top: REMOVE_INSET,
    right: REMOVE_INSET,
    width: REMOVE_SIZE,
    height: REMOVE_SIZE,
    borderRadius: REMOVE_SIZE / 2,
    backgroundColor: OVERLAY_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    left: BADGE_INSET,
    bottom: BADGE_INSET,
    paddingHorizontal: BADGE_PADDING_HORIZONTAL,
    paddingVertical: BADGE_PADDING_VERTICAL,
    borderRadius: BADGE_RADIUS,
    backgroundColor: BADGE_BACKGROUND,
  },
  badgeText: { fontFamily: fonts.text700, fontSize: BADGE_FONT_SIZE, lineHeight: BADGE_LINE_HEIGHT },
});

export const usePickedTileStyles = createThemedStyles((colors) => ({
  placeholder: { backgroundColor: colors.raised },
  tooLongBadge: { backgroundColor: colors.red },
  badgeText: { color: colors.white },
}));
