import { ScrollView, View } from 'react-native';

import { Button } from '@/components/button';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import { CHILD_AUTHORIZATIONS } from '@/legal/texts';
import type { AuthorizationKey } from '@/lib/authorizations';

import { styles } from './AuthorizationTextSheet.styles';

interface AuthorizationTextSheetProps {
  authorizationKey: AuthorizationKey | null;
  childFullName: string;
  onClose: () => void;
  /** Without it the sheet only shows the text, as "Ver texto completo" does. */
  onAccept?: () => void;
  saving?: boolean;
}

export function AuthorizationTextSheet({ authorizationKey, childFullName, onClose, onAccept, saving = false }: AuthorizationTextSheetProps) {
  const document = authorizationKey ? CHILD_AUTHORIZATIONS[authorizationKey] : null;

  return (
    <Sheet visible={document !== null} onClose={onClose} scrollableContent>
      {document && (
        <View style={styles.content}>
          <Text variant="title">{document.title}</Text>
          <Text variant="caption" color="muted" numeric>
            Versión {document.version}
          </Text>
          <ScrollView style={styles.body}>
            <Text>{document.text(childFullName)}</Text>
          </ScrollView>
          <View style={styles.actions}>
            {onAccept && <Button label="Autorizo" block loading={saving} onPress={onAccept} />}
            <Button label={onAccept ? 'Cancelar' : 'Cerrar'} variant="plain" block disabled={saving} onPress={onClose} />
          </View>
        </View>
      )}
    </Sheet>
  );
}
