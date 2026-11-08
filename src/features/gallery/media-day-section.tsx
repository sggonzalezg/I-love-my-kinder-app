import { View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { MediaTile } from '@/components/media-tile';
import { Text } from '@/components/text';
import type { GalleryMedia, MediaDaySection as Section } from '@/lib/gallery';
import { duration, easeOut, listRise, listStagger } from '@/theme/motion';

import { styles } from './media-day-section.styles';

const TILES_PER_ROW = 3;
const STAGGERED_SECTIONS = 6;

function rowsOf(items: GalleryMedia[]): (GalleryMedia | null)[][] {
  const rows: (GalleryMedia | null)[][] = [];
  for (let start = 0; start < items.length; start += TILES_PER_ROW) {
    const row: (GalleryMedia | null)[] = items.slice(start, start + TILES_PER_ROW);
    while (row.length < TILES_PER_ROW) row.push(null);
    rows.push(row);
  }
  return rows;
}

interface MediaDaySectionProps {
  section: Section;
  index: number;
  onMissingUrlRetry: () => void;
  onOpenMedia: (mediaId: string) => void;
}

export function MediaDaySection({ section, index, onMissingUrlRetry, onOpenMedia }: MediaDaySectionProps) {
  const reduced = useReducedMotion();
  const entering =
    reduced || index >= STAGGERED_SECTIONS
      ? undefined
      : FadeInDown.duration(duration.slow)
          .delay(index * listStagger)
          .easing(easeOut)
          .withInitialValues({ transform: [{ translateY: listRise }] });

  return (
    <Animated.View entering={entering} style={styles.section}>
      <View style={styles.header}>
        <Text variant="section" accessibilityRole="header">
          {section.title}
        </Text>
        {section.countLabel ? (
          <Text variant="caption" color="muted" numeric>
            {section.countLabel}
          </Text>
        ) : null}
      </View>
      <View style={styles.grid}>
        {rowsOf(section.items).map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((media, column) =>
              media ? (
                <MediaTile key={media.id} media={media} onMissingUrlRetry={onMissingUrlRetry} onOpen={onOpenMedia} />
              ) : (
                <View key={`filler-${column}`} style={styles.filler} />
              ),
            )}
          </View>
        ))}
      </View>
    </Animated.View>
  );
}
