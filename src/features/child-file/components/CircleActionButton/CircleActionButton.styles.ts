import { StyleSheet } from 'react-native';

import { radius, size } from '@/theme/tokens';

export const CIRCLE_ACTION_ICON_SIZE = 20;

export const styles = StyleSheet.create({
  button: { width: size.touch, height: size.touch, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
});
