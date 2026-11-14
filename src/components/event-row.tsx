import { View, TouchableOpacity, Image } from 'react-native';
import Animated, { useReducedMotion, ReduceMotion, FadeInDown } from 'react-native-reanimated';
import type { Event } from '@/data/events';
import { Chip } from '@/components/chip';
import { EventTypeChip } from '@/components/event-type-chip';
import { CALENDAR_PERMISSION_LABELS, PERMISSION_CHIP_VARIANT } from '@/constants/outing';
import { eventRowMeta } from '@/lib/calendar';
import type { PermissionStatus } from '@/lib/outing';
import { Text } from '@/components/text';
import { formatShortDate, fromIsoDate } from '@/lib/dates';
import { listStagger, listStaggeredItems } from '@/theme/motion';

import { ENTRANCE_MS, REDUCED_ENTRANCE_MS, styles, useEventRowStyles } from './event-row.styles';

interface EventRowProps {
  event: Event;
  onPress?: (event: Event) => void;
  index?: number;
  permissionStatus?: PermissionStatus;
}

export function EventRow({ event, onPress, index = 0, permissionStatus }: EventRowProps) {
  const themed = useEventRowStyles();
  const reduced = useReducedMotion();

  const dateStr = formatShortDate(fromIsoDate(event.date));
  const timeStr = event.time_start ? `${event.time_start}${event.time_end ? ` a ${event.time_end}` : ''}` : 'Todo el día';
  const delay = index < listStaggeredItems ? index * listStagger : 0;

  return (
    <Animated.View
      entering={
        reduced
          ? FadeInDown.duration(REDUCED_ENTRANCE_MS).reduceMotion(ReduceMotion.System)
          : FadeInDown.delay(delay).duration(ENTRANCE_MS).damping(1).mass(1)
      }
    >
      <TouchableOpacity onPress={() => onPress?.(event)} style={[styles.row, themed.row]}>
        {event.image_url && <Image source={{ uri: event.image_url }} style={styles.thumbnail} />}

        <View style={styles.details}>
          <View style={styles.chips}>
            <EventTypeChip type={event.type} />
            {permissionStatus && (
              <Chip label={CALENDAR_PERMISSION_LABELS[permissionStatus]} variant={PERMISSION_CHIP_VARIANT[permissionStatus]} />
            )}
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {event.title}
          </Text>

          <Text variant="small" tone="muted">
            {dateStr} · {timeStr}
          </Text>

          <Text variant="small" tone="muted">
            {eventRowMeta(event)}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
