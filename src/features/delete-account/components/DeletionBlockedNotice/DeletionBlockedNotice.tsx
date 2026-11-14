import { CircleAlert } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { DELETE_ACCOUNT_COPY } from '@/features/delete-account/delete-account-copy';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { ALERT_GLYPH_SIZE, styles } from './DeletionBlockedNotice.styles';

export interface DeletionBlockedNoticeProps {
  title: string;
  reason: ReactNode;
  nextStep: string;
  onClose: () => void;
}

export function DeletionBlockedNotice({ title, reason, nextStep, onClose }: DeletionBlockedNoticeProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View>
      <View style={[styles.statusIcon, backgroundStyles.wait50]}>
        <CircleAlert size={ALERT_GLYPH_SIZE} color={colors.wait} strokeWidth={iconStroke.regular} />
      </View>
      <Text variant="title" accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Text>{reason}</Text>
      <Text style={styles.paragraph}>{nextStep}</Text>
      <Button label={DELETE_ACCOUNT_COPY.notNow} variant="plain" block onPress={onClose} style={styles.action} />
    </View>
  );
}
