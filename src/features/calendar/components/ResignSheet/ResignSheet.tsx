import { ClipboardCheck } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import { EVENT_FORM_COPY } from '@/features/calendar/event-form-copy';

import { styles } from './ResignSheet.styles';

interface ResignSheetProps {
  visible: boolean;
  text: string;
  onConfirm: () => void;
  onKeepEditing: () => void;
}

export function ResignSheet({ visible, text, onConfirm, onKeepEditing }: ResignSheetProps) {
  return (
    <Sheet visible={visible} onClose={onKeepEditing}>
      <Text variant="title" accessibilityRole="header">
        {EVENT_FORM_COPY.resignTitle}
      </Text>
      <Text style={styles.body}>{text}</Text>
      <View style={styles.actions}>
        <Button label={EVENT_FORM_COPY.resignConfirm} icon={ClipboardCheck} block onPress={onConfirm} />
        <Button label={EVENT_FORM_COPY.keepEditing} variant="plain" block onPress={onKeepEditing} />
      </View>
    </Sheet>
  );
}
