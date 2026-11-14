import { ClipboardCheck } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';
import type { OutingAnswerCounts } from '@/lib/outing-form';
import { isEveryAnswerIn, permissionCardDetail, permissionCardTitle } from '@/lib/outing-tally';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { PERMISSION_ICON_SIZE, styles, useOutingPermissionCardStyles } from './OutingPermissionCard.styles';

interface OutingPermissionCardProps {
  counts: OutingAnswerCounts;
}

export function OutingPermissionCard({ counts }: OutingPermissionCardProps) {
  const colors = useColors();
  const themed = useOutingPermissionCardStyles();
  const isDone = isEveryAnswerIn(counts);
  const title = permissionCardTitle(counts);
  const detail = permissionCardDetail(counts);

  return (
    <View
      accessible
      accessibilityLabel={detail ? `${title}. ${detail}` : title}
      style={[styles.card, themed.card, !isDone && styles.pendingCard]}>
      <View style={[styles.icon, isDone ? themed.doneIcon : themed.pendingIcon]}>
        <ClipboardCheck size={PERMISSION_ICON_SIZE} color={isDone ? colors.ok : colors.wait} strokeWidth={iconStroke.regular} />
      </View>
      <View style={styles.text}>
        <Text variant="section" numeric>
          {title}
        </Text>
        {detail ? (
          <Text variant="small" numeric>
            {detail}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
