import { View } from 'react-native';
import type { Event } from '@/data/events';
import { EventTypeChip } from '@/components/event-type-chip';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { space, radius } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import { formatShortDate } from '@/lib/dates';

interface NextEventCardProps {
  event: Event;
  onPress?: () => void;
}

export function NextEventCard({ event, onPress }: NextEventCardProps) {
  const c = useColors();

  const eventDate = new Date(event.date);
  const dateStr = formatShortDate(eventDate);
  const timeStr = event.time_start
    ? `${event.time_start}${event.time_end ? ` a ${event.time_end}` : ''}`
    : 'Todo el día';

  return (
    <View
      style={{
        backgroundColor: c.surface,
        borderRadius: radius.md,
        padding: space.s4,
        marginBottom: space.s4,
      }}
    >
      <Text variant="small" style={{ color: c.muted, marginBottom: space.s1 }}>
        Próximo en el jardín
      </Text>

      <EventTypeChip type={event.type} />

      <Text style={{ color: c.ink, marginTop: space.s1, marginBottom: space.s1 }}>
        {event.title}
      </Text>

      <Text variant="small" style={{ color: c.muted, marginBottom: space.s4 }}>
        {dateStr} · {timeStr} · {event.audience}
      </Text>

      <Button
        title="Ver calendario"
        onPress={onPress}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      />
    </View>
  );
}
