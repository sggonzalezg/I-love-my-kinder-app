import { Shield } from 'lucide-react-native';
import { View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import type { RoomRoster } from '@/data/family-room';
import { initials } from '@/lib/format';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { CHAT_COPY } from './chat-copy';
import { DIRECTION_ICON_SIZE, styles } from './chat-members-sheet.styles';

interface ChatMembersSheetProps {
  visible: boolean;
  title: string;
  roster: RoomRoster | null;
  onClose: () => void;
}

// No contract lists the families by name yet, so they show as a count (SDD gap 15).
export function ChatMembersSheet({ visible, title, roster, onClose }: ChatMembersSheetProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <Sheet visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <Text variant="title" accessibilityRole="header">
          {title}
        </Text>
        <Text variant="small" color="muted">
          {CHAT_COPY.membersTitleHint}
        </Text>
        <Text variant="section" style={styles.section}>
          {CHAT_COPY.membersStaff}
        </Text>
        {(roster?.teachers ?? []).map((teacher) => (
          <View key={teacher.id} style={styles.row}>
            <Avatar photoPath={teacher.photo_path} initials={initials(teacher.first_name, teacher.last_name)} />
            <View style={styles.texts}>
              <Text variant="bodyStrong">{`${teacher.first_name} ${teacher.last_name}`}</Text>
              <Text variant="small" color="muted">
                {teacher.role}
              </Text>
            </View>
          </View>
        ))}
        <View style={styles.row}>
          <View style={[styles.directionIcon, backgroundStyles.blue50]}>
            <Shield size={DIRECTION_ICON_SIZE} color={colors.blue} strokeWidth={1.8} />
          </View>
          <Text variant="bodyStrong" style={styles.texts}>
            {CHAT_COPY.direction}
          </Text>
        </View>
        <Text variant="section" style={styles.section}>
          {CHAT_COPY.membersFamilies(roster?.children.length ?? 0)}
        </Text>
        <Text variant="small" color="muted">
          {CHAT_COPY.membersFamiliesNote}
        </Text>
        <Button label={CHAT_COPY.close} variant="plain" block onPress={onClose} style={styles.close} />
      </View>
    </Sheet>
  );
}
