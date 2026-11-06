import { Linking, View } from 'react-native';
import { useRouter } from 'expo-router';
import { NURSERY_WHATSAPP_URL } from '@/constants/nursery';
import { space, screenMargin } from '@/theme/tokens';
import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { Screen } from '@/components/screen';

interface ContactNurseryNoticeProps {
  title: string;
  message: string;
}

export function ContactNurseryNotice({ title, message }: ContactNurseryNoticeProps) {
  const router = useRouter();

  return (
    <Screen>
      <View style={{ flex: 1, padding: screenMargin, justifyContent: 'center' }}>
        <Text variant="title" style={{ marginBottom: space.s4, textAlign: 'center' }}>
          {title}
        </Text>

        <Text variant="body" color="muted" style={{ marginBottom: space.s6, textAlign: 'center' }}>
          {message}
        </Text>

        <Button
          title="Escribirle al jardín"
          onPress={() => Linking.openURL(NURSERY_WHATSAPP_URL)}
          style={{ marginBottom: space.s2 }}
        />
        <Button
          title="Probar con otro número"
          variant="secondary"
          onPress={() => router.replace('/(auth)/phone' as any)}
        />
      </View>
    </Screen>
  );
}
