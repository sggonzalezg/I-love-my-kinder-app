import { View, TouchableOpacity, Image } from 'react-native';
import type { Event } from '@/data/events';
import { EventTypeChip } from '@/components/event-type-chip';
import { Text } from '@/components/text';
import { space, radius } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import { formatShortDate } from '@/lib/dates';

interface EventRowProps {
  event: Event;
  onPress?: (event: Event) => void;
}

export function EventRow({ event, onPress }: EventRowProps) {
  const c = useColors();

  const eventDate = new Date(event.date);
  const dateStr = formatShortDate(eventDate);
  const timeStr = event.time_start
    ? `${event.time_start}${event.time_end ? ` a ${event.time_end}` : ''}`
    : 'Todo el día';

  return (
    <TouchableOpacity
      onPress={() => onPress?.(event)}
      style={{
        flexDirection: 'row',
        gap: space.s4,
        padding: space.s4,
        backgroundColor: c.surface,
        borderRadius: radius.md,
        marginBottom: space.s2,
        alignItems: 'center',
      }}
    >
      {/* Thumbnail if available */}
      {event.image_url && (
        <Image
          source={{ uri: event.image_url }}
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.md,
          }}
        />
      )}

      {/* Event details */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', gap: space.s1, marginBottom: space.s1 }}>
          <EventTypeChip type={event.type} />
        </View>

        <Text style={{ color: c.ink, marginBottom: space.s1 }} numberOfLines={1}>
          {event.title}
        </Text>

        <View style={{ flexDirection: 'row', gap: space.s1 }}>
          <Text variant="small" style={{ color: c.muted }}>
            {dateStr} · {timeStr}
          </Text>
        </View>

        <Text variant="small" style={{ color: c.muted }}>
          {event.audience}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
