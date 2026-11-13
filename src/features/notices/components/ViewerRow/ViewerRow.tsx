import { CheckCheck } from 'lucide-react-native';
import { View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Text } from '@/components/text';
import { initials } from '@/lib/format';
import { viewerSeenLabel, type NoticeViewer } from '@/lib/notices';
import { useColors } from '@/theme/use-theme';

import { SEEN_ICON_SIZE, styles } from './ViewerRow.styles';

interface ViewerRowProps {
  viewer: NoticeViewer;
  now: Date;
}

export function ViewerRow({ viewer, now }: ViewerRowProps) {
  const colors = useColors();
  const nameWords = viewer.name.split(' ');
  const [firstName, lastName] = [nameWords[0], nameWords[nameWords.length - 1]];
  const hasSeen = viewer.seenAt !== null;
  return (
    <View style={styles.row}>
      <Avatar photoPath={null} initials={initials(firstName, lastName)} />
      <View style={styles.texts}>
        <Text variant="bodyStrong">{viewer.name}</Text>
        <Text variant="small" tone="muted">
          {viewer.relation}
        </Text>
      </View>
      <View style={styles.status}>
        {hasSeen ? <CheckCheck size={SEEN_ICON_SIZE} color={colors.ok} strokeWidth={2} /> : null}
        <Text variant="small" tone={hasSeen ? 'ok' : 'muted'} numeric>
          {viewerSeenLabel(viewer.seenAt, now)}
        </Text>
      </View>
    </View>
  );
}
