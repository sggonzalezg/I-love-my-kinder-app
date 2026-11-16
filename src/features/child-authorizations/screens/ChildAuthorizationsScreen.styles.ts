import { StyleSheet } from 'react-native';

import { screenMargin, space } from '@/theme/tokens';

export const QUESTION_SKELETON_HEIGHT = 168;

export const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: screenMargin, paddingBottom: space.s6, gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});
