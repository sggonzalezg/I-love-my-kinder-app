import { CloudOff, RefreshCw } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';

import { STORY_COPY } from './story-copy';
import { STORY_ICON_COLOR } from './story-icon-button.styles';
import { ERROR_ICON_SIZE, styles } from './story-load-error.styles';
import { StoryPillButton } from './story-pill-button';

interface StoryLoadErrorProps {
  isVideo: boolean;
  onRetry: () => void;
}

export function StoryLoadError({ isVideo, onRetry }: StoryLoadErrorProps) {
  return (
    <View style={styles.block} accessibilityLiveRegion="polite">
      <CloudOff size={ERROR_ICON_SIZE} color={STORY_ICON_COLOR} strokeWidth={1.8} />
      <Text variant="title" style={styles.title}>
        {isVideo ? STORY_COPY.videoFailedTitle : STORY_COPY.photoFailedTitle}
      </Text>
      <Text style={styles.body}>{STORY_COPY.failedBody}</Text>
      <StoryPillButton label={STORY_COPY.retry} icon={RefreshCw} onPress={onRetry} />
    </View>
  );
}
