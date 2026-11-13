import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { Bell, Clock } from 'lucide-react-native';
import { View } from 'react-native';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { EventTypeChip } from '@/components/event-type-chip';
import { FactsCard } from '@/components/facts-card';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { useFamilyOutingRequests } from '@/data/use-family-outing-requests';
import { CALENDAR_COPY, changedTimeLine, reminderLine } from '@/features/calendar/calendar-copy';
import { useEventDetail } from '@/features/calendar/use-event-detail';
import { PermissionRequestCard } from '@/features/outing-permission/permission-request-card';
import { toIsoDate } from '@/lib/dates';
import { useColors } from '@/theme/use-theme';

import { REMINDER_ICON_SIZE, SKELETON_TITLE_HEIGHT, styles, useEventDetailScreenStyles } from './EventDetailScreen.styles';

export function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const themed = useEventDetailScreenStyles();
  const { event, loading, failed, reload } = useEventDetail(id);
  const pendingRequest = useFamilyOutingRequests().find((request) => request.eventId === id && request.status === 'pending');
  const header = <TopBar backLabel={CALENDAR_COPY.backToCalendar} />;

  if (loading) {
    return (
      <Screen header={header}>
        <View style={styles.feedback}>
          <Skeleton height={SKELETON_TITLE_HEIGHT} />
        </View>
      </Screen>
    );
  }

  if (failed || !event) {
    return (
      <Screen header={header}>
        <View style={styles.feedback}>
          <Text tone={failed ? 'red' : 'muted'}>{failed ? CALENDAR_COPY.eventLoadError : CALENDAR_COPY.eventNotFound}</Text>
          {failed ? <Button label={CALENDAR_COPY.retry} variant="soft" onPress={reload} /> : null}
        </View>
      </Screen>
    );
  }

  const isPast = event.date < toIsoDate(new Date());

  return (
    <Screen header={header}>
      {event.image_url ? <Image source={{ uri: event.image_url }} style={styles.hero} contentFit="cover" accessibilityIgnoresInvertColors /> : null}
      <EventTypeChip type={event.type} />
      <Text variant="title" style={styles.title}>
        {event.title}
      </Text>

      {pendingRequest ? (
        <View style={styles.block}>
          <PermissionRequestCard request={pendingRequest} />
        </View>
      ) : null}

      {event.changed_previous_time && !isPast ? (
        <View style={styles.block}>
          <Banner kind="info" icon={Clock} text={changedTimeLine(event.changed_previous_time)} />
        </View>
      ) : null}

      <FactsCard event={event} />

      {isPast ? <Banner kind="info" text={CALENDAR_COPY.eventPassed} /> : null}

      {event.description ? <Text style={styles.description}>{event.description}</Text> : null}

      {event.reminder_at ? (
        <View style={[styles.reminder, themed.reminder]}>
          <Bell size={REMINDER_ICON_SIZE} color={colors.blue} />
          <Text tone="blue" style={styles.reminderText}>
            {reminderLine(new Date(event.reminder_at))}
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}
