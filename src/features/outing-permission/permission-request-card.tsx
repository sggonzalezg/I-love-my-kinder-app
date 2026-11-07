import { router, type Href } from 'expo-router';
import { Clipboard } from 'lucide-react-native';
import { View } from 'react-native';

import { Chip } from '@/components/chip';
import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import { pendingRequestLine, type FamilyOutingRequest } from '@/lib/outing-permission';
import { useColors } from '@/theme/use-theme';
import { PERMISSION_COPY } from './outing-permission-copy';
import { usePermissionRequestCardStyles } from './permission-request-card.styles';

const ICON_SIZE = 20;

interface PermissionRequestCardProps {
  request: FamilyOutingRequest;
}

export function PermissionRequestCard({ request }: PermissionRequestCardProps) {
  const c = useColors();
  const styles = usePermissionRequestCardStyles();
  const line = pendingRequestLine(request.title, request.startsAt, request.pendingChildNames);

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${PERMISSION_COPY.requestTitle}. ${line}. ${PERMISSION_COPY.statusChip.pending}`}
      onPress={() => router.push(`/permission/${request.eventId}` as Href)}
      style={styles.card}>
      <Clipboard size={ICON_SIZE} color={c.wait} strokeWidth={1.8} />
      <View style={styles.text}>
        <Text variant="bodyStrong">{PERMISSION_COPY.requestTitle}</Text>
        <Text variant="small">{line}</Text>
        <Chip label={PERMISSION_COPY.statusChip.pending} variant="wait" />
      </View>
    </PressableScale>
  );
}
