import { Image } from 'expo-image';
import { RefreshCw, X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { ATTACHMENT_ENTERING, PLATE_ICON_SIZE, RETRY_ICON_SIZE, progressFillStyle, styles } from './chat-attachment-preview.styles';
import { CHAT_COPY } from './chat-copy';
import type { ChatAttachment } from './chat-thread-reducer';

const PERCENT = 100;

interface ChatAttachmentPreviewProps {
  attachment: ChatAttachment;
  onRemove: () => void;
  onRetry: () => void;
}

export function ChatAttachmentPreview({ attachment, onRemove, onRetry }: ChatAttachmentPreviewProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const failed = attachment.status === 'failed';
  const percent = Math.round(attachment.progress * PERCENT);

  return (
    <View style={styles.root}>
      {failed ? (
        <Pressable accessibilityRole="button" onPress={onRetry} style={styles.error}>
          <RefreshCw size={RETRY_ICON_SIZE} color={colors.red} strokeWidth={2} />
          <Text variant="smallStrong" color="red">
            {CHAT_COPY.uploadFailed}
          </Text>
        </Pressable>
      ) : null}
      <Animated.View entering={ATTACHMENT_ENTERING} style={styles.preview}>
        <Image source={{ uri: attachment.localUri }} style={styles.image} contentFit="cover" accessibilityLabel={CHAT_COPY.photoToSend} />
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={CHAT_COPY.removePhoto}
          onPress={onRemove}
          containerStyle={styles.remove}
          style={styles.removeTouch}>
          <View style={styles.plate}>
            <X size={PLATE_ICON_SIZE} color={colors.white} strokeWidth={2} />
          </View>
        </PressableScale>
        {attachment.status === 'uploaded' ? null : (
          <View
            style={[styles.track, backgroundStyles.blue100]}
            accessibilityRole="progressbar"
            accessibilityLabel={failed ? CHAT_COPY.uploadFailed : CHAT_COPY.uploadingPhoto(percent)}
            accessibilityValue={{ min: 0, max: PERCENT, now: percent }}>
            <Animated.View style={[styles.fill, failed ? backgroundStyles.red : backgroundStyles.blue, progressFillStyle(failed ? 1 : attachment.progress)]} />
          </View>
        )}
      </Animated.View>
    </View>
  );
}
