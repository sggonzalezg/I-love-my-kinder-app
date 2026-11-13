import { ClipboardCheck } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { NOTICES_COPY } from '@/features/notices/notices-copy';
import { cancelledWhatLine, cancelledWhenLine, voidPermissionTitle, type CancelledEvent } from '@/lib/notices';
import { useColors } from '@/theme/use-theme';

import { PERMISSION_ICON_SIZE, styles, useCancelledEventDetailsStyles } from './CancelledEventDetails.styles';

const OUTING_EVENT_TYPE = 'outing';

interface CancelledEventDetailsProps {
  event: CancelledEvent;
  /** Shown only to a family: the outing permission its children had is void. */
  permissionChildren: string[] | null;
}

export function CancelledEventDetails({ event, permissionChildren }: CancelledEventDetailsProps) {
  const colors = useColors();
  const themed = useCancelledEventDetailsStyles();

  return (
    <View style={styles.stack}>
      <View style={[styles.was, themed.was]}>
        <Text variant="bodyStrong" style={styles.struck}>
          {cancelledWhenLine(event)}
        </Text>
        <Text variant="caption" tone="muted">
          {cancelledWhatLine(event)}
        </Text>
      </View>
      {event.reason ? (
        <View style={[styles.card, themed.card]}>
          <Text>
            <Text variant="bodyStrong">{NOTICES_COPY.reasonLabel}</Text> {event.reason}.
          </Text>
        </View>
      ) : null}
      {permissionChildren && event.eventType === OUTING_EVENT_TYPE ? (
        <View style={[styles.permission, themed.was]}>
          <View style={[styles.permissionIcon, themed.card]}>
            <ClipboardCheck size={PERMISSION_ICON_SIZE} color={colors.muted} strokeWidth={1.8} />
          </View>
          <View style={styles.permissionText}>
            <Text variant="section">{voidPermissionTitle(permissionChildren)}</Text>
            <Text variant="small">{NOTICES_COPY.voidPermissionHint}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
