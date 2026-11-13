import { Check } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { DELETE_ACCOUNT_COPY } from '@/features/delete-account/delete-account-copy';
import { deletedOnLine } from '@/lib/account-deletion';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { duration, easeOut } from '@/theme/motion';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { CHECK_GLYPH_SIZE, styles } from './AccountDeletedView.styles';

export interface AccountDeletedViewProps {
  deletedAt: Date;
  onDone: () => void;
}

export function AccountDeletedView({ deletedAt, onDone }: AccountDeletedViewProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <Animated.View entering={FadeIn.duration(duration.slow).easing(easeOut)} style={[styles.root, backgroundStyles.ground]}>
      <View style={[styles.successIcon, backgroundStyles.ok50]}>
        <Check size={CHECK_GLYPH_SIZE} color={colors.ok} strokeWidth={iconStroke.bold} />
      </View>
      <Text variant="title" accessibilityRole="header" style={styles.centered}>
        {DELETE_ACCOUNT_COPY.deletedTitle}
      </Text>
      <Text tone="muted" style={styles.line}>
        {deletedOnLine(deletedAt)}
      </Text>
      <Button label={DELETE_ACCOUNT_COPY.done} variant="soft" block onPress={onDone} style={styles.action} />
    </Animated.View>
  );
}
