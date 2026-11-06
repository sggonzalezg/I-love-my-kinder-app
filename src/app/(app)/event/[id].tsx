import { Image, View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { EventTypeChip } from '@/components/event-type-chip';
import { FactsCard } from '@/components/facts-card';
import { Banner } from '@/components/banner';
import { mockEvents } from '@/data/events';
import { space } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();

  // Find the event
  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <Screen>
        <Text style={{ color: c.muted }}>Evento no encontrado</Text>
      </Screen>
    );
  }

  const eventDate = new Date(event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPast = eventDate < today;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image header */}
        {event.image_url && (
          <Image
            source={{ uri: event.image_url }}
            style={{
              width: '100%',
              height: 220,
              borderRadius: 12,
              marginBottom: space.s4,
            }}
          />
        )}

        {/* Type chip */}
        <EventTypeChip type={event.type} />

        {/* Title */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: c.ink,
            marginTop: space.s4,
            marginBottom: space.s4,
          }}
        >
          {event.title}
        </Text>

        {/* Changed banner */}
        {event.changed_at && !isPast && (
          <View style={{ marginBottom: space.s4 }}>
            <Banner
              variant="info"
              text={`Cambió la hora: antes era a las ${event.changed_previous_time}`}
            />
          </View>
        )}

        {/* Facts card */}
        <FactsCard event={event} />

        {/* Past event indicator */}
        {isPast && (
          <View style={{ marginBottom: space.s4 }}>
            <Banner
              variant="info"
              text="Ya pasó"
            />
          </View>
        )}

        {/* Description */}
        {event.description && (
          <View style={{ marginBottom: space.s4 }}>
            <Text style={{ color: c.ink, lineHeight: 24 }}>
              {event.description}
            </Text>
          </View>
        )}

        {/* Reminder line */}
        {event.reminder_at && !isPast && (
          <View
            style={{
              backgroundColor: c.blue50,
              borderRadius: 8,
              padding: space.s4,
              marginBottom: space.s4,
              flexDirection: 'row',
              gap: space.s1,
            }}
          >
            <Text style={{ color: c.blue }}>🔔</Text>
            <Text style={{ color: c.blue, flex: 1 }}>
              Te recordamos el{' '}
              {new Date(event.reminder_at).toLocaleDateString('es-UY', {
                weekday: 'long',
                day: 'numeric',
              })}{' '}
              a las{' '}
              {new Date(event.reminder_at).toLocaleTimeString('es-UY', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
