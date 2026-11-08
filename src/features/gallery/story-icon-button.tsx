import type { LucideIcon } from 'lucide-react-native';

import { PressableScale } from '@/components/pressable-scale';

import { STORY_ICON_COLOR, STORY_ICON_SIZE, styles } from './story-icon-button.styles';

interface StoryIconButtonProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}

export function StoryIconButton({ icon: Icon, label, onPress }: StoryIconButtonProps) {
  return (
    <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={styles.button}>
      <Icon size={STORY_ICON_SIZE} color={STORY_ICON_COLOR} strokeWidth={2} />
    </PressableScale>
  );
}
