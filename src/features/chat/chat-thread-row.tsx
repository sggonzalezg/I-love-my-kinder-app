import { Users } from 'lucide-react-native';
import { View } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import type { ChatThreadSummary } from '@/data/chat';
import type { RoomRoster } from '@/data/family-room';
import { messagePreview, threadListMeta, threadTimeLabel } from '@/lib/chat';
import type { Role } from '@/lib/role';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { CHAT_COPY } from './chat-copy';
import { GROUP_ICON_SIZE, styles } from './chat-thread-row.styles';

interface ChatThreadRowProps {
  summary: ChatThreadSummary;
  roster: RoomRoster | null;
  userId: string;
  viewer: Role;
  childNames: string[];
  now: Date;
  onOpen: () => void;
}

export function ChatThreadRow({ summary, roster, userId, viewer, childNames, now, onOpen }: ChatThreadRowProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const { thread, latest, unread } = summary;
  const meta = roster
    ? threadListMeta({
        familyCount: roster.children.length,
        teacherFirstNames: roster.teachers.map((teacher) => teacher.first_name),
        childNames,
        viewer,
      })
    : null;
  const hasUnread = unread > 0;

  return (
    <PressableScale
      pressedScale={1}
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={[thread.label, meta, hasUnread ? CHAT_COPY.unreadLabel(unread) : null].filter(Boolean).join(', ')}
      style={({ pressed }) => [styles.row, pressed ? backgroundStyles.raised : backgroundStyles.surface]}>
      <View style={[styles.groupIcon, backgroundStyles.blue50]}>
        <Users size={GROUP_ICON_SIZE} color={colors.blue} strokeWidth={1.8} />
      </View>
      <View style={styles.texts}>
        <View style={styles.titleLine}>
          <Text variant="bodyStrong" numberOfLines={1}>
            {thread.label}
          </Text>
          {latest ? (
            <Text variant="caption" color="muted" numeric>
              {threadTimeLabel(latest.createdAt, now)}
            </Text>
          ) : null}
        </View>
        {meta ? (
          <Text variant="caption" color={viewer === 'director' && roster?.teachers.length === 0 ? 'red' : 'muted'}>
            {meta}
          </Text>
        ) : null}
        <Text variant={hasUnread ? 'smallStrong' : 'small'} color={hasUnread ? 'ink' : 'muted'} numberOfLines={1}>
          {messagePreview(latest, userId)}
        </Text>
      </View>
      {hasUnread ? (
        <View style={[styles.unread, backgroundStyles.red]}>
          <Text color="onRed" style={styles.unreadText}>
            {unread}
          </Text>
        </View>
      ) : null}
    </PressableScale>
  );
}
