import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const SKELETON_FIELD_HEIGHT = 72;
export const SKELETON_FIELDS = 5;

export const styles = StyleSheet.create({
  stack: { gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});
