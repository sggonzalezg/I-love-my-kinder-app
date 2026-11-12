import { ChevronLeft } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { IconButton } from '@/components/icon-button';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { size } from '@/theme/tokens';

import { bottomInsetStyle, styles } from './LogActionBar.styles';

interface LogActionBarProps {
  primaryLabel: string;
  onPrimary: () => void;
  /** Null hides "Anterior" (editing a logged day, as in the mockup). */
  onPrevious: (() => void) | null;
  previousDisabled: boolean;
}

export function LogActionBar({ primaryLabel, onPrimary, onPrevious, previousDisabled }: LogActionBarProps) {
  const insets = useSafeAreaInsets();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={[styles.bar, backgroundStyles.surface, bottomInsetStyle(insets.bottom)]}>
      {onPrevious ? <IconButton icon={ChevronLeft} label={TEACHER_DAY_COPY.previous} onPress={onPrevious} disabled={previousDisabled} /> : null}
      <Button label={primaryLabel} height={size.teacherAction} style={styles.primary} onPress={onPrimary} />
    </View>
  );
}
