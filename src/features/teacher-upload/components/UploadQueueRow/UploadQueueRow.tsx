import { Image } from 'expo-image';
import { Film, RefreshCw } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { UploadStatusLine } from '@/features/teacher-upload/components/UploadStatusLine/UploadStatusLine';
import { TEACHER_UPLOAD_COPY } from '@/features/teacher-upload/teacher-upload-copy';
import { formatCountdown } from '@/lib/dates';
import type { UploadItem } from '@/lib/gallery-upload';
import { useColors } from '@/theme/use-theme';

import { PLACEHOLDER_ICON_SIZE, RETRY_BUTTON_HEIGHT, styles, useUploadQueueRowStyles } from './UploadQueueRow.styles';

const PERCENT = 100;

interface UploadQueueRowProps {
  item: UploadItem;
  separated: boolean;
  onRetry: () => void;
}

export function UploadQueueRow({ item, separated, onRetry }: UploadQueueRowProps) {
  const colors = useColors();
  const themed = useUploadQueueRowStyles();
  const previewUri = item.kind === 'video' ? (item.coverUri ?? item.thumbnailUri) : (item.preparedUri ?? item.uri);
  const name = TEACHER_UPLOAD_COPY.itemName(item.kind, item.durationSeconds !== null ? formatCountdown(item.durationSeconds) : null);
  const showsPercent = item.status === 'uploading' || item.status === 'queued';

  return (
    <View style={[styles.row, separated && styles.separated, themed.row]}>
      {previewUri ? (
        <Image source={previewUri} style={styles.thumb} contentFit="cover" accessible={false} />
      ) : (
        <View style={[styles.thumb, themed.placeholder]}>
          <Film size={PLACEHOLDER_ICON_SIZE} color={colors.muted} strokeWidth={1.8} />
        </View>
      )}
      <View style={styles.text}>
        <View style={styles.between}>
          <Text variant="bodyStrong" numberOfLines={1}>
            {name}
          </Text>
          {showsPercent ? (
            <Text variant="caption" tone="muted" numeric>
              {TEACHER_UPLOAD_COPY.progress(Math.round(item.progress * PERCENT))}
            </Text>
          ) : null}
        </View>
        <UploadStatusLine item={item} />
      </View>
      {item.status === 'failed' ? <Button label={TEACHER_UPLOAD_COPY.retry} icon={RefreshCw} variant="soft" height={RETRY_BUTTON_HEIGHT} onPress={onRetry} /> : null}
    </View>
  );
}
