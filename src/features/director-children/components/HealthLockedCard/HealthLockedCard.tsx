import { Lock } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { LOCK_ICON_SIZE, styles } from './HealthLockedCard.styles';

export function HealthLockedCard() {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={[styles.card, backgroundStyles.raised]}>
      <Lock size={LOCK_ICON_SIZE} color={colors.muted} strokeWidth={1.8} />
      <View style={styles.text}>
        <Text variant="bodyStrong">{DIRECTOR_CHILDREN_COPY.healthLockedTitle}</Text>
        <Text variant="small" tone="muted">
          {`${DIRECTOR_CHILDREN_COPY.healthLockedText} ${DIRECTOR_CHILDREN_COPY.healthLockedHint}`}
        </Text>
      </View>
    </View>
  );
}
