import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

const MAX_TEXT_HEIGHT = 420;

export const styles = StyleSheet.create({
  content: { gap: space.s2 },
  body: { maxHeight: MAX_TEXT_HEIGHT, marginTop: space.s1 },
  actions: { gap: space.s2, marginTop: space.s4 },
});
