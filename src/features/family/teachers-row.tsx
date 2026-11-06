import { ScrollView, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import type { RosterTeacher } from '@/data/family-room';
import { initials } from '@/lib/format';
import { space } from '@/theme/tokens';

const TEACHER_TILE_WIDTH = 84;

interface TeachersRowProps {
  teachers: RosterTeacher[];
  onOpen: (teacher: RosterTeacher) => void;
}

export function TeachersRow({ teachers, onOpen }: TeachersRowProps) {
  return (
    <View style={styles.section}>
      <Text variant="section">Maestras</Text>
      {teachers.length === 0 ? (
        <Text color="muted">Esta sala todavía no tiene maestra asignada.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {teachers.map((teacher) => (
            <PressableScale
              key={teacher.id}
              accessibilityRole="button"
              accessibilityLabel={`${teacher.first_name}, ${teacher.role}. Ver perfil`}
              onPress={() => onOpen(teacher)}
              style={styles.tile}>
              <Avatar photoPath={teacher.photo_path} initials={initials(teacher.first_name, teacher.last_name)} size="lg" />
              <Text variant="smallStrong" numberOfLines={1}>
                {teacher.first_name}
              </Text>
              <Text variant="caption" color="muted">
                {teacher.role}
              </Text>
            </PressableScale>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.s3 },
  row: { gap: space.s4 },
  tile: { width: TEACHER_TILE_WIDTH, alignItems: 'center', gap: space.s1 },
});
