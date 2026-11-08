import { View } from 'react-native';

import { Skeleton } from '@/components/skeleton';

import { SKELETON_ROWS, SKELETON_ROW_HEIGHT, styles } from './chat-list-screen.styles';

export function ChatListSkeleton() {
  return (
    <View style={styles.list}>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <Skeleton key={index} height={SKELETON_ROW_HEIGHT} />
      ))}
    </View>
  );
}
