import { ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { IconButton } from '@/components/icon-button';
import { Text } from '@/components/text';
import { StepDots } from '@/features/first-sign-in-authorizations/components/StepDots/StepDots';
import { FIRST_SIGN_IN_COPY } from '@/features/first-sign-in-authorizations/first-sign-in-copy';

import { styles } from './StepBar.styles';

interface StepBarProps {
  stepIndex: number;
  stepCount: number;
  /** Null on the first step, which has no way back. */
  previousChildFirstName: string | null;
  onBack: () => void;
  onLater: () => void;
}

export function StepBar({ stepIndex, stepCount, previousChildFirstName, onBack, onLater }: StepBarProps) {
  return (
    <View style={styles.bar}>
      {previousChildFirstName && <IconButton icon={ChevronLeft} label={FIRST_SIGN_IN_COPY.backTo(previousChildFirstName)} onPress={onBack} ghost />}
      {stepCount > 1 ? <StepDots stepIndex={stepIndex} stepCount={stepCount} /> : <View style={styles.spacer} />}
      <Pressable style={styles.later} onPress={onLater} accessibilityRole="button" hitSlop={8}>
        <Text variant="bodyStrong" color="blue">
          {FIRST_SIGN_IN_COPY.later}
        </Text>
      </Pressable>
    </View>
  );
}
