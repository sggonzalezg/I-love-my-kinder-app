import { View } from 'react-native';

import { Text } from '@/components/text';
import { SOCIAL_SIGN_IN_COPY } from '@/features/email-sign-in/email-sign-in-copy';

import { styles, useOrDividerStyles } from './OrDivider.styles';

export function OrDivider() {
  const themed = useOrDividerStyles();
  return (
    <View style={styles.row}>
      <View style={[styles.line, themed.line]} />
      <Text variant="small" tone="muted">
        {SOCIAL_SIGN_IN_COPY.orWithEmail}
      </Text>
      <View style={[styles.line, themed.line]} />
    </View>
  );
}
