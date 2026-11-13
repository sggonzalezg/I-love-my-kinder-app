import { Check, CircleAlert, Clock, CloudOff } from 'lucide-react-native';
import { View } from 'react-native';

import { Chip } from '@/components/chip';
import { ProgressTrack } from '@/components/ProgressTrack/ProgressTrack';
import { TEACHER_UPLOAD_COPY } from '@/features/teacher-upload/teacher-upload-copy';
import type { UploadItem } from '@/lib/gallery-upload';

import { styles } from './UploadStatusLine.styles';

interface UploadStatusLineProps {
  item: UploadItem;
}

export function UploadStatusLine({ item }: UploadStatusLineProps) {
  switch (item.status) {
    case 'uploading':
    case 'queued':
      return (
        <View style={styles.progress}>
          <ProgressTrack fraction={item.progress} thin />
        </View>
      );
    case 'preparing':
      return (
        <View style={styles.chip}>
          <Chip label={TEACHER_UPLOAD_COPY.preparing} icon={Clock} variant="grey" />
        </View>
      );
    case 'offline':
      return (
        <View style={styles.chip}>
          <Chip label={TEACHER_UPLOAD_COPY.waiting} icon={CloudOff} variant="grey" />
        </View>
      );
    case 'failed':
      return (
        <View style={styles.chip}>
          <Chip label={TEACHER_UPLOAD_COPY.failed} icon={CircleAlert} variant="red" />
        </View>
      );
    case 'uploaded':
      return (
        <View style={styles.chip}>
          <Chip label={TEACHER_UPLOAD_COPY.uploaded(item.kind)} icon={Check} variant="ok" />
        </View>
      );
  }
}
