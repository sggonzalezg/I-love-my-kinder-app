import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  body: { gap: space.s3 },
  signer: { flexDirection: 'row', gap: space.s3, alignItems: 'center' },
  signerText: { flex: 1 },
});
