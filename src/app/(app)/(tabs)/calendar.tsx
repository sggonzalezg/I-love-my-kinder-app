import { useCallback, useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useReducedMotion, ReduceMotion } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { MonthGrid } from '@/components/month-grid';
import { EventRow } from '@/components/event-row';
import { monthTitle } from '@/lib/calendar';
import { getEventsByDate, getPastEvents, mockEvents, type Event } from '@/data/events';
import { useEventsForMonth } from '@/data/use-events-query';
import { space } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

export default function CalendarTab() {
  const c = useColors();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const todayDay = isCurrentMonth ? today.getDate() : undefined;

  // Swipe gesture for month navigation
  const swipeX = useSharedValue(0);
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      swipeX.value = event.translationX;
    })
    .onEnd((event) => {
      const threshold = 50;
      if (event.translationX < -threshold) {
        handleNextMonth();
      } else if (event.translationX > threshold) {
        handlePreviousMonth();
      }
      swipeX.value = withSpring(0, { damping: 18, stiffness: 220 });
    });

  const swipeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: swipeX.value }],
  }));

  // Get events for the current month (with cache)
  const { events: monthEvents } = useEventsForMonth(year, month);

  // Build sets of days with events and no-classes
  const daysWithEvents = new Set<number>();
  const noClassesDays = new Set<number>();

  monthEvents.forEach((event) => {
    const eventDate = new Date(event.date);
    const day = eventDate.getUTCDate();
    if (event.type === 'no_classes') {
      noClassesDays.add(day);
    } else {
      daysWithEvents.add(day);
    }
  });

  // Get events to show in the list
  const getListEvents = useCallback(() => {
    if (selectedDay) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      return getEventsByDate(dateStr);
    }

    // Show upcoming events from today
    const todayStr = today.toISOString().split('T')[0];
    return getUpcomingEvents(todayStr);
  }, [selectedDay, year, month, today]);

  function getPastEventsCount(): number {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const monthEndStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    return getPastEvents(monthEndStr, 365, year, month).length;
  }

  function handlePreviousMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDay(null);
  }

  function handleNextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDay(null);
  }

  function handleEventPress(event: Event) {
    router.push(`../event/${event.id}`);
  }

  const listEvents = getListEvents();
  const pastEventsCount = getPastEventsCount();
  const selectedDate =
    selectedDay &&
    `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const selectedDateIsPast = selectedDate && selectedDate < today.toISOString().split('T')[0];

  return (
    <Screen scroll>
      {/* Month header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: space.s4,
        }}
      >
        <TouchableOpacity onPress={handlePreviousMonth}>
          <ChevronLeft size={24} color={c.ink} strokeWidth={2} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: c.ink,
          }}
        >
          {monthTitle(year, month)}
        </Text>

        <TouchableOpacity onPress={handleNextMonth}>
          <ChevronRight size={24} color={c.ink} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Month grid with swipe gesture */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={swipeAnimStyle}>
          <MonthGrid
            year={year}
            month={month}
            selectedDay={selectedDay}
            daysWithEvents={daysWithEvents}
            noClassesDays={noClassesDays}
            onDayPress={setSelectedDay}
            today={todayDay}
          />
        </Animated.View>
      </GestureDetector>

      {/* Lo que viene section */}
      <View style={{ marginTop: space.s10 }}>
        <View style={{ marginBottom: space.s4 }}>
          {selectedDay && selectedDate ? (
            selectedDateIsPast ? (
              <Text style={{ color: c.ink, fontWeight: '600', marginBottom: space.s1 }}>
                {new Date(selectedDate + 'T00:00:00Z').toLocaleDateString('es-UY', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}{' '}
                · ya pasó
              </Text>
            ) : (
              <Text style={{ color: c.ink, fontWeight: '600', marginBottom: space.s1 }}>
                {new Date(selectedDate + 'T00:00:00Z').toLocaleDateString('es-UY', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </Text>
            )
          ) : (
            <Text style={{ color: c.ink, fontWeight: '600' }}>Lo que viene</Text>
          )}
        </View>

        {listEvents.length > 0 ? (
          <>
            {listEvents.map((event, index) => (
              <EventRow key={event.id} event={event} onPress={handleEventPress} index={index} />
            ))}

            {selectedDay && pastEventsCount > 0 && (
              <Button
                title={`Ver lo que ya pasó en ${monthTitle(year, month).toLowerCase()} (${pastEventsCount})`}
                variant="soft"
                onPress={() => {
                  // TODO: navigate to past events view
                }}
              />
            )}
          </>
        ) : selectedDay ? (
          <Text style={{ color: c.muted }}>Sin eventos este día</Text>
        ) : (
          <Text style={{ color: c.muted }}>Nada agendado por ahora</Text>
        )}
      </View>

      {/* Empty state */}
      {monthEvents.length === 0 && !selectedDay && (
        <View style={{ marginTop: space.s4 }}>
          <Text style={{ color: c.muted }}>
            Todavía no hay eventos. Cuando el jardín agende talleres, reuniones o salidas, te
            avisamos y los ves acá.
          </Text>
        </View>
      )}
    </Screen>
  );
}

function getUpcomingEvents(fromDate: string) {
  return mockEvents
    .filter((event) => {
      const eventDate = new Date(event.date + 'T00:00:00Z');
      const from = new Date(fromDate + 'T00:00:00Z');
      return eventDate >= from;
    })
    .slice(0, 30);
}
