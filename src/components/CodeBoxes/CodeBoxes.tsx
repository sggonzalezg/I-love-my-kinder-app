import { useEffect } from 'react';
import { TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSequence, withTiming, Easing } from 'react-native-reanimated';

import { duration, easeOut } from '@/theme/motion';

import { styles, useCodeBoxesStyles } from './CodeBoxes.styles';

export const CODE_BOX_LOOKS = {
  FILLING: 'filling',
  CORRECT: 'correct',
  WRONG: 'wrong',
  DIM: 'dim',
} as const;

export type CodeBoxLook = (typeof CODE_BOX_LOOKS)[keyof typeof CODE_BOX_LOOKS];

const SHAKE_OFFSET = 6;
const SHAKE_STEP_MS = 60;
const PULSE_SCALE = 1.06;
const PULSE_STAGGER_MS = 30;
const PULSE_HALF_MS = duration.base / 2;

interface CodeBoxesProps {
  /** The digits shown in the boxes; may differ from `value` while a refused code stays visible. */
  digits: string;
  value: string;
  length: number;
  look: CodeBoxLook;
  editable: boolean;
  accessibilityLabel: string;
  onChange: (code: string) => void;
}

interface CodeBoxProps {
  digit: string;
  index: number;
  isCurrent: boolean;
  look: CodeBoxLook;
}

function CodeBox({ digit, index, isCurrent, look }: CodeBoxProps) {
  const themed = useCodeBoxesStyles();
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (look !== CODE_BOX_LOOKS.CORRECT || reduced) return;
    scale.set(
      withDelay(
        index * PULSE_STAGGER_MS,
        withSequence(withTiming(PULSE_SCALE, { duration: PULSE_HALF_MS, easing: easeOut }), withTiming(1, { duration: PULSE_HALF_MS, easing: easeOut })),
      ),
    );
  }, [look, reduced, index, scale]);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const borderStyle =
    look === CODE_BOX_LOOKS.CORRECT ? themed.correct : look === CODE_BOX_LOOKS.WRONG ? themed.wrong : isCurrent ? themed.current : null;
  const digitStyle =
    look === CODE_BOX_LOOKS.CORRECT ? themed.digitCorrect : look === CODE_BOX_LOOKS.WRONG ? themed.digitWrong : look === CODE_BOX_LOOKS.DIM ? themed.digitDim : themed.digit;

  return (
    <Animated.View style={[styles.box, themed.box, borderStyle, pulseStyle]}>
      <Animated.Text style={[styles.digit, digitStyle]}>{digit}</Animated.Text>
    </Animated.View>
  );
}

export function CodeBoxes({ digits, value, length, look, editable, accessibilityLabel, onChange }: CodeBoxesProps) {
  const reduced = useReducedMotion();
  const shakeX = useSharedValue(0);

  useEffect(() => {
    if (look !== CODE_BOX_LOOKS.WRONG || reduced) return;
    const step = (to: number) => withTiming(to, { duration: SHAKE_STEP_MS, easing: Easing.linear });
    shakeX.set(withSequence(step(-SHAKE_OFFSET), step(SHAKE_OFFSET), step(-SHAKE_OFFSET), step(SHAKE_OFFSET), step(0)));
  }, [look, reduced, shakeX]);

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.get() }] }));
  const isFilling = look === CODE_BOX_LOOKS.FILLING;

  return (
    <Animated.View style={[styles.row, shakeStyle]}>
      {Array.from({ length }, (_, index) => (
        <CodeBox key={index} index={index} digit={digits[index] ?? ''} isCurrent={isFilling && editable && index === digits.length} look={look} />
      ))}
      <View style={styles.hiddenInput}>
        <TextInput
          value={value}
          onChangeText={onChange}
          editable={editable}
          maxLength={length}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          accessibilityLabel={accessibilityLabel}
          caretHidden
          style={styles.hiddenInput}
        />
      </View>
    </Animated.View>
  );
}
