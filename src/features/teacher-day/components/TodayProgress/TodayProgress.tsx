import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ProgressTrack } from '@/components/ProgressTrack/ProgressTrack';
import { Text } from '@/components/text';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';

import { dayBeat } from '@/theme/motion';

import { styles } from './TodayProgress.styles';

interface TodayProgressProps {
  ready: number;
  total: number;
}

export function TodayProgress({ ready, total }: TodayProgressProps) {
  const complete = total > 0 && ready === total;
  return (
    <View style={styles.block} accessible accessibilityLabel={`${ready} ${TEACHER_DAY_COPY.readyOf(total)}`}>
      <View style={styles.countRow}>
        <Animated.View key={complete ? 'complete' : 'counting'} entering={complete ? dayBeat : undefined}>
          <Text numeric style={styles.count}>
            {ready}
          </Text>
        </Animated.View>
        <Text tone="muted" style={styles.of}>
          {TEACHER_DAY_COPY.readyOf(total)}
        </Text>
      </View>
      <ProgressTrack fraction={total ? ready / total : 0} />
    </View>
  );
}
