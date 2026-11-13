import { View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Text } from '@/components/text';
import { CHILD_DAY_COPY } from '@/features/child-day/child-day-copy';
import type { GroupTeacher } from '@/lib/child-day';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './NotYetCard.styles';

interface NotYetCardProps {
  teacher: GroupTeacher | null;
  line: string;
}

export function NotYetCard({ teacher, line }: NotYetCardProps) {
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={[styles.card, backgroundStyles.surface]} accessible>
      {teacher ? <Avatar photoPath={teacher.photoPath} initials={teacher.initials} size="lg" /> : null}
      <View style={styles.texts}>
        <Text variant="section">{CHILD_DAY_COPY.notYetTitle}</Text>
        <Text variant="small" tone="muted">
          {line}
        </Text>
      </View>
    </View>
  );
}
