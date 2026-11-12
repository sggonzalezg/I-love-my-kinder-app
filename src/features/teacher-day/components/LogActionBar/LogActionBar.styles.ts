import { StyleSheet } from 'react-native';

import { screenMargin, space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: space.s3, paddingHorizontal: screenMargin },
  primary: { flex: 1 },
});

export function bottomInsetStyle(bottomInset: number) {
  return { paddingBottom: bottomInset + space.s3 };
}
