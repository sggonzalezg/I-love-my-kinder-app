import { Calendar, MapPin, Users } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';
import type { Event } from '@/data/events';
import { formatLongDate, fromIsoDate } from '@/lib/dates';
import { outingTimeLine } from '@/lib/outing-tally';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { FACT_ICON_SIZE, styles, useFactsCardStyles } from './facts-card.styles';

interface FactsCardProps {
  event: Event;
}

function timeLine({ type, time_start, time_end }: Event): string {
  if (!time_start) return 'Todo el día';
  if (type === 'outing' && time_end) return outingTimeLine(time_start, time_end);
  return time_end ? `${time_start} a ${time_end}` : time_start;
}

export function FactsCard({ event }: FactsCardProps) {
  const colors = useColors();
  const themed = useFactsCardStyles();
  const placeDetail = event.type === 'outing' ? event.transport : undefined;

  return (
    <View style={[styles.card, themed.card]}>
      <View style={styles.fact}>
        <Calendar size={FACT_ICON_SIZE} color={colors.blue} strokeWidth={iconStroke.bold} style={styles.icon} />
        <View style={styles.factText}>
          <Text variant="bodyStrong">{formatLongDate(fromIsoDate(event.date))}</Text>
          <Text variant="small" tone="muted">
            {timeLine(event)}
          </Text>
        </View>
      </View>

      {event.place ? (
        <View style={styles.fact}>
          <MapPin size={FACT_ICON_SIZE} color={colors.blue} strokeWidth={iconStroke.bold} style={styles.icon} />
          <View style={styles.factText}>
            <Text>{event.place}</Text>
            {placeDetail ? (
              <Text variant="small" tone="muted">
                {placeDetail}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      <View style={styles.fact}>
        <Users size={FACT_ICON_SIZE} color={colors.blue} strokeWidth={iconStroke.bold} style={styles.icon} />
        <View style={styles.factText}>
          <Text>{event.audience}</Text>
          {event.author_line ? (
            <Text variant="small" tone="muted">
              {event.author_line}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
