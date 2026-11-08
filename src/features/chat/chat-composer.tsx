import { CameraOff, ImagePlus, SendHorizontal } from 'lucide-react-native';
import { Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import { CHAT_BODY_MAX_LENGTH } from '@/constants/chat';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { ChatAttachmentPreview } from './chat-attachment-preview';
import { CHAT_COPY } from './chat-copy';
import { COMPOSER_ICON_SIZE, DENIED_ICON_SIZE, composerBottomPadding, styles, useComposerInputStyles } from './chat-composer.styles';
import type { ChatAttachment } from './chat-thread-reducer';

interface ChatComposerProps {
  draft: string;
  canSend: boolean;
  attachment: ChatAttachment | null;
  cameraDenied: boolean;
  onChangeDraft: (text: string) => void;
  onSend: () => void;
  onAddPhoto: () => void;
  onRemovePhoto: () => void;
  onRetryUpload: () => void;
  onOpenSettings: () => void;
}

export function ChatComposer({
  draft,
  canSend,
  attachment,
  cameraDenied,
  onChangeDraft,
  onSend,
  onAddPhoto,
  onRemovePhoto,
  onRetryUpload,
  onOpenSettings,
}: ChatComposerProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const inputStyles = useComposerInputStyles();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.composer, backgroundStyles.surface, composerBottomPadding(insets.bottom)]}>
      {cameraDenied ? (
        <Pressable accessibilityRole="button" onPress={onOpenSettings} style={styles.denied}>
          <CameraOff size={DENIED_ICON_SIZE} color={colors.red} strokeWidth={2} />
          <Text variant="smallStrong" color="red" style={styles.deniedText}>
            {`${CHAT_COPY.cameraDenied} ${CHAT_COPY.openSettings}`}
          </Text>
        </Pressable>
      ) : null}
      {attachment ? <ChatAttachmentPreview attachment={attachment} onRemove={onRemovePhoto} onRetry={onRetryUpload} /> : null}
      <View style={styles.row}>
        <PressableScale
          pressedScale={0.92}
          onPress={onAddPhoto}
          disabled={attachment !== null}
          accessibilityRole="button"
          accessibilityLabel={CHAT_COPY.addPhoto}
          accessibilityState={{ disabled: attachment !== null }}
          style={[styles.roundButton, attachment ? backgroundStyles.raised : backgroundStyles.blue50]}>
          <ImagePlus size={COMPOSER_ICON_SIZE} color={attachment ? colors.muted : colors.blue} strokeWidth={1.8} />
        </PressableScale>
        <TextInput
          value={draft}
          onChangeText={onChangeDraft}
          placeholder={CHAT_COPY.inputPlaceholder}
          placeholderTextColor={colors.muted}
          accessibilityLabel={CHAT_COPY.inputLabel}
          maxLength={CHAT_BODY_MAX_LENGTH}
          multiline
          style={inputStyles.input}
        />
        <PressableScale
          pressedScale={0.92}
          onPress={onSend}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel={CHAT_COPY.send}
          accessibilityState={{ disabled: !canSend }}
          style={[styles.roundButton, canSend ? backgroundStyles.blue : backgroundStyles.raised]}>
          <SendHorizontal size={COMPOSER_ICON_SIZE} color={canSend ? colors.onBlue : colors.muted} strokeWidth={2} />
        </PressableScale>
      </View>
    </View>
  );
}
