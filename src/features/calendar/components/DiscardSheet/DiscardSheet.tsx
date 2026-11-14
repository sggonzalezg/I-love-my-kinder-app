import { View } from 'react-native';

import { Button } from '@/components/button';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import { EVENT_FORM_COPY } from '@/features/calendar/event-form-copy';

import { styles } from './DiscardSheet.styles';

interface DiscardSheetProps {
  visible: boolean;
  onDiscard: () => void;
  onKeepEditing: () => void;
}

export function DiscardSheet({ visible, onDiscard, onKeepEditing }: DiscardSheetProps) {
  return (
    <Sheet visible={visible} onClose={onKeepEditing}>
      <Text variant="title" accessibilityRole="header">
        {EVENT_FORM_COPY.discardTitle}
      </Text>
      <View style={styles.actions}>
        <Button label={EVENT_FORM_COPY.discard} variant="danger" block onPress={onDiscard} />
        <Button label={EVENT_FORM_COPY.keepEditing} variant="plain" block onPress={onKeepEditing} />
      </View>
    </Sheet>
  );
}
