import { Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';

import { Button } from '@/components/button';
import { ChoiceGroup } from '@/components/ChoiceGroup/ChoiceGroup';
import { Text } from '@/components/text';
import { TimeButton } from '@/components/TimeButton/TimeButton';
import { FieldLabel } from '@/features/teacher-day/components/FieldLabel/FieldLabel';
import { HygieneKindSwitch } from '@/features/teacher-day/components/HygieneKindSwitch/HygieneKindSwitch';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { formatDbTime } from '@/lib/dates';
import { HYGIENE_KIND_LABELS, HYGIENE_TYPE_LABELS, type HygieneEntry, type HygieneKind, type HygieneType } from '@/lib/routine';
import { duration, easeOut } from '@/theme/motion';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { size } from '@/theme/tokens';

import { styles } from './HygieneLog.styles';

const TYPE_OPTIONS = (['pee', 'poop', 'dry'] as const).map((value) => ({ value, label: HYGIENE_TYPE_LABELS[value] }));
const ENTRY_ENTERING = FadeIn.duration(duration.fast).easing(easeOut).reduceMotion(ReduceMotion.System);

interface HygieneLogProps {
  kind: HygieneKind;
  type: HygieneType;
  entries: HygieneEntry[];
  nowTime: string;
  disabled: boolean;
  onKindChange: (kind: HygieneKind) => void;
  onTypeChange: (type: HygieneType) => void;
  onOpenTimeSheet: () => void;
  onAddNow: () => void;
  onPressEntry: (index: number) => void;
}

function entryLabel(entry: HygieneEntry): string {
  return `${formatDbTime(entry.time)} · ${HYGIENE_KIND_LABELS[entry.kind]} · ${HYGIENE_TYPE_LABELS[entry.type]}`;
}

export function HygieneLog({ kind, type, entries, nowTime, disabled, onKindChange, onTypeChange, onOpenTimeSheet, onAddNow, onPressEntry }: HygieneLogProps) {
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View>
      <FieldLabel title={TEACHER_DAY_COPY.hygiene} aside={TEACHER_DAY_COPY.hygieneHint} />
      <HygieneKindSwitch value={kind} onChange={onKindChange} disabled={disabled} />
      <View style={styles.gap}>
        <ChoiceGroup label={TEACHER_DAY_COPY.hygiene} options={TYPE_OPTIONS} value={type} onChange={onTypeChange} disabled={disabled} />
      </View>
      <View style={[styles.gap, styles.row]}>
        <TimeButton caption={TEACHER_DAY_COPY.hygieneTimeNow} time={formatDbTime(nowTime)} disabled={disabled} onPress={onOpenTimeSheet} />
        <Button label={TEACHER_DAY_COPY.add} icon={Plus} variant="soft" height={size.timeButton} disabled={disabled} style={styles.add} onPress={onAddNow} />
      </View>
      {entries.length ? (
        <View style={styles.logged}>
          {entries.map((entry, index) => (
            <Animated.View key={`${entry.time}-${entry.kind}-${entry.type}-${index}`} entering={ENTRY_ENTERING}>
              <Pressable
                disabled={disabled}
                onPress={() => onPressEntry(index)}
                accessibilityRole="button"
                style={[styles.chip, backgroundStyles.blue50]}>
                <Text numeric tone="blue" style={styles.chipLabel}>
                  {entryLabel(entry)}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
