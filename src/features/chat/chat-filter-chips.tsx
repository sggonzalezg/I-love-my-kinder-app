import { CircleAlert } from 'lucide-react-native';
import { View } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import type { ChatFilterChip } from '@/lib/chat-filters';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import type { ColorName } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { CHAT_COPY } from './chat-copy';
import { FILTER_ICON_SIZE, styles } from './chat-filter-chips.styles';

interface ChatFilterChipsProps {
  chips: ChatFilterChip[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

const PALETTES: Record<'idle' | 'selected' | 'alert' | 'alertSelected', { background: ColorName; foreground: ColorName }> = {
  idle: { background: 'surface', foreground: 'ink' },
  selected: { background: 'blue', foreground: 'onBlue' },
  alert: { background: 'red50', foreground: 'red' },
  alertSelected: { background: 'red', foreground: 'onRed' },
};

export function ChatFilterChips({ chips, selectedKey, onSelect }: ChatFilterChipsProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();

  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={CHAT_COPY.filters}>
      {chips.map((chip) => {
        const selected = chip.key === selectedKey;
        const alert = chip.filter.kind === 'noTeacher';
        const palette = PALETTES[alert ? (selected ? 'alertSelected' : 'alert') : selected ? 'selected' : 'idle'];
        return (
          <PressableScale
            key={chip.key}
            haptic="selection"
            onPress={() => onSelect(chip.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[styles.chip, backgroundStyles[palette.background]]}>
            {alert ? <CircleAlert size={FILTER_ICON_SIZE} color={colors[palette.foreground]} strokeWidth={1.8} /> : null}
            <Text variant="smallStrong" tone={palette.foreground}>
              {chip.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}
