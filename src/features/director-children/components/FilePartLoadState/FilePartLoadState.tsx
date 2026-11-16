import { View } from 'react-native';

import { Button } from '@/components/button';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';

import { SKELETON_ROW_HEIGHTS, styles } from './FilePartLoadState.styles';

interface FilePartLoadStateProps {
  failed: boolean;
  errorText: string;
  onReload: () => void;
}

/** What a file part that loads its own list shows before it has one. */
export function FilePartLoadState({ failed, errorText, onReload }: FilePartLoadStateProps) {
  if (failed) {
    return (
      <View style={styles.error}>
        <Text tone="red">{errorText}</Text>
        <Button label={DIRECTOR_CHILDREN_COPY.retry} variant="soft" onPress={onReload} />
      </View>
    );
  }
  return (
    <View style={styles.skeletons}>
      {SKELETON_ROW_HEIGHTS.map((height, index) => (
        <Skeleton key={index} height={height} />
      ))}
    </View>
  );
}
