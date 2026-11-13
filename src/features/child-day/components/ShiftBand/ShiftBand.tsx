import { Sun, Sunset } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { shiftBandTitle, type ShiftName } from '@/lib/shift';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import type { ColorName } from '@/theme/tokens';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { SHIFT_ICON_SIZE, styles } from './ShiftBand.styles';

// Design round 10: the morning band is light and the afternoon one dark, so the two halves never look alike.
const BAND_PALETTES: Record<ShiftName, { band: ColorName; text: ColorName; circle: ColorName; icon: ColorName }> = {
  morning: { band: 'blue50', text: 'ink', circle: 'surface', icon: 'blue' },
  afternoon: { band: 'ink', text: 'ground', circle: 'ground', icon: 'ink' },
};

interface ShiftBandProps {
  shift: ShiftName;
  line: string;
}

export function ShiftBand({ shift, line }: ShiftBandProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const palette = BAND_PALETTES[shift];
  const Icon = shift === 'morning' ? Sun : Sunset;

  return (
    <View style={[styles.band, backgroundStyles[palette.band]]} accessible>
      <View style={[styles.iconCircle, backgroundStyles[palette.circle]]}>
        <Icon size={SHIFT_ICON_SIZE} color={colors[palette.icon]} strokeWidth={iconStroke.regular} />
      </View>
      <View style={styles.texts}>
        <Text tone={palette.text} style={styles.title}>
          {shiftBandTitle(shift)}
        </Text>
        <Text variant="small" tone={palette.text} numeric>
          {line}
        </Text>
      </View>
    </View>
  );
}
