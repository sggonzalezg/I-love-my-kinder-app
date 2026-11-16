import { Mail } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { ACCOUNT_ICON_SIZE, styles, useAccountChipStyles } from './AccountChip.styles';

interface AccountChipProps {
  email: string;
}

/** Shows which account the person is using, so they notice when it is not the one they meant. */
export function AccountChip({ email }: AccountChipProps) {
  const colors = useColors();
  const themed = useAccountChipStyles();
  return (
    <View style={[styles.chip, themed.chip]}>
      <Mail size={ACCOUNT_ICON_SIZE} color={colors.ink} strokeWidth={iconStroke.regular} />
      <Text variant="bodyStrong" numberOfLines={1} style={styles.email}>
        {email}
      </Text>
    </View>
  );
}
