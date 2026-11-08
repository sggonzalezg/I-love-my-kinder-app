import { router } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { CHAT_LIST_ROUTE } from '@/constants/chat';
import type { Role } from '@/lib/role';
import { useColors } from '@/theme/use-theme';

import { CHAT_COPY } from './chat-copy';
import { LOCK_ICON_SIZE, styles } from './chat-thread-screen.styles';

export function ChatUnavailable({ role }: { role: Role }) {
  const colors = useColors();
  return (
    <View style={styles.unavailable}>
      <Lock size={LOCK_ICON_SIZE} color={colors.muted} strokeWidth={1.8} />
      <Text variant="section" accessibilityRole="header">
        {CHAT_COPY.unavailableTitle}
      </Text>
      <Text color="muted" style={styles.centered}>
        {CHAT_COPY.unavailableBody[role]}
      </Text>
      <Button label={CHAT_COPY.seeMyChats} variant="soft" onPress={() => router.replace(CHAT_LIST_ROUTE)} />
    </View>
  );
}
