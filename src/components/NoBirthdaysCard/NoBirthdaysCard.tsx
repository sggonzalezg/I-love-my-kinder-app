import { Cake } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { GROUP_ROSTER_COPY } from '@/components/GroupRoster/group-roster-copy';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { CAKE_ICON_SIZE, styles } from './NoBirthdaysCard.styles';

/** `nextLine` names the next birthday; it is left out when no child has a birth date. */
export function NoBirthdaysCard({ nextLine }: { nextLine: string | null }) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={[styles.card, backgroundStyles.surface]} accessible>
      <Cake size={CAKE_ICON_SIZE} color={colors.ink} strokeWidth={1.8} />
      <View style={styles.text}>
        <Text variant="bodyStrong">{GROUP_ROSTER_COPY.noBirthdays}</Text>
        {nextLine ? (
          <Text variant="small" tone="muted">
            {nextLine}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
