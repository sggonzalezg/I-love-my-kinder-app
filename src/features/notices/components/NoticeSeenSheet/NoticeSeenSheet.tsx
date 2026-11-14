import { ScrollView, View } from 'react-native';

import { Button } from '@/components/button';
import { ProgressTrack } from '@/components/ProgressTrack/ProgressTrack';
import { Sheet } from '@/components/sheet';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { fetchNoticeViewers } from '@/data/notices';
import { useAsync } from '@/data/use-async';
import { ViewerRow } from '@/features/notices/components/ViewerRow/ViewerRow';
import { NOTICES_COPY } from '@/features/notices/notices-copy';
import { seenByLabel, seenShare, sortViewers, type SeenSummary } from '@/lib/notices';

import { SKELETON_ROW_HEIGHT, SKELETON_ROWS, styles } from './NoticeSeenSheet.styles';

interface NoticeSeenSheetProps {
  noticeId: string;
  summary: SeenSummary;
  visible: boolean;
  onClose: () => void;
}

export function NoticeSeenSheet({ noticeId, summary, visible, onClose }: NoticeSeenSheetProps) {
  const viewers = useAsync(() => fetchNoticeViewers(noticeId), visible ? noticeId : null);
  const now = new Date();

  return (
    <Sheet visible={visible} onClose={onClose} sheetStyle={styles.sheet} scrollableContent>
      <View style={styles.content}>
        <Text variant="title" accessibilityRole="header" numeric>
          {seenByLabel(summary)}
        </Text>
        <ProgressTrack fraction={seenShare(summary)} thin />
        {viewers.failed ? (
          <View style={styles.error}>
            <Text tone="red">{NOTICES_COPY.viewersLoadError}</Text>
            <Button label={NOTICES_COPY.retry} variant="soft" onPress={viewers.reload} />
          </View>
        ) : null}
        {!viewers.failed && viewers.data === null ? (
          <View style={styles.skeleton}>
            {Array.from({ length: SKELETON_ROWS }, (_, index) => (
              <Skeleton key={index} height={SKELETON_ROW_HEIGHT} />
            ))}
          </View>
        ) : null}
        {viewers.data ? (
          <ScrollView style={styles.list}>
            {sortViewers(viewers.data).map((viewer) => (
              <ViewerRow key={viewer.id} viewer={viewer} now={now} />
            ))}
          </ScrollView>
        ) : null}
      </View>
    </Sheet>
  );
}
