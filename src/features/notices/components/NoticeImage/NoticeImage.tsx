import { Image } from 'expo-image';
import { CloudOff, RefreshCw, Search } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Text } from '@/components/text';
import type { NoticeImageStatus } from '@/features/notices/notice-detail-reducer';
import { NOTICES_COPY } from '@/features/notices/notices-copy';
import { size } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { ICON_SIZE, styles, useNoticeImageStyles, ZOOM_ICON_SIZE } from './NoticeImage.styles';

interface NoticeImageProps {
  url: string | null;
  status: NoticeImageStatus;
  title: string;
  onLoad: () => void;
  onError: () => void;
  onRetry: () => void;
  onOpen: () => void;
}

export function NoticeImage({ url, status, title, onLoad, onError, onRetry, onOpen }: NoticeImageProps) {
  const colors = useColors();
  const themed = useNoticeImageStyles();

  if (status === 'failed') {
    return (
      <View style={[styles.broken, themed.broken]}>
        <CloudOff size={ICON_SIZE} color={colors.muted} strokeWidth={1.8} />
        <Text variant="small" tone="muted">
          {NOTICES_COPY.imageLoadError}
        </Text>
        <Button label={NOTICES_COPY.retry} icon={RefreshCw} variant="soft" height={size.touch} onPress={onRetry} />
      </View>
    );
  }

  return (
    <Pressable onPress={onOpen} disabled={status !== 'loaded'} accessibilityRole="imagebutton" accessibilityLabel={NOTICES_COPY.imageAlt(title)} style={[styles.frame, themed.frame]}>
      {url ? <Image source={{ uri: url }} style={styles.image} contentFit="cover" onLoad={onLoad} onError={onError} /> : null}
      {status === 'loaded' ? (
        <View style={styles.zoom} accessibilityLabel={NOTICES_COPY.zoomImage}>
          <Search size={ZOOM_ICON_SIZE} color={colors.white} strokeWidth={2} />
        </View>
      ) : null}
    </Pressable>
  );
}
