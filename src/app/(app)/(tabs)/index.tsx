import { View, ScrollView, RefreshControl } from 'react-native';
import { useState } from 'react';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { Bell } from '@/components/bell';
import { ChatIcon } from '@/components/chat-icon';
import { ChildCard } from '@/components/child-card';
import { Banner } from '@/components/banner';
import { useTheme } from '@/theme/use-theme';
import { getChildrenForFamily } from '@/data/queries';
import { useFamilyOutingRequests } from '@/data/use-family-outing-requests';
import { PermissionRequestCard } from '@/features/outing-permission/permission-request-card';

export default function IndexTab() {
  const [refreshing, setRefreshing] = useState(false);
  const { colors, spacing } = useTheme();
  const children = getChildrenForFamily();
  const pendingRequests = useFamilyOutingRequests().filter((request) => request.status === 'pending');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const unreadAnnouncements = 2;

  return (
    <Screen>
      <TopBar
        title="Hola, Ana"
        right={
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <ChatIcon href="/chat" />
            <Bell count={unreadAnnouncements} href="/notices" />
          </View>
        }
      />

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={{ flex: 1, paddingHorizontal: spacing.md }}
      >
        {/* Offline banner */}
        <Banner kind="offline" text="Sin conexión. Los cambios se enviarán cuando vuelva la conexión." />

        {pendingRequests.map((request) => (
          <PermissionRequestCard key={request.eventId} request={request} />
        ))}

        {/* Next event - simplified for now */}
        {/* <View style={{ marginBottom: spacing.md }}>
          <NextEventCard event={mockEvents[0]} />
        </View> */}

        {/* Children cards */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: spacing.sm }}>
            Hoy
          </Text>
          {children.length === 0 ? (
            <Text style={{ color: colors.onSurfaceVariant }}>
              Tu hijo no está inscripto en el jardín.
            </Text>
          ) : children.length === 1 ? (
            <Text style={{ color: colors.onSurfaceVariant, marginBottom: spacing.md }}>
              Cargando...
            </Text>
          ) : (
            children.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                status={child.status}
                routineStatus="synced"
              />
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
