import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const SKELETON_CARD_HEIGHT = 132;
export const SKELETON_CARDS = 3;

export const styles = StyleSheet.create({
  stack: { gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});
