import { CircleAlert } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { ALLERGY_ICON_SIZE, styles } from './AllergyStrip.styles';

export function AllergyStrip({ allergies }: { allergies: string }) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={[styles.strip, backgroundStyles.red50]} accessibilityRole="alert">
      <CircleAlert size={ALLERGY_ICON_SIZE} color={colors.red} strokeWidth={1.8} />
      <Text style={styles.text}>
        <Text variant="bodyStrong">{TEACHER_DAY_COPY.allergyStrip}</Text> {allergies}
      </Text>
    </View>
  );
}
