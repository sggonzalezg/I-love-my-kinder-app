import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Bell, Clock, Pencil, Trash2 } from 'lucide-react-native';
import { View } from 'react-native';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { EventTypeChip } from '@/components/event-type-chip';
import { FactsCard } from '@/components/facts-card';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { editEventHref } from '@/constants/routes';
import { useSession } from '@/data/session';
import { useFamilyOutingRequests } from '@/data/use-family-outing-requests';
import { CALENDAR_COPY, changedTimeLine, reminderLine } from '@/features/calendar/calendar-copy';
import { DeleteEventSheet } from '@/features/calendar/components/DeleteEventSheet/DeleteEventSheet';
import { useEventDeletion } from '@/features/calendar/use-event-deletion';
import { useEventDetail } from '@/features/calendar/use-event-detail';
import { PermissionRequestCard } from '@/features/outing-permission/permission-request-card';
import { toIsoDate } from '@/lib/dates';
import { factsAuthorLine, notifiedLines } from '@/lib/event-cancellation';
import { canEditEvent } from '@/lib/event-form';
import { size } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { REMINDER_ICON_SIZE, SKELETON_TITLE_HEIGHT, styles, useEventDetailScreenStyles } from './EventDetailScreen.styles';

export function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const themed = useEventDetailScreenStyles();
  const { event, loading, failed, reload } = useEventDetail(id);
  const deletion = useEventDeletion(event);
  const pendingRequest = useFamilyOutingRequests().find((request) => request.eventId === id && request.status === 'pending');
  const { session } = useSession();
  const canEdit = Boolean(event && session && canEditEvent(session.active_role, event.created_by === session.user_id));
  const editButton = canEdit ? (
    <Button label={CALENDAR_COPY.edit} icon={Pencil} variant="soft" height={size.touch} onPress={() => router.push(editEventHref(id))} />
  ) : undefined;
  const header = <TopBar backLabel={CALENDAR_COPY.backToCalendar} right={editButton} />;

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

      <FactsCard event={{ ...event, author_line: factsAuthorLine(event.author_line, deletion.reach?.familyCount ?? null) }} />

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

      {deletion.staffAction === 'delete' ? (
        <View style={styles.staffAction}>
          <Button label={CALENDAR_COPY.deleteEvent} variant="danger-soft" icon={Trash2} block onPress={deletion.openSheet} />
        </View>
      ) : null}
      {deletion.staffAction === 'askDirection' ? (
        <Text variant="caption" tone="muted" style={styles.staffAction}>
          {CALENDAR_COPY.askDirection}
        </Text>
      ) : null}

      <DeleteEventSheet
        visible={deletion.state.sheetOpen}
        eventTitle={event.title}
        hasEnded={event.has_ended === true}
        notifiedLines={notifiedLines(event, deletion.reach)}
        reason={deletion.state.reason}
        deleting={deletion.state.deleting}
        failed={deletion.state.failed}
        onReasonChange={deletion.changeReason}
        onConfirm={deletion.confirm}
        onClose={deletion.closeSheet}
      />
    </Screen>
  );
}
