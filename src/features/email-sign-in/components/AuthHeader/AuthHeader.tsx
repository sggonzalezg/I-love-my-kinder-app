import { Image } from 'expo-image';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { EMAIL_SIGN_IN_COPY } from '@/features/email-sign-in/email-sign-in-copy';

import { styles } from './AuthHeader.styles';

const CLIENT_LOGO = require('@/assets/images/logo-client.png');

interface AuthHeaderProps {
  lede?: string;
}

export function AuthHeader({ lede }: AuthHeaderProps) {
  return (
    <View style={styles.head}>
      <Image source={CLIENT_LOGO} style={styles.logo} contentFit="contain" accessibilityLabel={EMAIL_SIGN_IN_COPY.logoLabel} />
      <Text variant="display" accessibilityRole="header" style={styles.title}>
        {EMAIL_SIGN_IN_COPY.entryTitle}
      </Text>
      {lede ? (
        <Text tone="muted" style={styles.lede}>
          {lede}
        </Text>
      ) : null}
    </View>
  );
}
