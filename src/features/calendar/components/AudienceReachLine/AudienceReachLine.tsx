import { Users } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { audienceReachLine, audienceReachParts, type AudienceReach } from '@/lib/director-event-audience';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { REACH_ICON_SIZE, styles, useAudienceReachLineStyles } from './AudienceReachLine.styles';

interface AudienceReachLineProps {
  reach: AudienceReach;
}

export function AudienceReachLine({ reach }: AudienceReachLineProps) {
  const colors = useColors();
  const themed = useAudienceReachLineStyles();
  const parts = audienceReachParts(reach);

  return (
    <View style={[styles.line, themed.line]} accessible accessibilityLabel={audienceReachLine(reach)}>
      <Users size={REACH_ICON_SIZE} color={colors.blue} strokeWidth={iconStroke.regular} />
      <Text variant="small" style={styles.text}>
        {parts.prefix}{' '}
        <Text variant="smallStrong" tone="blue" numeric>
          {parts.families}
        </Text>{' '}
        {parts.joiner}{' '}
        <Text variant="smallStrong" tone="blue" numeric>
          {parts.teachers}
        </Text>
      </Text>
    </View>
  );
}
