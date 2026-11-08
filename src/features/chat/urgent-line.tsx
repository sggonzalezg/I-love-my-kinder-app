import { Phone } from 'lucide-react-native';
import { Linking, Pressable } from 'react-native';

import { Text } from '@/components/text';
import { CHAT_FIXED } from '@/legal/texts';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { CHAT_COPY } from './chat-copy';
import { URGENT_ICON_SIZE, styles } from './urgent-line.styles';

/** Pinned under the header and never closable (legal 7.2): the chat is not for emergencies. */
export function UrgentLine({ phone }: { phone: string }) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <Pressable
      style={[styles.line, backgroundStyles.blue50]}
      onPress={() => Linking.openURL(`tel:${phone}`)}
      accessibilityRole="button"
      accessibilityHint={CHAT_COPY.callUrgent}>
      <Phone size={URGENT_ICON_SIZE} color={colors.blue} strokeWidth={2} />
      <Text variant="caption" style={styles.text}>
        {CHAT_FIXED.urgent(phone)}
      </Text>
    </Pressable>
  );
}
