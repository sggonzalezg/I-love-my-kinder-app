import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { fonts, radius, space } from '@/theme/tokens';

export const SEARCH_ICON_SIZE = 16;
const SEARCH_HEIGHT = 44;
const BORDER_WIDTH = 1;

export const styles = StyleSheet.create({
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
    height: SEARCH_HEIGHT,
    paddingHorizontal: space.s3,
    borderWidth: BORDER_WIDTH,
    borderRadius: radius.md,
  },
  input: { flex: 1, height: '100%', fontFamily: fonts.text400, fontSize: 16 },
});

export const useSearchFieldColorStyles = createThemedStyles((colors) => ({
  field: { backgroundColor: colors.surface, borderColor: colors.border },
  input: { color: colors.ink },
}));
