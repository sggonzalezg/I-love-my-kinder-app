import { StyleSheet } from 'react-native';

import { TRANSPARENT } from '@/theme/color-styles';
import { createThemedStyles } from '@/theme/themed-styles';
import { fonts, radius, space } from '@/theme/tokens';

export const CHECK_SIZE = 24;
export const CHECK_STROKE = 2;

const ROW_MIN_HEIGHT = 56;
const ROW_PHOTO_SIZE = 40;

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s3,
    minHeight: ROW_MIN_HEIGHT,
    paddingVertical: space.s2,
    paddingHorizontal: space.s3,
    borderRadius: radius.md,
  },
  texts: { flex: 1 },
  label: { fontFamily: fonts.text400, fontSize: 17, lineHeight: 24 },
  selectedLabel: { fontFamily: fonts.text700 },
  photo: { width: ROW_PHOTO_SIZE, height: ROW_PHOTO_SIZE, borderRadius: radius.full },
  check: { width: CHECK_SIZE, height: CHECK_SIZE },
});

export const useRowColorStyles = createThemedStyles((colors) => ({
  idle: { backgroundColor: TRANSPARENT },
  pressed: { backgroundColor: colors.raised },
  selected: { backgroundColor: colors.blue50 },
}));
