import { View } from 'react-native';
import {
  Calendar,
  MapPin,
  Users,
} from 'lucide-react-native';
import type { Event } from '@/data/events';
import { Text } from '@/components/text';
import { space, radius } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import { formatLongDate, fromIsoDate } from '@/lib/dates';

interface FactsCardProps {
  event: Event;
}

export function FactsCard({ event }: FactsCardProps) {
  const c = useColors();

  const eventDate = fromIsoDate(event.date);
  const dateStr = formatLongDate(eventDate);
  const timeStr = event.time_start
    ? `${event.time_start}${event.time_end ? ` a ${event.time_end}` : ''}`
    : 'Todo el día';

  return (
    <View
      style={{
        backgroundColor: c.surface,
        borderRadius: radius.md,
        padding: space.s4,
        marginVertical: space.s4,
        gap: space.s1,
      }}
    >
      {/* Date and time */}
      <View style={{ flexDirection: 'row', gap: space.s1 }}>
        <Calendar size={20} color={c.blue} strokeWidth={2} style={{ marginTop: 2 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: c.ink, fontWeight: '600' }}>{dateStr}</Text>
          <Text variant="small" style={{ color: c.muted }}>
            {timeStr}
          </Text>
        </View>
      </View>

      {/* Place if available */}
      {event.place && (
        <View style={{ flexDirection: 'row', gap: space.s1 }}>
          <MapPin size={20} color={c.blue} strokeWidth={2} style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: c.ink }}>{event.place}</Text>
          </View>
        </View>
      )}

      {/* Audience */}
      <View style={{ flexDirection: 'row', gap: space.s1 }}>
        <Users size={20} color={c.blue} strokeWidth={2} style={{ marginTop: 2 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: c.ink }}>{event.audience}</Text>
          {event.author_line && (
            <Text variant="small" style={{ color: c.muted }}>
              {event.author_line}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
