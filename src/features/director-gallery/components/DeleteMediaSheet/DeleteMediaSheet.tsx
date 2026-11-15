import { Image } from 'expo-image';
import { Play, Trash2 } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import { DIRECTOR_GALLERY_COPY } from '@/features/director-gallery/director-gallery-copy';
import { deleteMediaCopy, mediaName, uploadedLine, type DirectorGalleryMedia } from '@/lib/director-gallery';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { styles, VIDEO_ICON_SIZE } from './DeleteMediaSheet.styles';

interface DeleteMediaSheetProps {
  media: DirectorGalleryMedia | null;
  deleting: boolean;
  failed: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteMediaSheet({ media, deleting, failed, onConfirm, onClose }: DeleteMediaSheetProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const copy = media ? deleteMediaCopy(media.type) : null;

  return (
    <Sheet visible={media !== null} onClose={onClose}>
      {media && copy ? (
        <View>
          {deleting ? null : (
            <View style={styles.media}>
              <View style={[styles.thumb, backgroundStyles.raised]}>
                {media.type === 'photo' && media.url ? (
                  <Image source={{ uri: media.url }} style={styles.thumb} contentFit="cover" accessible={false} />
                ) : (
                  <Play size={VIDEO_ICON_SIZE} color={colors.muted} strokeWidth={1.8} />
                )}
              </View>
              <View style={styles.details}>
                <Text variant="smallStrong">{mediaName(media)}</Text>
                <Text variant="small" tone="muted">
                  {uploadedLine(media, new Date())}
                </Text>
              </View>
            </View>
          )}
          <Text variant="title" accessibilityRole="header" style={styles.title}>
            {copy.title}
          </Text>
          <Text>{DIRECTOR_GALLERY_COPY.deleteBody}</Text>
          {failed ? <Text tone="red">{DIRECTOR_GALLERY_COPY.deleteFailed}</Text> : null}
          <View style={styles.actions}>
            <Button
              label={deleting ? DIRECTOR_GALLERY_COPY.deleting : copy.confirm}
              variant="danger"
              icon={Trash2}
              block
              loading={deleting}
              onPress={onConfirm}
            />
            {deleting ? null : <Button label={DIRECTOR_GALLERY_COPY.cancel} variant="plain" block onPress={onClose} />}
          </View>
        </View>
      ) : null}
    </Sheet>
  );
}
