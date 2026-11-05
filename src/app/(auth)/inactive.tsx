import { View, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/theme/use-theme';
import { space, screenMargin } from '@/theme/tokens';
import Button from '@/components/button';
import Text from '@/components/text';
import Screen from '@/components/screen';

const NURSERY_PHONE = '598992545120'; // WhatsApp number without + for linking

export default function InactiveTeacherScreen() {
  const router = useRouter();
  const c = useColors();

  function handleContact() {
    Linking.openURL(`https://wa.me/${NURSERY_PHONE}`);
  }

  function handleTryAgain() {
    router.replace('/(auth)/phone' as any);
  }

  return (
    <Screen>
      <View style={{ flex: 1, padding: screenMargin, justifyContent: 'center' }}>
        <Text variant="title" style={{ marginBottom: space.s4, textAlign: 'center' }}>
          Tu cuenta está inactiva
        </Text>

        <Text variant="body" color="muted" style={{ marginBottom: space.s6, textAlign: 'center' }}>
          No tienes acceso en este momento. Hablá con la dirección del jardín para activar tu cuenta.
        </Text>

        <Button title="Escribirle al jardín" onPress={handleContact} style={{ marginBottom: space.s2 }} />
        <Button title="Probar con otro número" variant="secondary" onPress={handleTryAgain} />
      </View>
    </Screen>
  );
}
