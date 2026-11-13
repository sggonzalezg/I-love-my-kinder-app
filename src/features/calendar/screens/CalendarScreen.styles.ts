import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const EMPTY_ILLUSTRATION = require('@/assets/images/shovel-christopher-luther.jpg');
export const SKELETON_ROW_HEIGHT = 76;
export const SKELETON_ROWS = 3;

export const styles = StyleSheet.create({
  monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.s3 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space.s6, marginBottom: space.s3 },
  list: { gap: space.s2 },
  footer: { marginTop: space.s3, marginBottom: space.s6 },
  emptyAction: { alignItems: 'center', marginBottom: space.s6 },
  feedback: { gap: space.s3, alignItems: 'flex-start', marginTop: space.s6 },
});
