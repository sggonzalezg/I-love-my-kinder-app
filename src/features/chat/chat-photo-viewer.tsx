import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { X } from 'lucide-react-native';
import { ActivityIndicator, Modal, View } from 'react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/text';
import { StoryIconButton } from '@/features/gallery/story-icon-button';
import { STORY_ICON_COLOR } from '@/features/gallery/story-icon-button.styles';
import { StoryLoadError } from '@/features/gallery/story-load-error';
import { StoryScrim } from '@/features/gallery/story-scrim';
import { storyTimeLabel } from '@/lib/story';

import { CHAT_COPY } from './chat-copy';
import { styles, topInsetStyle } from './chat-photo-viewer.styles';
import type { DisplayedMessage } from './chat-thread-reducer';
import { usePhotoViewerGestures } from './use-photo-viewer-gestures';
import { useChatPhotoUri } from './use-chat-photo-uri';

interface ChatPhotoViewerProps {
  message: DisplayedMessage;
  senderLine: string;
  onClose: () => void;
}

/** Chat photos have no "Guardar": saving to the phone belongs only to the Galería (design F13). */
export function ChatPhotoViewer({ message, senderLine, onClose }: ChatPhotoViewerProps) {
  const insets = useSafeAreaInsets();
  const photo = useChatPhotoUri(message, false);
  const { gesture, stageStyle, photoStyle } = usePhotoViewerGestures(onClose);

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="light" />
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.stage, stageStyle]}>
            {photo.uri ? (
              <Animated.View style={[styles.photo, photoStyle]}>
                <Image source={{ uri: photo.uri }} style={styles.photo} contentFit="contain" accessibilityLabel={CHAT_COPY.photo} />
              </Animated.View>
            ) : null}
            {!photo.uri && !photo.failed ? <ActivityIndicator size="large" color={STORY_ICON_COLOR} style={styles.photo} /> : null}
            {photo.failed ? <StoryLoadError isVideo={false} onRetry={photo.reload} /> : null}
            <StoryScrim edge="top" />
            <View style={[styles.top, topInsetStyle(insets.top)]}>
              <StoryIconButton icon={X} label={CHAT_COPY.closePhoto} onPress={onClose} />
              <View style={styles.who}>
                <Text variant="smallStrong" style={styles.onDark} numberOfLines={1}>
                  {senderLine}
                </Text>
                <Text variant="caption" numeric style={styles.onDarkMuted}>
                  {storyTimeLabel(message.createdAt, new Date(), null)}
                </Text>
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}
