import { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useSession } from '@/data/session';
import { useColors } from '@/theme/use-theme';
import { space, screenMargin } from '@/theme/tokens';
import Button from '@/components/button';
import Text from '@/components/text';
import Screen from '@/components/screen';

export default function PushPrimerScreen() {
  const router = useRouter();
  const { session } = useSession();
  const c = useColors();
  const [loading, setLoading] = useState(false);

  async function handleActivate() {
    setLoading(true);
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        // Get push token and register it
        const token = await Notifications.getExpoPushTokenAsync();
        // TODO: save token to backend
      }
    } finally {
      setLoading(false);
      router.replace('/(app)' as any);
    }
  }

  function handleLater() {
    router.replace('/(app)' as any);
  }

  return (
    <Screen>
      <View style={{ flex: 1, padding: screenMargin }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: '100%',
              aspectRatio: 1,
              borderRadius: 16,
              overflow: 'hidden',
              marginBottom: space.s6,
              position: 'relative',
            }}
          >
            <Image
              source={require('@/assets/images/nap-hessam-nabavi.jpg')}
              style={{ width: '100%', height: '100%' }}
            />

            {/* Lock screen preview overlay */}
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 120,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: space.s3,
                justifyContent: 'flex-end',
              }}
            >
              <View
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 12,
                  padding: space.s2,
                  marginBottom: space.s2,
                }}
              >
                <Text variant="small" color="white">
                  I Love My Kinder
                </Text>
                <Text variant="body" color="white" style={{ marginTop: space.s1 }}>
                  Tenés una notificación
                </Text>
              </View>
            </View>
          </View>

          <Text variant="title" style={{ marginBottom: space.s3, textAlign: 'center' }}>
            Activá los avisos para saber cómo está tu hijo
          </Text>
        </View>

        <Button title="Activar avisos" onPress={handleActivate} loading={loading} style={{ marginBottom: space.s2 }} />
        <Button
          title="Ahora no"
          variant="secondary"
          onPress={handleLater}
          disabled={loading}
          style={{ marginBottom: space.s3 }}
        />
      </View>
    </Screen>
  );
}
