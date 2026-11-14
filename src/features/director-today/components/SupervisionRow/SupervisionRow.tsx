import { CircleAlert, Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';

import { Chip } from '@/components/chip';
import { ProgressTrack } from '@/components/ProgressTrack/ProgressTrack';
import { Text } from '@/components/text';
import { DIRECTOR_TODAY_COPY } from '@/features/director-today/director-today-copy';
import { loggedOfLabel, missingLine, noTeacherLine, startsAtLine, supervisionChipVariant, type SupervisionGroup } from '@/lib/director-today';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { duration } from '@/theme/motion';

import { styles } from './SupervisionRow.styles';

interface SupervisionRowProps {
  group: SupervisionGroup;
  open: boolean;
  onToggle: () => void;
}

const missingEntering = FadeIn.duration(duration.base).reduceMotion(ReduceMotion.System);

function GroupProgress({ group }: { group: SupervisionGroup }) {
  const variant = supervisionChipVariant(group);
  return (
    <>
      <View style={styles.between}>
        <Text variant="bodyStrong" numberOfLines={1} style={styles.name}>
          {group.label}
        </Text>
        <Chip variant={variant} icon={variant === 'ok' ? Check : undefined} label={loggedOfLabel(group.logged, group.total)} />
      </View>
      <View style={styles.track}>
        <ProgressTrack fraction={group.total ? group.logged / group.total : 0} thin />
      </View>
    </>
  );
}

export function SupervisionRow({ group, open, onToggle }: SupervisionRowProps) {
  const backgroundStyles = useBackgroundColorStyles();

  if (!group.hasTeacher) {
    return (
      <View style={[styles.row, backgroundStyles.surface]}>
        <View style={styles.between}>
          <Text variant="bodyStrong" numberOfLines={1} style={styles.name}>
            {group.label}
          </Text>
          <Chip variant="red" icon={CircleAlert} label={DIRECTOR_TODAY_COPY.noTeacher} />
        </View>
        <Text variant="small" tone="muted">
          {noTeacherLine(group.total)}
        </Text>
      </View>
    );
  }

  const canShowMissing = !group.notStarted && group.missingNames.length > 0;
  if (!canShowMissing) {
    return (
      <View style={[styles.row, backgroundStyles.surface]} accessible>
        <GroupProgress group={group} />
        {group.notStarted ? (
          <Text variant="small" tone="muted">
            {startsAtLine(group.startTime)}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      accessibilityHint={open ? DIRECTOR_TODAY_COPY.hideMissing : DIRECTOR_TODAY_COPY.showMissing}
      style={({ pressed }) => [styles.row, pressed ? backgroundStyles.raised : backgroundStyles.surface]}>
      <GroupProgress group={group} />
      {open ? (
        <Animated.View entering={missingEntering}>
          <Text variant="small" tone="muted" style={styles.missing}>
            {missingLine(group.missingNames)}
          </Text>
        </Animated.View>
      ) : null}
    </Pressable>
  );
}
