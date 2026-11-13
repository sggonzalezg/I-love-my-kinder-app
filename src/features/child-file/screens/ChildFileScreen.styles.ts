import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const SKELETON_HEADER_HEIGHT = 88;
export const SKELETON_CARD_HEIGHT = 72;
export const SKELETON_LIST_HEIGHT = 128;

export const styles = StyleSheet.create({
  skeleton: { gap: space.s4 },
  error: { gap: space.s3, alignItems: 'flex-start' },
  bottomSpace: { height: space.s6 },
});
