import { router } from 'expo-router';
import { Calendar, Lock } from 'lucide-react-native';
import { Fragment } from 'react';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { CALENDAR_ROUTE, noticeHref } from '@/constants/routes';
import { NoticeRow } from '@/features/notices/components/NoticeRow/NoticeRow';
import { NOTICES_COPY } from '@/features/notices/notices-copy';
import { useNotices } from '@/features/notices/use-notices';
import { withdrawnBannerText } from '@/lib/notices';
import { listEntering } from '@/theme/motion';

import { CALENDAR_BUTTON_HEIGHT, EMPTY_ILLUSTRATION, SKELETON_ROW_HEIGHT, SKELETON_ROWS, styles, useNoticesScreenStyles } from './NoticesScreen.styles';

export function NoticesScreen() {
  const reduced = useReducedMotion();
  const themed = useNoticesScreenStyles();
  const { notices, userId, isFamily, senderLabels, withdrawnChildren, loading, failed, reload } = useNotices();
  const now = new Date();
  // Staff notices come from Calendario events, so their inbox links there instead of composing (design round 25).
  const calendarButton = isFamily ? undefined : (
    <Button label={NOTICES_COPY.calendar} icon={Calendar} variant="soft" height={CALENDAR_BUTTON_HEIGHT} onPress={() => router.navigate(CALENDAR_ROUTE)} />
  );
  const header = <TopBar title={NOTICES_COPY.title} backLabel={NOTICES_COPY.backToToday} right={calendarButton} />;

  if (failed) {
    return (
      <Screen header={header}>
        <View style={styles.error}>
          <Text tone="red">{NOTICES_COPY.listLoadError}</Text>
          <Button label={NOTICES_COPY.retry} variant="soft" onPress={reload} />
        </View>
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen header={header}>
        <View style={styles.skeleton}>
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <Skeleton key={index} height={SKELETON_ROW_HEIGHT} />
          ))}
        </View>
      </Screen>
    );
  }

  if (notices.length === 0) {
    return (
      <Screen header={header}>
        <EmptyState title={NOTICES_COPY.emptyTitle} description={NOTICES_COPY.emptyHint} illustration={EMPTY_ILLUSTRATION} />
      </Screen>
    );
  }

  return (
    <Screen header={header}>
      {withdrawnChildren.length ? <Banner kind="info" icon={Lock} text={withdrawnBannerText(withdrawnChildren)} /> : null}
      <View style={[styles.list, themed.list]}>
        {notices.map((notice, index) => (
          <Fragment key={notice.id}>
            {index > 0 ? <View style={[styles.separator, themed.separator]} /> : null}
            <Animated.View entering={listEntering(index, reduced)}>
              <NoticeRow notice={notice} userId={userId} senderLabels={senderLabels} now={now} onPress={() => router.push(noticeHref(notice.id))} />
            </Animated.View>
          </Fragment>
        ))}
      </View>
    </Screen>
  );
}
