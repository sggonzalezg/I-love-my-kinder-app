import { CircleAlert, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { ALERT_ICON_SIZE, styles } from './AlertLine.styles';

interface AlertLineProps {
  text: string;
  icon?: LucideIcon;
}

export function AlertLine({ text, icon: Icon = CircleAlert }: AlertLineProps) {
  const colors = useColors();
  return (
    <View style={styles.row} accessibilityRole="alert">
      <Icon size={ALERT_ICON_SIZE} color={colors.red} strokeWidth={iconStroke.bold} />
      <Text variant="smallStrong" tone="red" style={styles.text}>
        {text}
      </Text>
    </View>
  );
}
