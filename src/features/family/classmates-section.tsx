import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { Avatar } from '@/components/avatar';
import { Text } from '@/components/text';
import type { RosterChild } from '@/data/family-room';
import { birthdayLabel } from '@/lib/birthdays';
import { classmateInitials, classmateName } from '@/lib/classmates';
import { duration, easeOut, listRise, listStagger } from '@/theme/motion';
import { radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

const STAGGERED_ROWS = 6;

export function ClassmatesSection({ classmates }: { classmates: RosterChild[] }) {
  const c = useColors();
  const reduced = useReducedMotion();
  const entering = (index: number) =>
    reduced || index >= STAGGERED_ROWS
      ? undefined
      : FadeInDown.duration(duration.slow)
          .delay(index * listStagger)
          .easing(easeOut)
          .withInitialValues({ transform: [{ translateY: listRise }] });

  return (
    <View style={styles.section}>
      <Text variant="section">Compañeros</Text>
      <View style={[styles.list, { backgroundColor: c.surface }]}>
        {classmates.map((child, index) => (
          <Animated.View
            key={child.id}
            entering={entering(index)}
            style={[styles.row, index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }]}>
            <Avatar photoPath={child.photo_path} initials={classmateInitials(child)} />
            <View style={styles.rowText}>
              <Text variant="bodyStrong">{classmateName(child)}</Text>
              {child.birth_date && (
                <Text variant="small" color="muted">
                  {birthdayLabel(child.birth_date)}
                </Text>
              )}
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.s3 },
  list: { borderRadius: radius.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, padding: space.s3 },
  rowText: { flex: 1 },
});
