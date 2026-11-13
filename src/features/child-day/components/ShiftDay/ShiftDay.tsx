import { Check, Moon, Pencil, Utensils } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { HygieneIcon } from '@/components/HygieneIcon/HygieneIcon';
import { Text } from '@/components/text';
import { CHILD_DAY_COPY } from '@/features/child-day/child-day-copy';
import { MealRow } from '@/features/child-day/components/MealRow/MealRow';
import { NotYetCard } from '@/features/child-day/components/NotYetCard/NotYetCard';
import { RoutineCard } from '@/features/child-day/components/RoutineCard/RoutineCard';
import { ShiftBand } from '@/features/child-day/components/ShiftBand/ShiftBand';
import { ShiftSeal } from '@/features/child-day/components/ShiftSeal/ShiftSeal';
import { TeacherNote } from '@/features/child-day/components/TeacherNote/TeacherNote';
import { TimeRow } from '@/features/child-day/components/TimeRow/TimeRow';
import type { ShownGroup } from '@/features/child-day/use-child-day';
import {
  bandLine,
  hasRest,
  hygieneBlocks,
  mealRows,
  notYetLine,
  restDuration,
  savedTimeOf,
  sealLine,
  sealTitle,
  type DayRoutine,
} from '@/lib/child-day';
import { formatDbTime } from '@/lib/dates';
import { iconStroke } from '@/theme/tokens';
import { listEntering } from '@/theme/motion';
import { useColors } from '@/theme/use-theme';

import { BLOCK_ICON_SIZE, FOOTER_ICON_SIZE, styles } from './ShiftDay.styles';

interface ShiftDayProps {
  shown: ShownGroup;
  day: Date;
  today: Date;
  isToday: boolean;
  firstName: string;
  roomInBand: boolean;
  beat: boolean;
}

function RestBlock({ routine }: { routine: DayRoutine }) {
  const duration = restDuration(routine.restStart, routine.restEnd);
  if (routine.noSleep) return <Text>{CHILD_DAY_COPY.noSleep}</Text>;
  return (
    <View>
      {duration ? (
        <Text variant="display" numeric style={styles.restValue}>
          {`${duration.value} `}
          <Text tone="muted" variant="section" style={styles.restUnit}>
            {duration.unit}
          </Text>
        </Text>
      ) : null}
      <TimeRow time={formatDbTime(routine.restStart)} label={CHILD_DAY_COPY.fellAsleep} divided={false} />
      {routine.restEnd ? <TimeRow time={formatDbTime(routine.restEnd)} label={CHILD_DAY_COPY.wokeUp} divided /> : null}
    </View>
  );
}

function routineBlocks(routine: DayRoutine, shown: ShownGroup, iconColor: string): { key: string; node: ReactNode }[] {
  const meals = mealRows(routine);
  const blocks: { key: string; node: ReactNode }[] = [];
  if (meals.length > 0) {
    blocks.push({
      key: 'meals',
      node: (
        <RoutineCard icon={<Utensils size={BLOCK_ICON_SIZE} color={iconColor} strokeWidth={iconStroke.regular} />} title={CHILD_DAY_COPY.meals}>
          {meals.map((meal, index) => (
            <MealRow key={meal.key} meal={meal} divided={index > 0} />
          ))}
        </RoutineCard>
      ),
    });
  }
  if (hasRest(routine)) {
    blocks.push({
      key: 'rest',
      node: (
        <RoutineCard icon={<Moon size={BLOCK_ICON_SIZE} color={iconColor} strokeWidth={iconStroke.regular} />} title={CHILD_DAY_COPY.rest}>
          <RestBlock routine={routine} />
        </RoutineCard>
      ),
    });
  }
  for (const block of hygieneBlocks(routine.hygiene)) {
    blocks.push({
      key: block.kind,
      node: (
        <RoutineCard icon={<HygieneIcon kind={block.kind} size={BLOCK_ICON_SIZE} color={iconColor} />} title={block.title} aside={block.count}>
          {block.rows.map((row, index) => (
            <TimeRow key={`${row.time}-${index}`} time={row.time} label={row.label} divided={index > 0} />
          ))}
        </RoutineCard>
      ),
    });
  }
  if (routine.notes) {
    blocks.push({
      key: 'note',
      node: (
        <RoutineCard icon={<Pencil size={BLOCK_ICON_SIZE} color={iconColor} strokeWidth={iconStroke.regular} />} title={CHILD_DAY_COPY.note} aside={savedTimeOf(routine)}>
          <TeacherNote text={routine.notes} teacher={shown.teacher} />
        </RoutineCard>
      ),
    });
  }
  return blocks;
}

export function ShiftDay({ shown, day, today, isToday, firstName, roomInBand, beat }: ShiftDayProps) {
  const colors = useColors();
  const reduced = useReducedMotion();
  const teacherLabel = shown.teacher?.label ?? null;
  const band = <ShiftBand shift={shown.group.shift} line={bandLine(shown.group, teacherLabel, roomInBand)} />;
  const { routine } = shown;

  if (!routine) {
    return (
      <View style={styles.shift}>
        {band}
        {isToday ? (
          <NotYetCard teacher={shown.teacher} line={notYetLine(firstName, shown.group)} />
        ) : (
          <Text tone="muted">{CHILD_DAY_COPY.noShiftRoutine}</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.shift}>
      {band}
      <ShiftSeal title={sealTitle(teacherLabel, shown.group.shift)} line={sealLine(routine, day, today)} beat={beat} />
      {routineBlocks(routine, shown, colors.blue).map((block, index) => (
        <Animated.View key={block.key} entering={listEntering(index, reduced)}>
          {block.node}
        </Animated.View>
      ))}
      <View style={styles.footer}>
        <Check size={FOOTER_ICON_SIZE} color={colors.muted} strokeWidth={iconStroke.bold} />
        <Text variant="small" tone="muted" style={styles.footerText}>
          {CHILD_DAY_COPY.loadedBy(teacherLabel)}
        </Text>
      </View>
    </View>
  );
}
