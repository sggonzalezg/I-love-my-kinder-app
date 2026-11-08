import { StyleSheet } from 'react-native';

import { screenMargin, space } from '@/theme/tokens';

export const LOCK_ICON_SIZE = 40;

export const styles = StyleSheet.create({
  root: { flex: 1 },
  banners: { paddingHorizontal: space.s4, paddingTop: space.s2, gap: space.s2 },
  messages: { paddingHorizontal: space.s4, paddingTop: space.s3, paddingBottom: space.s4, gap: space.s2 },
  daySeparator: { alignSelf: 'center', marginTop: 6, marginBottom: 2 },
  empty: { flex: 1, justifyContent: 'center', paddingHorizontal: screenMargin },
  loading: { padding: screenMargin, gap: space.s3 },
  unavailable: { flex: 1, alignItems: 'center', paddingTop: space.s12 + space.s4, paddingHorizontal: screenMargin, gap: space.s3 },
  centered: { textAlign: 'center' },
});
