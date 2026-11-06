import { X } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/icon-button';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import { CHILD_AUTHORIZATIONS } from '@/legal/texts';
import type { AuthorizationKey } from '@/lib/authorizations';
import { space } from '@/theme/tokens';

const MAX_TEXT_HEIGHT = 420;

interface AuthorizationTextSheetProps {
  authorizationKey: AuthorizationKey | null;
  childName: string;
  onClose: () => void;
}

export function AuthorizationTextSheet({ authorizationKey, childName, onClose }: AuthorizationTextSheetProps) {
  const document = authorizationKey ? CHILD_AUTHORIZATIONS[authorizationKey] : null;

  return (
    <Sheet visible={document !== null} onClose={onClose}>
      {document && (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="title" style={styles.title}>
              {document.title}
            </Text>
            <IconButton icon={X} label="Cerrar" onPress={onClose} ghost />
          </View>
          <Text variant="caption" color="muted">
            Versión {document.version}
          </Text>
          <ScrollView style={styles.body}>
            <Text>{document.text(childName)}</Text>
          </ScrollView>
        </View>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  content: { gap: space.s2 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.s2 },
  title: { flex: 1 },
  body: { maxHeight: MAX_TEXT_HEIGHT, marginTop: space.s2 },
});
