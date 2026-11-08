import { CheckCheck, RefreshCw } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';

import { Text } from '@/components/text';
import { formatTime } from '@/lib/dates';
import { senderLine } from '@/lib/chat';
import type { ChatPhotoVisibility } from '@/lib/chat-photo';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { duration, easeOut, messageRise } from '@/theme/motion';
import { useColors } from '@/theme/use-theme';

import { CHAT_COPY } from './chat-copy';
import type { DisplayedMessage } from './chat-thread-reducer';
import { RETRY_ICON_SIZE, SEEN_ICON_SIZE, styles, useFailedOutlineStyles } from './message-bubble.styles';
import { MessagePhoto } from './message-photo';

const ENTERING = FadeInDown.duration(duration.base)
  .easing(easeOut)
  .withInitialValues({ transform: [{ translateY: messageRise }] })
  .reduceMotion(ReduceMotion.System);

interface MessageBubbleProps {
  message: DisplayedMessage;
  own: boolean;
  seenBy: number;
  animateEntry: boolean;
  photoVisibility: ChatPhotoVisibility;
  onRetry: (clientId: string) => void;
  onOpenPhoto: () => void;
}

export function MessageBubble({ message, own, seenBy, animateEntry, photoVisibility, onRetry, onOpenPhoto }: MessageBubbleProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const failedStyles = useFailedOutlineStyles();
  const time = formatTime(new Date(message.createdAt));
  const showSeen = own && message.status === 'sent' && seenBy > 0;

  return (
    <Animated.View entering={animateEntry ? ENTERING : undefined} style={[styles.message, own && styles.own]}>
      {own ? null : (
        <Text variant="caption" color="muted" style={styles.sender}>
          {senderLine(message.senderRole, message.senderLabel)}
        </Text>
      )}
      <View style={[styles.bubble, own ? [styles.ownBubble, backgroundStyles.blue100] : backgroundStyles.surface, message.status === 'failed' && failedStyles.failed]}>
        {message.imagePath ? (
          <View style={message.body ? styles.photoWithText : null}>
            <MessagePhoto message={message} visibility={photoVisibility} onOpen={onOpenPhoto} />
          </View>
        ) : null}
        {message.body ? <Text>{message.body}</Text> : null}
      </View>
      {message.status === 'failed' && message.clientId ? (
        <Pressable accessibilityRole="button" onPress={() => onRetry(message.clientId!)} style={styles.retry}>
          <RefreshCw size={RETRY_ICON_SIZE} color={colors.red} strokeWidth={2} />
          <Text variant="smallStrong" color="red">
            {CHAT_COPY.failed}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.footer}>
          <Text variant="caption" color="muted" numeric>
            {message.status === 'sending' ? CHAT_COPY.sending : `${time}${showSeen ? ' ·' : ''}`}
          </Text>
          {showSeen ? (
            <>
              <CheckCheck size={SEEN_ICON_SIZE} color={colors.blue} strokeWidth={2} />
              <Text variant="caption" color="muted" numeric>
                {CHAT_COPY.seenBy(seenBy)}
              </Text>
            </>
          ) : null}
        </View>
      )}
    </Animated.View>
  );
}
