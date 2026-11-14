import { TriangleAlert } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { OUTING_PERMISSIONS_COPY } from '@/features/outing-permissions/outing-permissions-copy';
import { noGoTitle } from '@/lib/outing-permissions';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { ALERT_ICON_SIZE, styles, useNoGoCardStyles } from './NoGoCard.styles';

interface NoGoCardProps {
  names: string[];
}

export function NoGoCard({ names }: NoGoCardProps) {
  const colors = useColors();
  const themed = useNoGoCardStyles();
  return (
    <View style={[styles.card, themed.card]}>
      <View style={styles.heading}>
        <TriangleAlert size={ALERT_ICON_SIZE} color={colors.red} strokeWidth={iconStroke.bold} />
        <Text accessibilityRole="header" style={styles.title}>
          {noGoTitle(names.length)}
        </Text>
      </View>
      <Text variant="small" style={styles.reason}>
        {names.length === 1 ? OUTING_PERMISSIONS_COPY.noGoReasonOne : OUTING_PERMISSIONS_COPY.noGoReason}
      </Text>
      <View style={styles.names}>
        {names.map((name) => (
          <Text key={name} variant="smallStrong" style={[styles.name, themed.name]}>
            {name}
          </Text>
        ))}
      </View>
    </View>
  );
}
