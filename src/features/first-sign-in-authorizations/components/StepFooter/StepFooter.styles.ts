import { StyleSheet } from 'react-native';

import { screenMargin, space } from '@/theme/tokens';

const LINE_MIN_HEIGHT = 20;
const LINE_BOTTOM_MARGIN = 10;

export const styles = StyleSheet.create({
  footer: { paddingTop: space.s3, paddingHorizontal: screenMargin },
  line: { textAlign: 'center', minHeight: LINE_MIN_HEIGHT, marginBottom: LINE_BOTTOM_MARGIN },
});

export function bottomInsetStyle(bottomInset: number) {
  return { paddingBottom: bottomInset + space.s4 };
}
