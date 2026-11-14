import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

const THUMBNAIL_SIZE = 48;
export const REDUCED_ENTRANCE_MS = 120;
export const ENTRANCE_MS = 300;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.s4, padding: space.s4, borderRadius: radius.md, marginBottom: space.s2, alignItems: 'center' },
  thumbnail: { width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE, borderRadius: radius.md },
  details: { flex: 1 },
  chips: { flexDirection: 'row', gap: space.s1, marginBottom: space.s1 },
  title: { marginBottom: space.s1 },
  permissionChip: { flexDirection: 'row', marginTop: space.s1 },
});

export const useEventRowStyles = createThemedStyles((colors) => ({
  row: { backgroundColor: colors.surface },
}));
