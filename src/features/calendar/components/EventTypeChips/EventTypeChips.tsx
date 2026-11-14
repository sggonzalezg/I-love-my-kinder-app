import * as Haptics from 'expo-haptics';
import { Calendar, CalendarX, PartyPopper, Palette, Bus, Users, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import { eventTypeLabel, type EventType } from '@/lib/calendar';
import { useColors } from '@/theme/use-theme';

import { CHIP_ICON_SIZE, CHIP_PRESSED_SCALE, styles, useEventTypeChipsStyles } from './EventTypeChips.styles';

const TYPE_ICONS: Record<EventType, LucideIcon> = {
  workshop: Palette,
  meeting: Users,
  outing: Bus,
  celebration: PartyPopper,
  no_classes: CalendarX,
  other: Calendar,
};

interface EventTypeChipsProps {
  label: string;
  types: EventType[];
  value: EventType | null;
  onChange: (type: EventType) => void;
}

export function EventTypeChips({ label, types, value, onChange }: EventTypeChipsProps) {
  const colors = useColors();
  const themed = useEventTypeChipsStyles();
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {types.map((type) => {
        const selected = type === value;
        const Icon = TYPE_ICONS[type];
        return (
          <PressableScale
            key={type}
            pressedScale={CHIP_PRESSED_SCALE}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => {
              if (selected) return;
              Haptics.selectionAsync();
              onChange(type);
            }}
            style={[styles.chip, selected ? themed.selected : themed.idle]}>
            <Icon size={CHIP_ICON_SIZE} color={selected ? colors.onBlue : colors.ink} />
            <Text variant="smallStrong" tone={selected ? 'onBlue' : 'ink'}>
              {eventTypeLabel(type)}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}
