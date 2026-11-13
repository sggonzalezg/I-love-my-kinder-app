import { View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Text } from '@/components/text';
import type { GroupTeacher } from '@/lib/child-day';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './TeacherNote.styles';

interface TeacherNoteProps {
  text: string;
  teacher: GroupTeacher | null;
}

export function TeacherNote({ text, teacher }: TeacherNoteProps) {
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={styles.note}>
      {teacher ? <Avatar photoPath={teacher.photoPath} initials={teacher.initials} /> : null}
      <View style={[styles.bubble, backgroundStyles.blue50]}>
        <Text>{text}</Text>
      </View>
    </View>
  );
}
