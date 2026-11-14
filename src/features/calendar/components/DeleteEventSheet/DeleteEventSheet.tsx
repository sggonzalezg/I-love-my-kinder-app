import { Trash2 } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/button';
import Input from '@/components/input';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import { CALENDAR_COPY, deleteSheetTitle } from '@/features/calendar/calendar-copy';
import { NotifiedBlock } from '@/features/calendar/components/NotifiedBlock/NotifiedBlock';
import { CANCELLATION_REASON_MAX_LENGTH } from '@/lib/event-cancellation';

import { styles } from './DeleteEventSheet.styles';

interface DeleteEventSheetProps {
  visible: boolean;
  eventTitle: string;
  hasEnded: boolean;
  notifiedLines: string[];
  voidedPermissionsLine: string | null;
  reason: string;
  deleting: boolean;
  failed: boolean;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteEventSheet({
  visible,
  eventTitle,
  hasEnded,
  notifiedLines,
  voidedPermissionsLine,
  reason,
  deleting,
  failed,
  onReasonChange,
  onConfirm,
  onClose,
}: DeleteEventSheetProps) {
  return (
    <Sheet visible={visible} onClose={onClose} sheetStyle={styles.sheet} scrollableContent>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text variant="title" accessibilityRole="header" style={styles.title}>
          {deleteSheetTitle(eventTitle)}
        </Text>
        <Text>{hasEnded ? CALENDAR_COPY.pastSheetBody : CALENDAR_COPY.deleteSheetBody}</Text>

        {hasEnded ? null : (
          <>
            <NotifiedBlock lines={notifiedLines} voidedPermissionsLine={voidedPermissionsLine} />
            <View style={styles.field}>
              <Text variant="smallStrong">{CALENDAR_COPY.reasonLabel}</Text>
              <Input
                value={reason}
                onChangeText={onReasonChange}
                maxLength={CANCELLATION_REASON_MAX_LENGTH}
                accessibilityLabel={CALENDAR_COPY.reasonLabel}
                editable={!deleting}
              />
              <Text variant="small" tone="muted">
                {CALENDAR_COPY.reasonHelp}
              </Text>
            </View>
          </>
        )}

        {failed ? <Text tone="red">{CALENDAR_COPY.deleteFailed}</Text> : null}

        <View style={styles.actions}>
          <Button
            label={hasEnded ? CALENDAR_COPY.deletePast : CALENDAR_COPY.deleteAndNotify}
            variant="danger"
            icon={Trash2}
            block
            loading={deleting}
            onPress={onConfirm}
          />
          <Button label={CALENDAR_COPY.cancel} variant="plain" block disabled={deleting} onPress={onClose} />
        </View>
      </ScrollView>
    </Sheet>
  );
}
