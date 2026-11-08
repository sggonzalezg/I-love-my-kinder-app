import { StyleSheet } from 'react-native';

import { radius, size, space, type } from '@/theme/tokens';
import { createThemedStyles } from '@/theme/themed-styles';

const INPUT_MAX_HEIGHT = 120;
export const SEND_ICON_SIZE = 22;

export const styles = StyleSheet.create({
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: space.s2, paddingTop: space.s2, paddingHorizontal: space.s3 },
  send: { width: size.touch, height: size.touch, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
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
