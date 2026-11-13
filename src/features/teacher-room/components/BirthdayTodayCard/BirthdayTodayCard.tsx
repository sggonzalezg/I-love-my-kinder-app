import { Heart } from 'lucide-react-native';
import { Image, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Text } from '@/components/text';
import { TEACHER_ROOM_COPY } from '@/features/teacher-room/teacher-room-copy';
import { useColors } from '@/theme/use-theme';

import { HEART_SIZE, heartBeat, styles } from './BirthdayTodayCard.styles';

const BIRTHDAY_PHOTO = require('@/assets/images/birthday-paige-cody.jpg');

interface BirthdayTodayCardProps {
  firstName: string;
  detail: string;
}

export function BirthdayTodayCard({ firstName, detail }: BirthdayTodayCardProps) {
  const colors = useColors();
  const reduced = useReducedMotion();

  return (
    <View style={styles.card}>
      <Image source={BIRTHDAY_PHOTO} style={styles.photo} accessibilityLabel={TEACHER_ROOM_COPY.birthdayPhoto} />
      <View style={styles.caption}>
        <View style={styles.title}>
          <Animated.View style={reduced ? null : heartBeat}>
            <Heart size={HEART_SIZE} color={colors.heart} fill={colors.heart} />
          </Animated.View>
          <Text tone="white" style={styles.titleText}>
            {TEACHER_ROOM_COPY.todayBirthday(firstName)}
          </Text>
        </View>
        <Text variant="small" tone="white">
          {detail}
        </Text>
      </View>
    </View>
  );
}
