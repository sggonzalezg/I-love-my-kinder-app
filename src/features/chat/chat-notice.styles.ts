import { StyleSheet } from 'react-native';

import { radius, screenMargin, space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: screenMargin, paddingBottom: space.s4, gap: space.s3 },
  bullets: { gap: 10 },
  bullet: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: radius.md },
  actions: { paddingHorizontal: screenMargin, paddingTop: space.s1, gap: space.s1 },
  checkboxLabel: { fontSize: 15, lineHeight: 20 },
});

export function actionsBottomPadding(safeAreaBottom: number) {
  return { paddingBottom: safeAreaBottom + space.s3 };
}
