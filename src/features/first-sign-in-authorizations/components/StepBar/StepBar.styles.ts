import { StyleSheet } from 'react-native';

import { screenMargin, size, space } from '@/theme/tokens';

const BAR_MIN_HEIGHT = 52;

export const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s3,
    paddingTop: space.s2,
    paddingBottom: space.s1,
    paddingHorizontal: screenMargin,
    minHeight: BAR_MIN_HEIGHT,
  },
  spacer: { flex: 1 },
  later: { minHeight: size.touch, justifyContent: 'center', paddingHorizontal: space.s1 },
});
