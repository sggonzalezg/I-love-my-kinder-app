import { Image } from 'expo-image';
import { CalendarX } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Chip } from '@/components/chip';
import { Text } from '@/components/text';
import { fetchNoticeImageUrl } from '@/data/notices';
import { useAsync } from '@/data/use-async';
import { SeenByChip } from '@/features/notices/components/SeenByChip/SeenByChip';
import { NOTICES_COPY } from '@/features/notices/notices-copy';
import { cancelledPreview, noticeAudience, noticeSender, noticeTimeLabel, type Notice } from '@/lib/notices';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { PREVIEW_LINES, styles, useNoticeRowStyles } from './NoticeRow.styles';

interface NoticeRowProps {
  notice: Notice;
  userId: string | null;
  now: Date;
  onPress: () => void;
}

export function NoticeRow({ notice, userId, now, onPress }: NoticeRowProps) {
  const themed = useNoticeRowStyles();
  const backgroundStyles = useBackgroundColorStyles();
  const thumbnail = useAsync(() => fetchNoticeImageUrl(notice.imagePath!), notice.imagePath);

  const sender = noticeSender(notice, userId);
  const time = noticeTimeLabel(new Date(notice.createdAt), now);
  const audience = noticeAudience(notice);
  const preview = notice.cancelledEvent ? cancelledPreview(notice.cancelledEvent) : notice.body;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={NOTICES_COPY.rowLabel(notice.title, sender, time, notice.unread)}
      style={({ pressed }) => [styles.row, pressed ? backgroundStyles.raised : backgroundStyles.surface]}>
      <View style={[styles.unreadDot, notice.unread && themed.unreadDot]} />
      <View style={styles.text}>
        <View style={styles.titleLine}>
          <Text variant="bodyStrong" numberOfLines={1} style={styles.title}>
            {notice.title}
          </Text>
          <Text variant="caption" tone="muted" numeric>
            {time}
          </Text>
        </View>
        <View style={styles.senderLine}>
          <Text variant="small" tone="muted">
            {sender}
          </Text>
          {notice.cancelledEvent ? <Chip label={NOTICES_COPY.suspended} icon={CalendarX} variant="red" compact /> : null}
          {!notice.cancelledEvent && audience ? <Chip label={audience} compact /> : null}
        </View>
        {preview ? (
          <Text variant="small" tone="muted" numberOfLines={PREVIEW_LINES}>
            {preview}
          </Text>
        ) : null}
        {notice.seen ? (
          <View style={styles.seenChip}>
            <SeenByChip summary={notice.seen} />
          </View>
        ) : null}
      </View>
      {thumbnail.data ? (
        <Image source={{ uri: thumbnail.data }} style={[styles.thumbnail, themed.thumbnail]} contentFit="cover" accessible={false} />
      ) : null}
    </Pressable>
  );
}
