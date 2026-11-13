import { View } from 'react-native';

import { Text } from '@/components/text';
import { CHILD_DAY_COPY } from '@/features/child-day/child-day-copy';
import { TimeRow } from '@/features/child-day/components/TimeRow/TimeRow';
import type { MealRow as MealRowModel } from '@/lib/child-day';
import { AMOUNT_DOTS } from '@/lib/routine';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './MealRow.styles';

const METER_DOTS = AMOUNT_DOTS.all;

interface MealRowProps {
  meal: MealRowModel;
  divided: boolean;
}

export function MealRow({ meal, divided }: MealRowProps) {
  const backgroundStyles = useBackgroundColorStyles();
  const detail = meal.updated ? (
    <Text tone="blue" numeric style={styles.updated}>
      {meal.updated}
    </Text>
  ) : null;
  const meter = (
    <View style={styles.meter} accessibilityLabel={CHILD_DAY_COPY.mealMeter(meal.amount)}>
      <View style={styles.dots}>
        {Array.from({ length: METER_DOTS }, (_, index) => (
          <View key={index} style={[styles.dot, index < meal.dots ? backgroundStyles.blue : backgroundStyles.blue100]} />
        ))}
      </View>
      <Text style={styles.amount}>{meal.amount}</Text>
    </View>
  );
  return <TimeRow time={meal.time} label={meal.label} divided={divided} detail={detail} aside={meter} />;
}
