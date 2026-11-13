import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  otp: { marginTop: space.s6, marginBottom: space.s3 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.s3 },
  tip: { marginTop: space.s2 },
  error: { marginTop: space.s3 },
  deleteAction: { marginTop: space.s6 },
  cancelAction: { marginTop: space.s2 },
});
