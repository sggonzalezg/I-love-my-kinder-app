import { View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Text } from '@/components/text';
import { initials } from '@/lib/format';

import { styles } from './NoticeSender.styles';

interface NoticeSenderProps {
  sender: string;
  metaLine: string;
}

export function NoticeSender({ sender, metaLine }: NoticeSenderProps) {
  return (
    <View style={styles.row}>
      <Avatar photoPath={null} initials={initials(sender)} />
      <View style={styles.text}>
        <Text variant="bodyStrong">{sender}</Text>
        <Text variant="small" tone="muted" numeric>
          {metaLine}
        </Text>
      </View>
    </View>
  );
}
