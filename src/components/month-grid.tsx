import { View, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { buildMonthGrid } from '@/lib/calendar';
import { Text } from '@/components/text';
import { space, radius } from '@/theme/tokens';
import { dotPop } from '@/theme/motion';
import { useColors } from '@/theme/use-theme';

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

interface MonthGridProps {
  year: number;
  month: number;
  selectedDay?: number | null;
  daysWithEvents?: Set<number>;
  noClassesDays?: Set<number>;
  onDayPress?: (day: number) => void;
  today?: number; // day of month for today, for highlighting
  /** Days before it cannot be chosen (the event form's day sheet). */
  minDate?: Date;
  /** The day whose dot pops in (an event just saved). */
  poppedDay?: number;
  showLegend?: boolean;
}

export function MonthGrid({
  year,
  month,
  selectedDay,
  daysWithEvents,
  noClassesDays,
  onDayPress,
  today,
  minDate,
  poppedDay,
  showLegend = true,
}: MonthGridProps) {
  const c = useColors();
  const weeks = buildMonthGrid(year, month);

  const isToday = (day: number | null) => day === today;
  const isPast = (day: number | null) => {
    if (!day) return false;
    const cellDate = new Date(year, month, day);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return cellDate < currentDate;
  };

  return (
    <View>
      {/* Weekday headers */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: space.s4 }}>
        {WEEKDAYS.map((day, idx) => (
          <Text
            key={idx}
            variant="small"
            style={{ color: c.muted, width: '14.28%', textAlign: 'center' }}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Day grid */}
      {weeks.map((week, weekIdx) => (
        <View key={weekIdx} style={{ flexDirection: 'row', marginBottom: space.s4 }}>
          {week.map((day, dayIdx) => {
            const hasEvent = day && daysWithEvents?.has(day);
            const isNoClasses = day && noClassesDays?.has(day);
            const isSelected = day === selectedDay;
            const isTodayCell = isToday(day);
            const isPastDay = isPast(day);
            const isBeforeMin = !!day && !!minDate && new Date(year, month, day) < minDate;
            const EventDot = day === poppedDay ? Animated.View : View;

            return (
              <TouchableOpacity
                key={dayIdx}
                onPress={() => day && onDayPress?.(day)}
                disabled={!day || isBeforeMin}
                accessibilityState={{ disabled: !day || isBeforeMin, selected: isSelected }}
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.full,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected ? c.blue : isNoClasses ? c.raised : 'transparent',
                    borderWidth: isTodayCell ? 2 : 0,
                    borderColor: c.blue,
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? c.onBlue : isBeforeMin ? c.border : isPastDay ? c.muted : c.ink,
                      fontWeight: '600',
                    }}
                  >
                    {day}
                  </Text>

                  {/* Event dot */}
                  {hasEvent && !isNoClasses && (
                    <EventDot
                      entering={day === poppedDay ? dotPop : undefined}
                      style={{
                        position: 'absolute',
                        bottom: 4,
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: c.blue,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {showLegend && (
      <View style={{ marginTop: space.s4, gap: space.s1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: c.blue,
            }}
          />
          <Text variant="small" style={{ color: c.muted }}>
            Evento
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: radius.md,
              backgroundColor: c.raised,
            }}
          />
          <Text variant="small" style={{ color: c.muted }}>
            Sin clases
          </Text>
        </View>
      </View>
      )}
    </View>
  );
}
