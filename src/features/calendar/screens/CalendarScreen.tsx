import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { useCallback, useEffect, useReducer } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { EventRow } from '@/components/event-row';
import { IconButton } from '@/components/icon-button';
import { MonthGrid } from '@/components/month-grid';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { Toast, TOAST_VISIBLE_MS } from '@/components/toast';
import { TopBar } from '@/components/top-bar';
import { eventHref, NEW_EVENT_ROUTE } from '@/constants/routes';
import { useSession } from '@/data/session';
import { useFamilyOutingRequests } from '@/data/use-family-outing-requests';
import {
  CALENDAR_COPY,
  backToMonthLabel,
  emptyMonthTitle,
  monthHeading,
  showPastLabel,
} from '@/features/calendar/calendar-copy';
import { CalendarListTitle } from '@/features/calendar/components/CalendarListTitle/CalendarListTitle';
import { CALENDAR_ACTIONS, calendarReducer, initialCalendarState } from '@/features/calendar/calendar-reducer';
import { useCalendar } from '@/features/calendar/use-calendar';
import { useMonthSwipe } from '@/features/calendar/use-month-swipe';
import { calendarList, markedDays, monthPeriod, type Event } from '@/lib/calendar';
import { MONTHS, fromIsoDate } from '@/lib/dates';
import { canCreateEvents } from '@/lib/event-form';

import { size } from '@/theme/tokens';

import { EMPTY_ILLUSTRATION, SKELETON_ROW_HEIGHT, SKELETON_ROWS, styles } from './CalendarScreen.styles';

export function CalendarScreen() {
  const [state, dispatch] = useReducer(calendarReducer, new Date(), initialCalendarState);
  const { monthEvents, upcomingEvents, hasAnyEvent, loading, failed, reload } = useCalendar(state.year, state.month);
  const outingRequests = useFamilyOutingRequests();
  const shiftMonth = useCallback((step: 1 | -1) => dispatch({ type: CALENDAR_ACTIONS.MONTH_SHIFTED, step }), []);
  const { gesture, gridStyle } = useMonthSwipe(shiftMonth);
  const { toast, newDay } = useLocalSearchParams<{ toast?: string; newDay?: string }>();
  const { session } = useSession();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => router.setParams({ toast: undefined, newDay: undefined }), TOAST_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const today = new Date();
  const monthName = MONTHS[state.month];
  const isCurrentMonth = monthPeriod(state.year, state.month, today) === 'current';
  const marked = markedDays(monthEvents, state.year, state.month);
  const list = calendarList({ ...state, monthEvents, upcomingEvents, today });
  const openEvent = (event: Event) => router.push(eventHref(event.id));
  const savedDay = newDay ? fromIsoDate(newDay) : null;
  const poppedDay = savedDay && savedDay.getFullYear() === state.year && savedDay.getMonth() === state.month ? savedDay.getDate() : undefined;
  const newEventButton =
    session && canCreateEvents(session.active_role) ? (
      <Button label={CALENDAR_COPY.newEvent} icon={Plus} height={size.touch} onPress={() => router.push(NEW_EVENT_ROUTE)} />
    ) : undefined;

  return (
    <View style={styles.root}>
      <Screen header={<TopBar title={CALENDAR_COPY.title} right={newEventButton} />}>
        <View style={styles.monthHeader}>
          <IconButton icon={ChevronLeft} label={CALENDAR_COPY.previousMonth} onPress={() => shiftMonth(-1)} />
          <Text variant="section">{monthHeading(state.year, state.month, today)}</Text>
          <IconButton icon={ChevronRight} label={CALENDAR_COPY.nextMonth} onPress={() => shiftMonth(1)} />
        </View>

        <GestureDetector gesture={gesture}>
          <Animated.View style={gridStyle}>
            <MonthGrid
              year={state.year}
              month={state.month}
              selectedDay={state.selectedDay}
              daysWithEvents={marked.withEvents}
              noClassesDays={marked.noClasses}
              onDayPress={(day) => dispatch({ type: CALENDAR_ACTIONS.DAY_TAPPED, day })}
              today={isCurrentMonth ? today.getDate() : undefined}
              poppedDay={poppedDay}
            />
          </Animated.View>
        </GestureDetector>

        {failed ? (
          <View style={styles.feedback}>
            <Text tone="red">{CALENDAR_COPY.loadError}</Text>
            <Button label={CALENDAR_COPY.retry} variant="soft" onPress={reload} />
          </View>
        ) : null}

        {!failed && loading ? (
          <View style={styles.feedback}>
            {Array.from({ length: SKELETON_ROWS }, (_, index) => (
              <Skeleton key={index} height={SKELETON_ROW_HEIGHT} />
            ))}
          </View>
        ) : null}

        {!failed && !loading && list.kind !== 'day' && list.events.length === 0 ? (
          <>
            <EmptyState
              title={hasAnyEvent ? emptyMonthTitle(monthName) : CALENDAR_COPY.noEventsYetTitle}
              description={CALENDAR_COPY.emptyHint}
              illustration={EMPTY_ILLUSTRATION}
            />
            {hasAnyEvent && !isCurrentMonth ? (
              <View style={styles.emptyAction}>
                <Button
                  label={backToMonthLabel(MONTHS[today.getMonth()])}
                  variant="soft"
                  onPress={() => dispatch({ type: CALENDAR_ACTIONS.CURRENT_MONTH_SHOWN, today: new Date() })}
                />
              </View>
            ) : null}
          </>
        ) : null}

        {!failed && !loading && (list.kind === 'day' || list.events.length > 0) ? (
          <>
            <View style={styles.listHeader}>
              <CalendarListTitle kind={list.kind} selectedDate={state.selectedDay ? new Date(state.year, state.month, state.selectedDay) : null} monthName={monthName} today={today} />
              {list.kind === 'day' ? (
                <Button label={CALENDAR_COPY.wholeMonth} variant="plain" onPress={() => dispatch({ type: CALENDAR_ACTIONS.WHOLE_MONTH_SHOWN })} />
              ) : null}
            </View>
            <View style={styles.list}>
              {list.events.map((event, index) => (
                <EventRow
                  key={event.id}
                  event={event}
                  index={index}
                  onPress={openEvent}
                  permissionStatus={outingRequests.find((request) => request.eventId === event.id)?.status}
                />
              ))}
              {list.events.length === 0 ? <Text tone="muted">{CALENDAR_COPY.noEventsThatDay}</Text> : null}
            </View>
            {list.pastCount > 0 ? (
              <View style={styles.footer}>
                <Button label={showPastLabel(monthName, list.pastCount)} variant="plain" block onPress={() => dispatch({ type: CALENDAR_ACTIONS.PAST_SHOWN })} />
              </View>
            ) : null}
          </>
        ) : null}
      </Screen>
      {toast ? <Toast message={toast} /> : null}
    </View>
  );
}
