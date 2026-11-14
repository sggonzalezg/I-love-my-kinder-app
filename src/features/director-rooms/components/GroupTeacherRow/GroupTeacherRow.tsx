import { View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Text } from '@/components/text';
import type { RosterTeacher } from '@/data/family-room';
import { initials } from '@/lib/format';

import { styles } from './GroupTeacherRow.styles';

export function GroupTeacherRow({ teacher }: { teacher: RosterTeacher }) {
  const fullName = `${teacher.first_name} ${teacher.last_name}`;
  return (
    <View style={styles.row} accessible accessibilityLabel={fullName}>
      <Avatar photoPath={teacher.photo_path} initials={initials(teacher.first_name, teacher.last_name)} />
      <Text variant="bodyStrong" numberOfLines={1} style={styles.name}>
        {fullName}
      </Text>
    </View>
  );
}
