import { StyleSheet } from 'react-native';

import { screenMargin, space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  root: { flex: 1 },
  actions: { marginTop: 'auto', paddingHorizontal: screenMargin, gap: space.s2 },
  title: { textAlign: 'center', marginBottom: space.s3 },
});

export function bottomInsetStyle(bottomInset: number) {
  return { paddingBottom: bottomInset + space.s4 };
}
