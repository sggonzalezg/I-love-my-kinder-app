import { Image } from 'expo-image';

import { STORY_COPY } from './story-copy';
import { styles } from './story-media.styles';
import type { StoryMediaStatus } from './story-viewer-reducer';

interface StoryPhotoProps {
  url: string;
  onStatusChange: (status: StoryMediaStatus) => void;
}

export function StoryPhoto({ url, onStatusChange }: StoryPhotoProps) {
  return (
    <Image
      source={{ uri: url }}
      style={styles.media}
      contentFit="cover"
      accessibilityLabel={STORY_COPY.photoLabel}
      onLoad={() => onStatusChange('ready')}
      onError={() => onStatusChange('failed')}
    />
  );
}
