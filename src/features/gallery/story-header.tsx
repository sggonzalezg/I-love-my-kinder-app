import { Volume2, VolumeX, X } from 'lucide-react-native';
import { View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Text } from '@/components/text';
import type { MediaUploader } from '@/lib/gallery';

import { STORY_COPY } from './story-copy';
import { styles } from './story-header.styles';
import { StoryIconButton } from './story-icon-button';

interface StoryHeaderProps {
  uploader: MediaUploader | null;
  timeLabel: string;
  isVideo: boolean;
  muted: boolean;
  onToggleSound: () => void;
  onClose: () => void;
}

export function StoryHeader({ uploader, timeLabel, isVideo, muted, onToggleSound, onClose }: StoryHeaderProps) {
  return (
    <View style={styles.row}>
      {uploader ? <Avatar photoPath={uploader.photoPath} initials={uploader.initials} /> : null}
      <View style={styles.who}>
        {uploader ? (
          <Text variant="smallStrong" style={styles.onDark} numberOfLines={1}>
            {uploader.label}
          </Text>
        ) : null}
        <Text variant="caption" numeric style={styles.onDarkMuted}>
          {timeLabel}
        </Text>
      </View>
      {isVideo ? (
        <StoryIconButton icon={muted ? VolumeX : Volume2} label={muted ? STORY_COPY.soundOn : STORY_COPY.soundOff} onPress={onToggleSound} />
      ) : null}
      <StoryIconButton icon={X} label={STORY_COPY.close} onPress={onClose} />
    </View>
  );
}
