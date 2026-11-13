import { Image } from 'expo-image';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { TEACHER_UPLOAD_COPY } from '@/features/teacher-upload/teacher-upload-copy';

import { styles } from './UploadEmptyState.styles';

const EMPTY_ILLUSTRATION = require('@/assets/images/crayons-stephen-andrews.jpg');

export function UploadEmptyState() {
  return (
    <View style={styles.container}>
      <Image source={EMPTY_ILLUSTRATION} style={styles.illustration} contentFit="cover" accessible={false} />
      <Text accessibilityRole="header" style={styles.title}>
        {TEACHER_UPLOAD_COPY.emptyTitle}
      </Text>
      <Text tone="muted" style={styles.text}>
        {TEACHER_UPLOAD_COPY.emptyText}
      </Text>
      <Text variant="small" tone="muted" style={styles.help}>
        {TEACHER_UPLOAD_COPY.shareHint}
      </Text>
    </View>
  );
}
