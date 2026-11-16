import { View } from 'react-native';

import { Button } from '@/components/button';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import { withdrawConfirm } from '@/legal/texts';

import { styles } from './WithdrawSheet.styles';

interface WithdrawSheetProps {
  visible: boolean;
  authorizationTitle: string;
  childFirstName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function WithdrawSheet({ visible, authorizationTitle, childFirstName, onConfirm, onClose }: WithdrawSheetProps) {
  return (
    <Sheet visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <Text variant="title">{withdrawConfirm(authorizationTitle, childFirstName)}</Text>
        <Button label="Retirar" variant="danger" block onPress={onConfirm} />
        <Button label="Cancelar" variant="plain" block onPress={onClose} />
      </View>
    </Sheet>
  );
}
