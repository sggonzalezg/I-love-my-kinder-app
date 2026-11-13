import { View } from 'react-native';

import { PickedTile } from '@/features/teacher-upload/components/PickedTile/PickedTile';
import type { PickedMedia } from '@/lib/gallery-upload';

import { styles, TILES_PER_ROW } from './PickedGrid.styles';

interface PickedGridProps {
  picks: PickedMedia[];
  onRemove: (id: string) => void;
}

function rowsOf(picks: PickedMedia[]): PickedMedia[][] {
  const rows: PickedMedia[][] = [];
  for (let start = 0; start < picks.length; start += TILES_PER_ROW) rows.push(picks.slice(start, start + TILES_PER_ROW));
  return rows;
}

export function PickedGrid({ picks, onRemove }: PickedGridProps) {
  return (
    <View style={styles.grid}>
      {rowsOf(picks).map((row) => (
        <View key={row[0].id} style={styles.row}>
          {row.map((media) => (
            <PickedTile key={media.id} media={media} onRemove={() => onRemove(media.id)} />
          ))}
          {Array.from({ length: TILES_PER_ROW - row.length }, (_, index) => (
            <View key={index} style={styles.spacer} />
          ))}
        </View>
      ))}
    </View>
  );
}
