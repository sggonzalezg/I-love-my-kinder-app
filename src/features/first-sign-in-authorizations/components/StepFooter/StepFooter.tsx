import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { bottomInsetStyle, styles } from './StepFooter.styles';

interface StepFooterProps {
  line: string;
  buttonLabel: string;
  onContinue: () => void;
}

/** Never disabled: what is left unanswered stays as a card in Hoy. */
export function StepFooter({ line, buttonLabel, onContinue }: StepFooterProps) {
  const insets = useSafeAreaInsets();
  const backgroundStyles = useBackgroundColorStyles();

  return (
    <View style={[styles.footer, backgroundStyles.ground, bottomInsetStyle(insets.bottom)]}>
      <Text variant="small" tone="muted" style={styles.line} accessibilityLiveRegion="polite">
        {line}
      </Text>
      <Button label={buttonLabel} onPress={onContinue} block />
    </View>
  );
}
