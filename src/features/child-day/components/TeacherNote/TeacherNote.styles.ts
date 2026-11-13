import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

const BUBBLE_PADDING_HORIZONTAL = 14;

export const styles = StyleSheet.create({
  note: { flexDirection: 'row', alignItems: 'flex-start', gap: space.s3, paddingTop: space.s2 },
  bubble: {
    flex: 1,
    paddingVertical: space.s3,
    paddingHorizontal: BUBBLE_PADDING_HORIZONTAL,
    borderTopLeftRadius: space.s1,
    borderTopRightRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
});
