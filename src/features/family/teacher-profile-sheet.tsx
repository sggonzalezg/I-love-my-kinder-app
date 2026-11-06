import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import type { RosterTeacher } from '@/data/family-room';
import { initials } from '@/lib/format';
import { space } from '@/theme/tokens';

interface TeacherProfileSheetProps {
  teacher: RosterTeacher | null;
  groupTitle: string;
  onClose: () => void;
}

export function TeacherProfileSheet({ teacher, groupTitle, onClose }: TeacherProfileSheetProps) {
  return (
    <Sheet visible={teacher !== null} onClose={onClose}>
      {teacher && (
        <View style={styles.content}>
          <Avatar photoPath={teacher.photo_path} initials={initials(teacher.first_name, teacher.last_name)} size="xl" />
          <Text variant="title" style={styles.centered}>
            {teacher.first_name} {teacher.last_name}
          </Text>
          <Text color="muted" style={styles.centered}>
            {teacher.role} · {groupTitle}
          </Text>
          <Button label="Cerrar" variant="plain" block onPress={onClose} style={styles.close} />
        </View>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: space.s2 },
  centered: { textAlign: 'center' },
  close: { marginTop: space.s4 },
});
