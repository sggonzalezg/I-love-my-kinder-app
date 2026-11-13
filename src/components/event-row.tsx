import { View, TouchableOpacity, Image } from 'react-native';
import Animated, { useReducedMotion, ReduceMotion, FadeInDown } from 'react-native-reanimated';
import type { Event } from '@/data/events';
import { Chip } from '@/components/chip';
import { EventTypeChip } from '@/components/event-type-chip';
import { CALENDAR_PERMISSION_LABELS, PERMISSION_CHIP_VARIANT } from '@/constants/outing';
import type { PermissionStatus } from '@/lib/outing';
import { Text } from '@/components/text';
import { space, radius } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import { formatShortDate, fromIsoDate } from '@/lib/dates';

interface EventRowProps {
  event: Event;
  onPress?: (event: Event) => void;
  index?: number;
  permissionStatus?: PermissionStatus;
}

export function EventRow({ event, onPress, index = 0, permissionStatus }: EventRowProps) {
  const c = useColors();
  const reduced = useReducedMotion();

  const eventDate = fromIsoDate(event.date);
  const dateStr = formatShortDate(eventDate);
  const timeStr = event.time_start
    ? `${event.time_start}${event.time_end ? ` a ${event.time_end}` : ''}`
    : 'Todo el día';

  // Cap stagger at 6 items as per design spec
  const delay = index < 6 ? index * 40 : 0;

  return (
    <Animated.View
      entering={
        reduced
          ? FadeInDown.duration(120).reduceMotion(ReduceMotion.System)
          : FadeInDown.delay(delay).duration(300).damping(1).mass(1)
      }
    >
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
            {permissionStatus && (
              <Chip label={CALENDAR_PERMISSION_LABELS[permissionStatus]} variant={PERMISSION_CHIP_VARIANT[permissionStatus]} />
            )}
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
    </Animated.View>
  );
}
