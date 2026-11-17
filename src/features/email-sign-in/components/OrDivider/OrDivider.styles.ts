import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { space } from '@/theme/tokens';

const DIVIDER_LINE_HEIGHT = 1.5;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, marginTop: space.s1 },
  line: { flex: 1, height: DIVIDER_LINE_HEIGHT },
});

export const useOrDividerStyles = createThemedStyles((colors) => ({
  line: { backgroundColor: colors.raised },
}));
