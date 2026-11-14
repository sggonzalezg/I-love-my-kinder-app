import { StyleSheet } from 'react-native';

import { screenMargin, space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  bar: { paddingTop: space.s3, paddingHorizontal: screenMargin },
});

export function bottomInsetStyle(bottomInset: number) {
  return { paddingBottom: bottomInset + space.s3 };
}
