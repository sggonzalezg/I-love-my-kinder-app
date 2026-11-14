import { Camera, Image as ImageIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import type { ChatPhotoSource } from '@/data/chat-photos';

import { styles } from './PhotoSourceSheet.styles';

export interface PhotoSourceCopy {
  title: string;
  takePhoto: string;
  choosePhoto: string;
  cancel: string;
}

interface PhotoSourceSheetProps {
  visible: boolean;
  copy: PhotoSourceCopy;
  onChoose: (source: ChatPhotoSource) => void;
  onClose: () => void;
  onDismiss: () => void;
}

export function PhotoSourceSheet({ visible, copy, onChoose, onClose, onDismiss }: PhotoSourceSheetProps) {
  return (
    <Sheet visible={visible} onClose={onClose} onDismiss={onDismiss}>
      <View style={styles.content}>
        <Text variant="title" accessibilityRole="header">
          {copy.title}
        </Text>
        <Button label={copy.takePhoto} icon={Camera} variant="soft" block onPress={() => onChoose('camera')} />
        <Button label={copy.choosePhoto} icon={ImageIcon} variant="soft" block onPress={() => onChoose('library')} />
        <Button label={copy.cancel} variant="plain" block onPress={onClose} />
      </View>
    </Sheet>
  );
}
