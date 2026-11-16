import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

const TITLE_SIZE = 30;
const TITLE_LINE_HEIGHT = 1.1;
export const SKELETON_BOX_HEIGHT = 48;

export const styles = StyleSheet.create({
  title: { fontSize: TITLE_SIZE, lineHeight: TITLE_SIZE * TITLE_LINE_HEIGHT, marginTop: space.s4, marginBottom: space.s2 },
  account: { alignItems: 'flex-start', marginBottom: space.s4 },
  notices: { gap: space.s3 },
  boxes: { marginTop: space.s4 },
  continue: { marginTop: space.s4 },
  notMe: { marginTop: space.s2 },
  loading: { gap: space.s3, marginTop: space.s4 },
  error: { gap: space.s3, marginTop: space.s4 },
});
