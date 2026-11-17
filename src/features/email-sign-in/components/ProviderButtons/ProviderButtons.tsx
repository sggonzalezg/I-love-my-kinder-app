import * as AppleAuthentication from 'expo-apple-authentication';
import { View } from 'react-native';

import { GoogleButton } from '@/features/email-sign-in/components/GoogleButton/GoogleButton';
import { SOCIAL_PROVIDERS, type SocialProvider } from '@/lib/social-sign-in';
import { useIsDark } from '@/theme/use-theme';

import { APPLE_BUTTON_CORNER_RADIUS, styles } from './ProviderButtons.styles';

interface ProviderButtonsProps {
  providers: SocialProvider[];
  busyProvider: SocialProvider | null;
  disabled: boolean;
  onPress: (provider: SocialProvider) => void;
}

export function ProviderButtons({ providers, busyProvider, disabled, onPress }: ProviderButtonsProps) {
  const isDark = useIsDark();
  return (
    <View style={styles.stack}>
      {providers.map((provider) =>
        provider === SOCIAL_PROVIDERS.APPLE ? (
          <View key={provider} style={disabled && styles.disabled} accessibilityState={{ disabled }}>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
              buttonStyle={isDark ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={APPLE_BUTTON_CORNER_RADIUS}
              style={styles.appleButton}
              onPress={() => onPress(provider)}
            />
          </View>
        ) : (
          <GoogleButton key={provider} busy={busyProvider === provider} disabled={disabled && busyProvider !== provider} onPress={() => onPress(provider)} />
        ),
      )}
    </View>
  );
}
