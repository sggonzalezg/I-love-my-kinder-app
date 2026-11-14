import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

const SHEET_MAX_HEIGHT = '86%';

export const styles = StyleSheet.create({
  sheet: { maxHeight: SHEET_MAX_HEIGHT },
  title: { marginBottom: space.s2 },
  field: { gap: space.s2 },
  actions: { gap: space.s2, marginTop: space.s3 },
});
