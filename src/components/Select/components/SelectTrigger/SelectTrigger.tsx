import { Image } from 'expo-image';
import { ChevronDown, CircleAlert } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, { FadeIn, LayoutAnimationConfig, useReducedMotion } from 'react-native-reanimated';

import { PressableScale } from '@/components/pressable-scale';
import { SELECT_COPY } from '@/components/Select/select-copy';
import { Text } from '@/components/text';
import { duration } from '@/theme/motion';
import type { ColorName } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { CHEVRON_SIZE, ERROR_ICON_SIZE, TRIGGER_PRESSED_SCALE, chevronTransition, styles, useTriggerColorStyles } from './SelectTrigger.styles';

export type SelectVariant = 'field' | 'chip' | 'roomSwitch';

interface SelectTriggerProps {
  variant: SelectVariant;
  label: string;
  valueLabel?: string;
  valueImageUrl?: string;
  placeholder?: string;
  isOpen: boolean;
  isFiltering: boolean;
  error?: string | null;
  disabled?: boolean;
  disabledHelp?: string;
  onPress: () => void;
}

type TriggerTone = 'idle' | 'open' | 'error' | 'disabled' | 'filtering' | 'roomSwitch';

function triggerTone({ variant, isOpen, isFiltering, error, disabled }: SelectTriggerProps): TriggerTone {
  if (disabled) return 'disabled';
  if (isOpen) return 'open';
  if (variant === 'roomSwitch') return 'roomSwitch';
  if (error) return 'error';
  return isFiltering ? 'filtering' : 'idle';
}

const TEXT_TONES: Record<TriggerTone, ColorName> = {
  idle: 'ink',
  open: 'ink',
  error: 'ink',
  disabled: 'muted',
  filtering: 'blue',
  roomSwitch: 'blue',
};

export function SelectTrigger(props: SelectTriggerProps) {
  const { variant, label, valueLabel, valueImageUrl, placeholder, isOpen, error, disabled, disabledHelp, onPress } = props;
  const colors = useColors();
  const colorStyles = useTriggerColorStyles();
  const reduced = useReducedMotion();
  const tone = triggerTone(props);
  const isField = variant === 'field';
  const hasRing = tone === 'open' || tone === 'error';
  const valueTone: ColorName = valueLabel ? TEXT_TONES[tone] : 'muted';
  const chevronColor = tone === 'open' || tone === 'filtering' || tone === 'roomSwitch' ? colors.blue : colors.muted;
  const showError = isField && !!error && !disabled;

  return (
    <View style={styles.wrapper}>
      {isField ? (
        <Text variant="label">
          {label}
        </Text>
      ) : null}
      <PressableScale
        haptic="selection"
        pressedScale={TRIGGER_PRESSED_SCALE}
        disabled={disabled}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={SELECT_COPY.triggerLabel(label, valueLabel)}
        accessibilityHint={SELECT_COPY.openHint}
        accessibilityState={{ disabled: !!disabled, expanded: isOpen }}
        style={[isField ? styles.field : styles.pill, colorStyles[tone], hasRing && styles.ring]}>
        {isField && valueImageUrl ? <Image source={{ uri: valueImageUrl }} style={styles.photo} accessibilityIgnoresInvertColors /> : null}
        <LayoutAnimationConfig skipEntering>
          <Animated.View key={valueLabel ?? ''} style={isField && styles.value} entering={reduced ? undefined : FadeIn.duration(duration.fast)}>
            <Text tone={valueTone} style={!isField && styles.pillValue} numberOfLines={1}>
              {valueLabel ?? placeholder}
            </Text>
          </Animated.View>
        </LayoutAnimationConfig>
        <Animated.View style={[isOpen ? styles.chevronOpen : styles.chevronClosed, !reduced && chevronTransition]}>
          <ChevronDown size={CHEVRON_SIZE} color={chevronColor} strokeWidth={1.8} />
        </Animated.View>
      </PressableScale>
      {showError ? (
        <View style={styles.messageRow} accessibilityRole="alert">
          <CircleAlert size={ERROR_ICON_SIZE} color={colors.red} strokeWidth={1.8} />
          <Text variant="smallStrong" tone="red">
            {error}
          </Text>
        </View>
      ) : null}
      {isField && disabled && disabledHelp ? (
        <Text variant="small" tone="muted">
          {disabledHelp}
        </Text>
      ) : null}
    </View>
  );
}
