import { StyleSheet } from 'react-native';

import { PROVIDER_BUTTON_HEIGHT } from '@/features/email-sign-in/components/GoogleButton/GoogleButton.styles';
import { space } from '@/theme/tokens';

export const APPLE_BUTTON_CORNER_RADIUS = PROVIDER_BUTTON_HEIGHT / 2;
const DISABLED_OPACITY = 0.4;

export const styles = StyleSheet.create({
  stack: { gap: space.s3 },
  appleButton: { height: PROVIDER_BUTTON_HEIGHT, alignSelf: 'stretch' },
  disabled: { opacity: DISABLED_OPACITY, pointerEvents: 'none' },
});
