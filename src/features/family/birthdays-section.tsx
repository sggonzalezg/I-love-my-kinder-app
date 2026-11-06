import { Heart } from 'lucide-react-native';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Text } from '@/components/text';
import { upcomingBirthdays, type BirthdayChild, type UpcomingBirthday } from '@/lib/birthdays';
import { duration } from '@/theme/motion';
import { fonts, radius, space, tabular } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

const BIRTHDAY_PHOTO = require('@/assets/images/birthday-paige-cody.jpg');
const BIRTHDAY_PHOTO_HEIGHT = 140;
const DATE_TILE_SIZE = 48;
const HEART_SIZE = 20;
const heartBeat = { '0%': { transform: [{ scale: 1 }] }, '30%': { transform: [{ scale: 1.18 }] }, '60%': { transform: [{ scale: 1 }] } };

interface BirthdaysSectionProps {
  classmates: (BirthdayChild & { firstName: string })[];
}

export function BirthdaysSection({ classmates }: BirthdaysSectionProps) {
  const birthdays = upcomingBirthdays(classmates, new Date());
  const firstNameOf = (id: string) => classmates.find((child) => child.id === id)?.firstName ?? '';
  const today = birthdays.filter((birthday) => birthday.isToday);
  const later = birthdays.filter((birthday) => !birthday.isToday);

  return (
    <View style={styles.section}>
      <Text variant="section">Próximos cumples</Text>
      {birthdays.length === 0 && <Text color="muted">No hay cumpleaños en los próximos dos meses.</Text>}
      {today.map((birthday) => (
        <BirthdayTodayCard key={birthday.id} birthday={birthday} firstName={firstNameOf(birthday.id)} />
      ))}
      {later.map((birthday) => (
        <BirthdayRow key={birthday.id} birthday={birthday} />
      ))}
    </View>
  );
}

function BirthdayTodayCard({ birthday, firstName }: { birthday: UpcomingBirthday; firstName: string }) {
  const c = useColors();
  const reduced = useReducedMotion();
  const beat = reduced
    ? null
    : { animationName: heartBeat, animationDuration: duration.beat, animationIterationCount: 'infinite' as const };

  return (
    <View style={[styles.todayCard, { backgroundColor: c.surface }]}>
      <Image source={BIRTHDAY_PHOTO} style={styles.todayPhoto} accessibilityLabel="Torta de cumpleaños" />
      <View style={styles.todayText}>
        <View style={styles.todayTitle}>
          <Animated.View style={beat}>
            <Heart size={HEART_SIZE} color={c.heart} fill={c.heart} />
          </Animated.View>
          <Text variant="bodyStrong">Hoy cumple {firstName}</Text>
        </View>
        <Text variant="small" color="muted">
          {birthday.ageTurning} años
        </Text>
      </View>
    </View>
  );
}

function BirthdayRow({ birthday }: { birthday: UpcomingBirthday }) {
  const c = useColors();
  return (
    <View style={[styles.row, { backgroundColor: c.surface }]}>
      <View style={[styles.dateTile, { backgroundColor: c.blue50 }]}>
        <Text style={[styles.dateDay, { color: c.blue }]}>{birthday.day}</Text>
        <Text variant="caption" color="blue">
          {birthday.monthShort}
        </Text>
      </View>
      <View style={styles.rowText}>
        <Text variant="bodyStrong">{birthday.name}</Text>
        <Text variant="small" color="muted">
          {birthday.weekday}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.s3 },
  todayCard: { borderRadius: radius.lg, overflow: 'hidden' },
  todayPhoto: { width: '100%', height: BIRTHDAY_PHOTO_HEIGHT },
  todayText: { padding: space.s4, gap: space.s1 },
  todayTitle: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, padding: space.s3, borderRadius: radius.lg },
  dateTile: { width: DATE_TILE_SIZE, height: DATE_TILE_SIZE, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  dateDay: { fontFamily: fonts.display800, fontSize: 18, lineHeight: 20, ...tabular },
  rowText: { flex: 1 },
});
