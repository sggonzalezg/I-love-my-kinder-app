import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { CALENDAR_TAB_ROUTE, GALLERY_TAB_ROUTE, childDayHref, eventHref } from '@/constants/routes';
import { useSession } from '@/data/session';
import { useFamilyOutingRequests } from '@/data/use-family-outing-requests';
import type { TodayKid } from '@/data/family-today';
import { useUnreadChatThreads } from '@/features/chat/use-unread-chat-threads';
import { FamilyTodayTopBar } from '@/features/family-today/components/FamilyTodayTopBar/FamilyTodayTopBar';
import { KidCard } from '@/features/family-today/components/KidCard/KidCard';
import { NextEventRow } from '@/features/family-today/components/NextEventRow/NextEventRow';
import { FAMILY_TODAY_COPY } from '@/features/family-today/family-today-copy';
import { useFamilyToday } from '@/features/family-today/use-family-today';
import { PermissionRequestCard } from '@/features/outing-permission/permission-request-card';
import { familyGreeting } from '@/lib/family-today';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { listEntering } from '@/theme/motion';

import { SKELETON_CHIPS_LINE, SKELETON_KID_CARDS, SKELETON_NAME_LINE, SKELETON_PHOTO_SIZE, styles } from './FamilyTodayScreen.styles';

function openKid(kid: TodayKid) {
  router.push(kid.dayStatus === 'readOnly' ? GALLERY_TAB_ROUTE : childDayHref(kid.id));
}

function KidCardsSkeleton() {
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={styles.kids}>
      {Array.from({ length: SKELETON_KID_CARDS }, (_, index) => (
        <View key={index} style={[styles.skeletonCard, backgroundStyles.surface]}>
          <Skeleton width={SKELETON_PHOTO_SIZE} height={SKELETON_PHOTO_SIZE} />
          <View style={styles.skeletonLines}>
            <Skeleton width={SKELETON_NAME_LINE.width} height={SKELETON_NAME_LINE.height} />
            <Skeleton width={SKELETON_CHIPS_LINE.width} height={SKELETON_CHIPS_LINE.height} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function FamilyTodayScreen() {
  const reduced = useReducedMotion();
  const { session } = useSession();
  const unreadChats = useUnreadChatThreads(session?.user_id ?? null);
  const pendingRequests = useFamilyOutingRequests().filter((request) => request.status === 'pending');
  const { familyToday, offline, loading, failed, reload } = useFamilyToday();

  const header = (
    <FamilyTodayTopBar greeting={familyGreeting(familyToday?.firstName ?? '')} unreadNotices={familyToday?.unreadNotices ?? 0} unreadChats={unreadChats} />
  );

  if (failed) {
    return (
      <Screen header={header}>
        <View style={styles.error}>
          <Text tone="red">{FAMILY_TODAY_COPY.loadError}</Text>
          <Button label={FAMILY_TODAY_COPY.retry} variant="soft" onPress={reload} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen header={header}>
      {offline ? <Banner kind="offline" text={FAMILY_TODAY_COPY.offline} /> : null}
      {pendingRequests.map((request) => (
        <PermissionRequestCard key={request.eventId} request={request} />
      ))}
      {loading || !familyToday ? (
        <KidCardsSkeleton />
      ) : (
        <View style={styles.kids}>
          {familyToday.kids.length === 0 ? <Text tone="muted">{FAMILY_TODAY_COPY.noChildren}</Text> : null}
          {familyToday.kids.map((kid, index) => (
            <Animated.View key={kid.id} entering={listEntering(index, reduced)}>
              <KidCard kid={kid} onPress={() => openKid(kid)} />
            </Animated.View>
          ))}
        </View>
      )}
      {familyToday?.nextEvent ? (
        <View>
          <View style={styles.sectionHeader}>
            <Text variant="section" accessibilityRole="header">
              {FAMILY_TODAY_COPY.nextEvent}
            </Text>
            <Pressable onPress={() => router.push(CALENDAR_TAB_ROUTE)} accessibilityRole="link" style={styles.seeCalendar}>
              <Text variant="smallStrong" tone="blue">
                {FAMILY_TODAY_COPY.seeCalendar}
              </Text>
            </Pressable>
          </View>
          <NextEventRow event={familyToday.nextEvent} onPress={() => router.push(eventHref(familyToday.nextEvent!.id))} />
        </View>
      ) : null}
    </Screen>
  );
}
