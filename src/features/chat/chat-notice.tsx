import * as Haptics from 'expo-haptics';
import { useReducer } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import ConsentCheckbox from '@/components/consent-checkbox';
import { Text } from '@/components/text';
import { recordConsent } from '@/data/consent';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { CHAT_COPY } from './chat-copy';
import { CHAT_NOTICE_ACTIONS, INITIAL_CHAT_NOTICE_STATE, chatNoticeReducer } from './chat-notice-reducer';
import { actionsBottomPadding, styles } from './chat-notice.styles';
import { NoticeBullet } from './notice-bullet';
import type { ChatNoticeText } from './use-chat-notice';

interface ChatNoticeProps {
  notice: ChatNoticeText;
  urgentPhone: string;
  screen: string;
  onAccepted: () => void;
}

export function ChatNotice({ notice, urgentPhone, screen, onAccepted }: ChatNoticeProps) {
  const [state, dispatch] = useReducer(chatNoticeReducer, INITIAL_CHAT_NOTICE_STATE);
  const backgroundStyles = useBackgroundColorStyles();
  const insets = useSafeAreaInsets();
  const [keyBullet, ...bullets] = notice.bullets(urgentPhone);

  function toggle() {
    Haptics.selectionAsync();
    dispatch({ type: CHAT_NOTICE_ACTIONS.TOGGLED });
  }

  async function accept() {
    dispatch({ type: CHAT_NOTICE_ACTIONS.SAVE_STARTED });
    try {
      await recordConsent({ documentId: notice.id, version: notice.version, accepted: true, screen });
      onAccepted();
    } catch (error) {
      console.warn('Recording the chat notice failed:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: CHAT_NOTICE_ACTIONS.SAVE_FAILED });
    }
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="title" accessibilityRole="header">
          {notice.title}
        </Text>
        <View style={styles.bullets}>
          <View style={[styles.bullet, backgroundStyles.blue50]}>
            <NoticeBullet text={keyBullet} />
          </View>
          {bullets.map((bullet) => (
            <View key={bullet} style={[styles.bullet, backgroundStyles.surface]}>
              <NoticeBullet text={bullet} />
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={[styles.actions, actionsBottomPadding(insets.bottom)]}>
        <ConsentCheckbox checked={state.checked} onPress={toggle} label={<Text style={styles.checkboxLabel}>{notice.checkbox}</Text>} />
        {state.failed ? (
          <Text variant="small" color="red" accessibilityRole="alert">
            {CHAT_COPY.noticeSaveError}
          </Text>
        ) : null}
        <Button label={CHAT_COPY.continue} variant="plain" block disabled={!state.checked} loading={state.saving} onPress={accept} />
      </View>
    </View>
  );
}
