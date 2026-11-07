import { StyleSheet } from 'react-native';

import { screenMargin, space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: screenMargin, paddingBottom: space.s6, gap: space.s4 },
});

export function topInsetStyle(topInset: number) {
  return { paddingTop: topInset };
}
