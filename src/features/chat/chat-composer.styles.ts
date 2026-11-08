import { StyleSheet } from 'react-native';

import { radius, size, space, type } from '@/theme/tokens';
import { createThemedStyles } from '@/theme/themed-styles';

const INPUT_MAX_HEIGHT = 120;
export const COMPOSER_ICON_SIZE = 22;
export const DENIED_ICON_SIZE = 16;

export const styles = StyleSheet.create({
  composer: { paddingTop: space.s2, paddingHorizontal: space.s3 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: space.s2 },
  roundButton: { width: size.touch, height: size.touch, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  denied: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: size.touch, marginHorizontal: space.s1 },
  deniedText: { flex: 1 },
});

export const useComposerInputStyles = createThemedStyles((colors) => ({
  input: {
    ...type.body,
    flex: 1,
    minHeight: size.touch,
    maxHeight: INPUT_MAX_HEIGHT,
    borderRadius: size.touch / 2,
    paddingHorizontal: space.s4,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.raised,
    color: colors.ink,
  },
}));

export function composerBottomPadding(safeAreaBottom: number) {
  return { paddingBottom: safeAreaBottom + space.s2 };
}
