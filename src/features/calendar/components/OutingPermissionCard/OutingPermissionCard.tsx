import { ChevronRight, ClipboardCheck } from 'lucide-react-native';
import { View } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import type { OutingAnswerCounts } from '@/lib/outing-form';
import { isEveryAnswerIn, permissionCardDetail, permissionCardTitle } from '@/lib/outing-tally';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { CARD_PRESSED_SCALE, CHEVRON_SIZE, PERMISSION_ICON_SIZE, styles, useOutingPermissionCardStyles } from './OutingPermissionCard.styles';

interface OutingPermissionCardProps {
  counts: OutingAnswerCounts;
  onPress: () => void;
}

export function OutingPermissionCard({ counts, onPress }: OutingPermissionCardProps) {
  const colors = useColors();
  const themed = useOutingPermissionCardStyles();
  const isDone = isEveryAnswerIn(counts);
  const title = permissionCardTitle(counts);
  const detail = permissionCardDetail(counts);

  return (
    <PressableScale
      onPress={onPress}
      pressedScale={CARD_PRESSED_SCALE}
      accessibilityRole="button"
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
      <ChevronRight size={CHEVRON_SIZE} color={colors.muted} strokeWidth={iconStroke.regular} />
    </PressableScale>
  );
}
