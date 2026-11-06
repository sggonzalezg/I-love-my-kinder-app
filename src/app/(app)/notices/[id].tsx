import { View, ScrollView, Image, Pressable } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { Chip } from '@/components/chip';
import { useColors } from '@/theme/use-theme';
import { space, radius } from '@/theme/tokens';
import { getAnnouncementById, markAnnouncementAsSeen } from '@/data/queries';
import type { Announcement } from '@/data/queries';
import { shortDateTime } from '@/lib/dates';
import { ImageViewer } from '@/components/image-viewer';
import { Maximize2 } from 'lucide-react-native';

export default function NoticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [showImageViewer, setShowImageViewer] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        const ann = getAnnouncementById(id);
        if (ann) {
          setAnnouncement(ann);
          markAnnouncementAsSeen(id, 'user-1');
        }
      }
    }, [id])
  );

  if (!announcement) {
    return (
      <Screen>
        <TopBar title="Aviso" backLabel="Volver a Avisos" />
        <Text>Cargando...</Text>
      </Screen>
    );
  }

  const timeStr = shortDateTime(announcement.created_at);

  return (
    <>
      <Screen>
        <TopBar title="Aviso" backLabel="Volver a Avisos" />
        <ScrollView style={{ flex: 1 }}>
          {announcement.image_url && (
            <View style={{ marginBottom: space.s4 }}>
              <Pressable
                onPress={() => setShowImageViewer(true)}
                style={{
                  position: 'relative',
                  height: 240,
                  backgroundColor: colors.raised,
                  borderRadius: radius.md,
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={{ uri: announcement.image_url }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <Pressable
                  style={{
                    position: 'absolute',
                    right: space.s4,
                    top: space.s4,
                    backgroundColor: `rgba(0, 0, 0, 0.6)`,
                    borderRadius: radius.sm,
                    padding: space.s3,
                  }}
                >
                  <Maximize2 size={24} color={colors.white} />
                </Pressable>
              </Pressable>
            </View>
          )}

          <View style={{ paddingHorizontal: space.s4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s2 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', flex: 1 }}>
                {announcement.sender_name}
              </Text>
              <Chip
                label={announcement.sender_role === 'teacher' ? 'Maestra' : 'Dirección'}
                variant="blue"
              />
            </View>

            {announcement.room && (
              <Text
                style={{
                  fontSize: 13,
                  color: colors.muted,
                  marginTop: space.s3,
                }}
              >
                Para {announcement.room}
                {announcement.shift && ` · Turno ${announcement.shift}`}
              </Text>
            )}

            <Text
              style={{
                fontSize: 24,
                fontWeight: '800',
                marginTop: space.s4,
              }}
            >
              {announcement.title}
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

            <Text
              style={{
                fontSize: 14,
                lineHeight: 20,
                color: colors.ink,
                marginTop: space.s4,
              }}
            >
              {announcement.body}
            </Text>

            {announcement.is_suspended && (
              <View
                style={{
                  backgroundColor: colors.red50,
                  paddingHorizontal: space.s4,
                  paddingVertical: space.s4,
                  borderRadius: radius.md,
                  marginTop: space.s6,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.red,
                    fontWeight: '600',
                  }}
                >
                  Suspendido
                </Text>
              </View>
            )}

            <View style={{ height: space.s6 }} />
          </View>
        </ScrollView>
      </Screen>

      {showImageViewer && announcement.image_url && (
        <ImageViewer
          imageUrl={announcement.image_url}
          title={announcement.title}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </>
  );
}
