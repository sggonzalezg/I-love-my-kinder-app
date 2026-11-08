import { ChevronLeft, Users } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { IconButton } from '@/components/icon-button';
import { Text } from '@/components/text';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { CHAT_COPY } from './chat-copy';
import { GROUP_ICON_SIZE, styles } from './chat-thread-header.styles';

interface ChatThreadHeaderProps {
  title: string;
  membersLine: string | null;
  onBack: () => void;
  onOpenMembers: () => void;
}

export function ChatThreadHeader({ title, membersLine, onBack, onOpenMembers }: ChatThreadHeaderProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={styles.header}>
      <IconButton icon={ChevronLeft} label={CHAT_COPY.backToChats} ghost onPress={onBack} />
      <View style={[styles.groupIcon, backgroundStyles.blue50]}>
        <Users size={GROUP_ICON_SIZE} color={colors.blue} strokeWidth={1.8} />
      </View>
      <Pressable style={styles.titles} onPress={onOpenMembers} accessibilityRole="button" accessibilityHint={CHAT_COPY.openMembers}>
        <Text variant="section" accessibilityRole="header" numberOfLines={1}>
          {title}
        </Text>
        {membersLine ? (
          <Text variant="caption" color="muted" numberOfLines={1}>
            {membersLine}
          </Text>
        ) : null}
      </Pressable>
    </View>
  );
}
