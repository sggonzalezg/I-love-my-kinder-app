import { router } from 'expo-router';
import { Lock } from 'lucide-react-native';
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
import { noticeHref } from '@/constants/routes';
import { NoticeRow } from '@/features/notices/components/NoticeRow/NoticeRow';
import { NOTICES_COPY } from '@/features/notices/notices-copy';
import { useNotices } from '@/features/notices/use-notices';
import { withdrawnBannerText } from '@/lib/notices';
import { listEntering } from '@/theme/motion';

import { EMPTY_ILLUSTRATION, SKELETON_ROW_HEIGHT, SKELETON_ROWS, styles, useNoticesScreenStyles } from './NoticesScreen.styles';

export function NoticesScreen() {
  const reduced = useReducedMotion();
  const themed = useNoticesScreenStyles();
  const { notices, userId, withdrawnChildren, loading, failed, reload } = useNotices();
  const now = new Date();
  const header = <TopBar title={NOTICES_COPY.title} backLabel={NOTICES_COPY.backToToday} />;

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
              <NoticeRow notice={notice} userId={userId} now={now} onPress={() => router.push(noticeHref(notice.id))} />
            </Animated.View>
          </Fragment>
        ))}
      </View>
    </Screen>
  );
}
