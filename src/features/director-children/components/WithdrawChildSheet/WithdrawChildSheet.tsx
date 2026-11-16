import { View } from 'react-native';

import { Button } from '@/components/button';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';

import { styles } from './WithdrawChildSheet.styles';

interface WithdrawChildSheetProps {
  visible: boolean;
  firstName: string;
  withdrawing: boolean;
  failed: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function WithdrawChildSheet({ visible, firstName, withdrawing, failed, onConfirm, onClose }: WithdrawChildSheetProps) {
  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text variant="title" accessibilityRole="header" style={styles.title}>
        {DIRECTOR_CHILDREN_COPY.withdrawTitle(firstName)}
      </Text>
      <Text>{DIRECTOR_CHILDREN_COPY.withdrawBody}</Text>
      <Text style={styles.paragraph}>
        <Text variant="bodyStrong">{DIRECTOR_CHILDREN_COPY.withdrawFamilyKeepsLead}</Text>
        {DIRECTOR_CHILDREN_COPY.withdrawFamilyKeeps}
      </Text>
      {failed ? (
        <Text tone="red" style={styles.paragraph}>
          {DIRECTOR_CHILDREN_COPY.withdrawFailed}
        </Text>
      ) : null}
      <View style={styles.actions}>
        <Button
          label={withdrawing ? DIRECTOR_CHILDREN_COPY.withdrawing : DIRECTOR_CHILDREN_COPY.withdraw}
          variant="danger"
          block
          loading={withdrawing}
          onPress={onConfirm}
        />
        {withdrawing ? null : <Button label={DIRECTOR_CHILDREN_COPY.cancel} variant="plain" block onPress={onClose} />}
      </View>
    </Sheet>
  );
}
