import { Check, ChevronRight, Download } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';

import { styles } from './story-bottom-bar.styles';
import { STORY_COPY } from './story-copy';
import { StoryPillButton } from './story-pill-button';

interface StoryBottomBarProps {
  groupLabel: string;
  failed: boolean;
  saving: boolean;
  saved: boolean;
  onSave: () => void;
  onNext: () => void;
}

export function StoryBottomBar({ groupLabel, failed, saving, saved, onSave, onNext }: StoryBottomBarProps) {
  return (
    <View style={styles.row}>
      <Text variant="smallStrong" style={styles.label} numberOfLines={1}>
        {groupLabel}
      </Text>
      {failed ? (
        <StoryPillButton label={STORY_COPY.next} icon={ChevronRight} iconAfter onPress={onNext} />
      ) : saved ? (
        <StoryPillButton label={STORY_COPY.saved} icon={Check} onPress={onSave} disabled />
      ) : (
        <StoryPillButton label={STORY_COPY.save} icon={Download} onPress={onSave} loading={saving} />
      )}
    </View>
  );
}
