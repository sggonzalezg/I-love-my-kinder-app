import { View, FlatList, Pressable } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect, Link } from 'expo-router';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { Chip } from '@/components/chip';
import { EmptyState } from '@/components/empty-state';
import { useColors } from '@/theme/use-theme';
import { space, radius } from '@/theme/tokens';
import { getAnnouncements } from '@/data/queries';
import type { Announcement } from '@/data/queries';
import { shortDateTime } from '@/lib/dates';

export default function NoticesScreen() {
  const colors = useColors();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useFocusEffect(
    useCallback(() => {
      const list = getAnnouncements();
      setAnnouncements(list);
    }, [])
  );

  if (announcements.length === 0) {
    return (
      <Screen>
        <TopBar title="Avisos" backLabel="Volver a Hoy" />
        <EmptyState
          title="No hay avisos"
          description="Cuando el jardín mande avisos, los verás aquí."
        />
      </Screen>
    );
  }

  const renderAnnouncement = ({ item }: { item: Announcement }) => {
    const isUnread = !item.created_at;
    const timeStr = shortDateTime(item.created_at);

    return (
      <Link href={`/notices/${item.id}` as any} asChild>
        <Pressable
          style={({ pressed }) => ({
            paddingVertical: space.s4,
            paddingHorizontal: space.s4,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <View style={{ flexDirection: 'row', gap: space.s4 }}>
            {isUnread && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: radius.full,
                  backgroundColor: colors.red,
                  marginTop: space.s2,
                }}
              />
            )}

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', flex: 1 }}>
                  {item.sender_name}
                </Text>
                <Chip
                  label={item.sender_role === 'teacher' ? 'Maestra' : 'Dirección'}
                  variant="blue"
                />
              </View>

              <Text
                numberOfLines={2}
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: space.s2,
                  color: colors.ink,
                }}
              >
                {item.title}
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 13,
                  color: colors.muted,
                  marginTop: space.s2,
                }}
              >
                {item.body}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: colors.muted,
                  marginTop: space.s2,
                }}
              >
                {timeStr}
              </Text>
            </View>

            {item.image_url && (
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: radius.sm,
                  backgroundColor: colors.raised,
                }}
              />
            )}

            {item.is_suspended && (
              <Chip label="Suspendido" variant="red" />
            )}
          </View>
        </Pressable>
      </Link>
    );
  };

  return (
    <Screen>
      <TopBar title="Avisos" backLabel="Volver a Hoy" />
      <FlatList
        data={announcements}
        renderItem={renderAnnouncement}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </Screen>
  );
}
