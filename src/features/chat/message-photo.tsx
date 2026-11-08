import { Image } from 'expo-image';
import { Lock, RefreshCw } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/text';
import type { ChatPhotoVisibility } from '@/lib/chat-photo';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { CHAT_COPY } from './chat-copy';
import type { DisplayedMessage } from './chat-thread-reducer';
import { BLOCK_ICON_SIZE, PHOTO_FADE_MS, styles } from './message-photo.styles';
import { useChatPhotoUri } from './use-chat-photo-uri';

interface MessagePhotoProps {
  message: DisplayedMessage;
  visibility: ChatPhotoVisibility;
  onOpen: () => void;
}

export function MessagePhoto({ message, visibility, onOpen }: MessagePhotoProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const photo = useChatPhotoUri(message, visibility !== 'visible');

  if (visibility === 'hidden') {
    return (
      <View style={[styles.block, backgroundStyles.raised]}>
        <Lock size={BLOCK_ICON_SIZE} color={colors.muted} strokeWidth={1.8} />
        <Text variant="smallStrong" color="muted" style={styles.blockText}>
          {CHAT_COPY.photoBeforeJoin}
        </Text>
      </View>
    );
  }
  if (photo.failed) {
    return (
      <Pressable accessibilityRole="button" onPress={photo.reload} style={[styles.block, backgroundStyles.raised]}>
        <RefreshCw size={BLOCK_ICON_SIZE} color={colors.muted} strokeWidth={1.8} />
        <Text variant="smallStrong" color="muted" style={styles.blockText}>
          {`${CHAT_COPY.photoLoadError} · ${CHAT_COPY.retry}`}
        </Text>
      </Pressable>
    );
  }
  return (
    <Pressable
      accessibilityRole="imagebutton"
      accessibilityLabel={CHAT_COPY.photo}
      accessibilityHint={CHAT_COPY.openPhoto}
      disabled={!photo.uri}
      onPress={onOpen}
      style={[styles.photo, backgroundStyles.raised]}>
      {photo.uri ? <Image source={{ uri: photo.uri }} style={styles.photo} contentFit="cover" transition={PHOTO_FADE_MS} /> : null}
    </Pressable>
  );
}
