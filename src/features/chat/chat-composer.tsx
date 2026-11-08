import { SendHorizontal } from 'lucide-react-native';
import { TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/pressable-scale';
import { CHAT_BODY_MAX_LENGTH } from '@/constants/chat';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { CHAT_COPY } from './chat-copy';
import { SEND_ICON_SIZE, composerBottomPadding, styles, useComposerInputStyles } from './chat-composer.styles';

interface ChatComposerProps {
  draft: string;
  onChangeDraft: (text: string) => void;
  onSend: () => void;
}

export function ChatComposer({ draft, onChangeDraft, onSend }: ChatComposerProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const inputStyles = useComposerInputStyles();
  const insets = useSafeAreaInsets();
  const canSend = draft.trim().length > 0;

  return (
    <View style={[styles.composer, backgroundStyles.surface, composerBottomPadding(insets.bottom)]}>
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
        style={[styles.send, canSend ? backgroundStyles.blue : backgroundStyles.raised]}>
        <SendHorizontal size={SEND_ICON_SIZE} color={canSend ? colors.onBlue : colors.muted} strokeWidth={2} />
      </PressableScale>
    </View>
  );
}
