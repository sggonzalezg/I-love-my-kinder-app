import { Check, ChevronRight, Clock, Lock } from 'lucide-react-native';
import { View } from 'react-native';

import { Chip } from '@/components/chip';
import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import type { TodayKid } from '@/data/family-today';
import { KidPhoto } from '@/features/family-today/components/KidPhoto/KidPhoto';
import { FAMILY_TODAY_COPY } from '@/features/family-today/family-today-copy';
import { initials } from '@/lib/format';
import { groupLabel } from '@/lib/shift';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { CHEVRON_SIZE, KID_CARD_PRESSED_SCALE, styles } from './KidCard.styles';

interface KidCardProps {
  kid: TodayKid;
  onPress: () => void;
}

function DayStatusChip({ kid }: { kid: TodayKid }) {
  if (kid.dayStatus === 'readOnly') return <Chip label={FAMILY_TODAY_COPY.readOnly} icon={Lock} variant="grey" />;
  if (kid.dayStatus === 'ready') return <Chip label={FAMILY_TODAY_COPY.dayReady} icon={Check} variant="ok" />;
  return <Chip label={FAMILY_TODAY_COPY.dayNotYet} icon={Clock} variant="grey" />;
}

export function KidCard({ kid, onPress }: KidCardProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const isReadOnly = kid.dayStatus === 'readOnly';

  return (
    <PressableScale
      onPress={onPress}
      pressedScale={KID_CARD_PRESSED_SCALE}
      accessibilityRole="button"
      style={[styles.card, isReadOnly ? backgroundStyles.raised : backgroundStyles.surface]}>
      <KidPhoto photoPath={kid.photoPath} firstName={kid.firstName} initials={initials(kid.firstName, kid.lastName)} />
      <View style={styles.text}>
        <Text variant="section">{kid.firstName}</Text>
        {kid.groups.length ? (
          <View style={styles.chips}>
            {kid.groups.map((group) => (
              <Chip key={`${group.roomId}:${group.shiftId}`} label={groupLabel(group.roomName, group.shift)} />
            ))}
          </View>
        ) : null}
        <View style={styles.chips}>
          <DayStatusChip kid={kid} />
        </View>
        {isReadOnly ? (
          <Text variant="small" tone="muted">
            {FAMILY_TODAY_COPY.readOnlyLine(kid.firstName)}
          </Text>
        ) : null}
      </View>
      <ChevronRight size={CHEVRON_SIZE} color={colors.muted} strokeWidth={1.8} />
    </PressableScale>
  );
}
