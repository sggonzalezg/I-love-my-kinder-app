import { StyleSheet } from 'react-native';

import { lightColors, size } from '@/theme/tokens';

export const STORY_ICON_SIZE = 24;
export const STORY_ICON_COLOR = lightColors.white;

export const styles = StyleSheet.create({
  button: { width: size.touch, height: size.touch, alignItems: 'center', justifyContent: 'center' },
});
