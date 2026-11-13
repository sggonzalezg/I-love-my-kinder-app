import { Image } from 'expo-image';
import { Film, X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/text';
import { TEACHER_UPLOAD_COPY } from '@/features/teacher-upload/teacher-upload-copy';
import { formatCountdown } from '@/lib/dates';
import { isTooLong, type PickedMedia } from '@/lib/gallery-upload';
import { useColors } from '@/theme/use-theme';

import { PLACEHOLDER_ICON_SIZE, REMOVE_HIT_SLOP, REMOVE_ICON_SIZE, styles, usePickedTileStyles } from './PickedTile.styles';

interface PickedTileProps {
  media: PickedMedia;
  onRemove: () => void;
}

export function PickedTile({ media, onRemove }: PickedTileProps) {
  const colors = useColors();
  const themed = usePickedTileStyles();
  const tooLong = isTooLong(media);
  const previewUri = media.kind === 'video' ? media.thumbnailUri : media.uri;

  return (
    <View style={styles.tile}>
      {previewUri ? (
        <Image source={previewUri} style={[styles.image, tooLong && styles.tooLong]} contentFit="cover" accessible={false} />
      ) : (
        <View style={[styles.placeholder, themed.placeholder, tooLong && styles.tooLong]}>
          <Film size={PLACEHOLDER_ICON_SIZE} color={colors.muted} strokeWidth={1.8} />
        </View>
      )}
      {media.durationSeconds !== null ? (
        <View style={[styles.badge, tooLong && themed.tooLongBadge]}>
          <Text numeric style={[styles.badgeText, themed.badgeText]}>
            {formatCountdown(media.durationSeconds)}
          </Text>
        </View>
      ) : null}
      <Pressable onPress={onRemove} hitSlop={REMOVE_HIT_SLOP} accessibilityRole="button" accessibilityLabel={TEACHER_UPLOAD_COPY.remove} style={styles.remove}>
        <X size={REMOVE_ICON_SIZE} color={colors.white} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}
