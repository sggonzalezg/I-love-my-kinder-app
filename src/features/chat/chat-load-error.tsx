import { View } from 'react-native';

import { Button } from '@/components/button';
import { Text } from '@/components/text';

import { CHAT_COPY } from './chat-copy';
import { styles } from './chat-list-screen.styles';

export function ChatLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.error}>
      <Text color="red">{CHAT_COPY.loadError}</Text>
      <Button label={CHAT_COPY.retry} variant="soft" onPress={onRetry} />
    </View>
  );
}
