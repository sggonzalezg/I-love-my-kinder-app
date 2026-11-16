import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  field: { gap: space.s2, paddingBottom: space.s3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3 },
  cameraDenied: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: space.s2 },
});
