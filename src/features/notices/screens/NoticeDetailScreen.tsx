import { router, useLocalSearchParams } from 'expo-router';
import { Calendar, CalendarX } from 'lucide-react-native';
import { useReducer } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { ImageViewer } from '@/components/image-viewer';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { CALENDAR_ROUTE } from '@/constants/routes';
import { CancelledEventDetails } from '@/features/notices/components/CancelledEventDetails/CancelledEventDetails';
import { NoticeImage } from '@/features/notices/components/NoticeImage/NoticeImage';
import { NoticeSender } from '@/features/notices/components/NoticeSender/NoticeSender';
import { INITIAL_NOTICE_DETAIL_STATE, NOTICE_DETAIL_ACTIONS, noticeDetailReducer } from '@/features/notices/notice-detail-reducer';
import { NOTICES_COPY } from '@/features/notices/notices-copy';
import { useNoticeDetail } from '@/features/notices/use-notice-detail';
import { bodyParagraphs, noticeMetaLine, noticeSender } from '@/lib/notices';

import { SKELETON_IMAGE_HEIGHT, SKELETON_TITLE_HEIGHT, styles, useNoticeDetailScreenStyles } from './NoticeDetailScreen.styles';

export function NoticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const themed = useNoticeDetailScreenStyles();
  const [state, dispatch] = useReducer(noticeDetailReducer, INITIAL_NOTICE_DETAIL_STATE);
  const { notice, userId, isFamily, audienceChildren, imageUrl, imageUrlFailed, loading, failed, reload } = useNoticeDetail(id, state.attempt);
  const header = <TopBar backLabel={NOTICES_COPY.backToNotices} />;

  if (loading) {
    return (
      <Screen header={header}>
        <View style={styles.skeleton}>
          <Skeleton height={SKELETON_TITLE_HEIGHT} />
          <Skeleton height={SKELETON_IMAGE_HEIGHT} />
        </View>
      </Screen>
    );
  }

  if (failed || !notice) {
    return (
      <Screen header={header}>
        <View style={styles.error}>
          <Text tone="red">{NOTICES_COPY.noticeLoadError}</Text>
          <Button label={NOTICES_COPY.retry} variant="soft" onPress={reload} />
        </View>
      </Screen>
    );
  }

  const sender = noticeSender(notice, userId);
  const paragraphs = bodyParagraphs(notice.body);

  return (
    <>
      <Screen header={header}>
        <View>
          {notice.cancelledEvent ? <Chip label={NOTICES_COPY.suspended} icon={CalendarX} variant="red" /> : null}
          <Text variant="title" accessibilityRole="header" style={notice.cancelledEvent ? styles.suspendedTitle : undefined}>
            {notice.title}
          </Text>
          <NoticeSender sender={sender} metaLine={noticeMetaLine(notice, new Date())} />
          {notice.imagePath ? (
            <NoticeImage
              url={imageUrl}
              status={imageUrlFailed ? 'failed' : state.image}
              title={notice.title}
              onLoad={() => dispatch({ type: NOTICE_DETAIL_ACTIONS.IMAGE_LOADED })}
              onError={() => dispatch({ type: NOTICE_DETAIL_ACTIONS.IMAGE_FAILED })}
              onRetry={() => dispatch({ type: NOTICE_DETAIL_ACTIONS.IMAGE_RETRIED })}
              onOpen={() => dispatch({ type: NOTICE_DETAIL_ACTIONS.VIEWER_OPENED })}
            />
          ) : null}
          {notice.cancelledEvent ? (
            <CancelledEventDetails event={notice.cancelledEvent} permissionChildren={isFamily ? audienceChildren : null} />
          ) : null}
          {paragraphs.length ? (
            <View style={[styles.bodyCard, themed.bodyCard]}>
              {paragraphs.map((paragraph, index) => (
                <Text key={index}>{paragraph}</Text>
              ))}
            </View>
          ) : null}
          {isFamily && notice.cancelledEvent ? (
            <View style={styles.calendarButton}>
              <Button label={NOTICES_COPY.seeCalendar} icon={Calendar} variant="soft" block onPress={() => router.navigate(CALENDAR_ROUTE)} />
            </View>
          ) : null}
        </View>
      </Screen>
      {state.viewerOpen && imageUrl ? (
        <ImageViewer imageUrl={imageUrl} title={notice.title} onClose={() => dispatch({ type: NOTICE_DETAIL_ACTIONS.VIEWER_CLOSED })} />
      ) : null}
    </>
  );
}
