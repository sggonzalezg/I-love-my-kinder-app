import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius } from '@/theme/tokens';

export const styles = StyleSheet.create({
  list: { borderRadius: radius.lg, overflow: 'hidden' },
});

export const usePermissionListStyles = createThemedStyles((colors) => ({
  list: { backgroundColor: colors.surface },
}));
