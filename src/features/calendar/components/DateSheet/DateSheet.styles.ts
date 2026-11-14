import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  monthHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.s3 },
  actions: { gap: space.s2, marginTop: space.s4 },
});
