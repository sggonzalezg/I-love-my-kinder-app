import { View } from 'react-native';

import { Text } from '@/components/text';
import { turningLabel, type RoomBirthday } from '@/lib/teacher-room';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './BirthdayRow.styles';

export function BirthdayRow({ birthday }: { birthday: RoomBirthday }) {
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={styles.row} accessible accessibilityLabel={`${birthday.name}, ${birthday.day} de ${birthday.month}, ${turningLabel(birthday.ageTurning)}`}>
      <View style={[styles.dateTile, backgroundStyles.blue50]}>
        <Text tone="blue" style={styles.day}>
          {birthday.day}
        </Text>
        <Text tone="blue" style={styles.month}>
          {birthday.monthShort}
        </Text>
      </View>
      <View style={styles.text}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {birthday.name}
        </Text>
        <Text variant="small" tone="muted">
          {turningLabel(birthday.ageTurning)}
        </Text>
      </View>
    </View>
  );
}
