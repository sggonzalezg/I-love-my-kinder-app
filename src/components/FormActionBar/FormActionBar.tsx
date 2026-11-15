import { Check, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { size } from '@/theme/tokens';

import { bottomInsetStyle, styles } from './FormActionBar.styles';

interface FormActionBarProps {
  label: string;
  icon?: LucideIcon;
  disabled: boolean;
  loading: boolean;
  onPress: () => void;
}

export function FormActionBar({ label, icon = Check, disabled, loading, onPress }: FormActionBarProps) {
  const insets = useSafeAreaInsets();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={[styles.bar, backgroundStyles.surface, bottomInsetStyle(insets.bottom)]}>
      <Button label={label} icon={icon} block height={size.teacherAction} disabled={disabled} loading={loading} onPress={onPress} />
    </View>
  );
}
