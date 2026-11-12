import { StyleSheet } from 'react-native';

import { radius, screenMargin, space } from '@/theme/tokens';

const GRAB_WIDTH = 36;
const GRAB_HEIGHT = 5;

export const styles = StyleSheet.create({
  anchor: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: screenMargin, paddingTop: space.s3 },
  grab: { alignSelf: 'center', width: GRAB_WIDTH, height: GRAB_HEIGHT, borderRadius: radius.full, marginBottom: space.s4 },
});

export function bottomInsetStyle(bottomInset: number) {
  return { paddingBottom: bottomInset + space.s5 };
}
