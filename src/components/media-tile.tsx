import { Image } from 'expo-image';
import { Play, RefreshCw } from 'lucide-react-native';
import { useReducer } from 'react';
import { Pressable, View } from 'react-native';

import type { GalleryMedia } from '@/lib/gallery';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { BADGE_ICON_SIZE, RETRY_ICON_SIZE, styles } from './media-tile.styles';
import { MEDIA_TILE_ACTIONS, initialMediaTileState, mediaTileReducer } from './media-tile-reducer';
import { Text } from './text';

const MEDIA_LABEL = { photo: 'Foto de la sala', video: 'Video de la sala' } as const;

interface MediaTileProps {
  media: GalleryMedia;
  onMissingUrlRetry: () => void;
}

// Videos have no poster yet (the media table stores none), so they show a dark tile with the play badge.
export function MediaTile({ media, onMissingUrlRetry }: MediaTileProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const [state, dispatch] = useReducer(mediaTileReducer, media.url, initialMediaTileState);

  function retry() {
    if (media.url) dispatch({ type: MEDIA_TILE_ACTIONS.RETRIED });
    else onMissingUrlRetry();
  }

  if (media.type === 'video') {
    return (
      <View style={[styles.tile, backgroundStyles.black]} accessible accessibilityLabel={MEDIA_LABEL.video}>
        <View style={styles.badge}>
          <Play size={BADGE_ICON_SIZE} color={colors.white} fill={colors.white} />
        </View>
      </View>
    );
  }

  if (state.status === 'failed') {
    return (
      <Pressable style={[styles.tile, backgroundStyles.raised]} onPress={retry} accessibilityRole="button" accessibilityLabel="Reintentar cargar la foto">
        <View style={styles.retry}>
          <RefreshCw size={RETRY_ICON_SIZE} color={colors.muted} />
          <Text color="muted" style={styles.retryLabel}>
            Reintentar
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.tile, backgroundStyles.blue100]}>
      <Image
        key={state.attempt}
        source={{ uri: media.url ?? undefined }}
        style={styles.image}
        contentFit="cover"
        accessibilityLabel={MEDIA_LABEL.photo}
        onError={() => dispatch({ type: MEDIA_TILE_ACTIONS.FAILED })}
      />
    </View>
  );
}
