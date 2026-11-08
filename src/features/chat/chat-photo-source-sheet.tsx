import { Camera, Image as ImageIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import type { ChatPhotoSource } from '@/data/chat-photos';

import { CHAT_COPY } from './chat-copy';
import { styles } from './chat-photo-source-sheet.styles';

interface ChatPhotoSourceSheetProps {
  visible: boolean;
  onChoose: (source: ChatPhotoSource) => void;
  onClose: () => void;
  onDismiss: () => void;
}

export function ChatPhotoSourceSheet({ visible, onChoose, onClose, onDismiss }: ChatPhotoSourceSheetProps) {
  return (
    <Sheet visible={visible} onClose={onClose} onDismiss={onDismiss}>
      <View style={styles.content}>
        <Text variant="title" accessibilityRole="header">
          {CHAT_COPY.photoSourceTitle}
        </Text>
        <Button label={CHAT_COPY.takePhoto} icon={Camera} variant="soft" block onPress={() => onChoose('camera')} />
        <Button label={CHAT_COPY.choosePhoto} icon={ImageIcon} variant="soft" block onPress={() => onChoose('library')} />
        <Button label={CHAT_COPY.cancel} variant="plain" block onPress={onClose} />
      </View>
    </Sheet>
  );
}
