import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

const PARAGRAPH_GAP = 10;

export const styles = StyleSheet.create({
  title: { marginBottom: space.s3 },
  paragraph: { marginTop: PARAGRAPH_GAP },
  firstAction: { marginTop: space.s5 },
  nextAction: { marginTop: space.s2 },
});
