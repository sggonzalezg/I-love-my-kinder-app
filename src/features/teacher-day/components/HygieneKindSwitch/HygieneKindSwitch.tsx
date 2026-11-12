import * as Haptics from 'expo-haptics';
import { Pressable, View } from 'react-native';

import { HygieneIcon } from '@/components/HygieneIcon/HygieneIcon';
import { Text } from '@/components/text';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { HYGIENE_KIND_LABELS, type HygieneKind } from '@/lib/routine';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { KIND_ICON_SIZE, styles } from './HygieneKindSwitch.styles';

const KINDS: HygieneKind[] = ['diaper', 'bathroom'];

interface HygieneKindSwitchProps {
  value: HygieneKind;
  onChange: (kind: HygieneKind) => void;
  disabled: boolean;
}

export function HygieneKindSwitch({ value, onChange, disabled }: HygieneKindSwitchProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={[styles.track, backgroundStyles.raised]} accessibilityRole="tablist" accessibilityLabel={TEACHER_DAY_COPY.hygiene}>
      {KINDS.map((kind) => {
        const selected = kind === value;
        return (
          <Pressable
            key={kind}
            disabled={disabled}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled }}
            onPress={() => {
              if (selected) return;
              Haptics.selectionAsync();
              onChange(kind);
            }}
            style={[styles.option, selected ? backgroundStyles.blue : backgroundStyles.transparent]}>
            <HygieneIcon kind={kind} size={KIND_ICON_SIZE} color={selected ? colors.onBlue : colors.muted} />
            <Text variant="smallStrong" tone={selected ? 'onBlue' : 'muted'}>
              {HYGIENE_KIND_LABELS[kind]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
