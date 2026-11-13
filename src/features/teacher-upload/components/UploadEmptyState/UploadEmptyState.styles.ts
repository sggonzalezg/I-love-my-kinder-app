import { StyleSheet } from 'react-native';

import { space, type } from '@/theme/tokens';

const ILLUSTRATION_SIZE = 168;
const EMPTY_PADDING_TOP = 24;
const EMPTY_TITLE_SIZE = 22;
const EMPTY_TITLE_LINE_HEIGHT = 26;

export const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: EMPTY_PADDING_TOP, paddingHorizontal: space.s6 },
  illustration: { width: ILLUSTRATION_SIZE, height: ILLUSTRATION_SIZE, borderRadius: ILLUSTRATION_SIZE / 2, marginBottom: space.s5 },
  title: { ...type.title, fontSize: EMPTY_TITLE_SIZE, lineHeight: EMPTY_TITLE_LINE_HEIGHT, textAlign: 'center', marginBottom: space.s2 },
  text: { textAlign: 'center' },
  help: { textAlign: 'center', marginTop: space.s2 },
});
