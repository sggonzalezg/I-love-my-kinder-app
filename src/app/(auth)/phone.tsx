import { useState } from 'react';
import { View, useWindowDimensions, Image, ActivityIndicator, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { phoneError, toE164, formatUyPhone } from '@/lib/phone';
import { signInWithPhone, lookupPhone } from '@/data/session';
import { useColors } from '@/theme/use-theme';
import { space, type as typeScale, screenMargin } from '@/theme/tokens';
import Button from '@/components/button';
import Input from '@/components/input';
import Text from '@/components/text';
import Banner from '@/components/banner';
import Screen from '@/components/screen';

export default function PhoneLoginScreen() {
  const router = useRouter();
  const c = useColors();
  const { width } = useWindowDimensions();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);

  const validation = phoneError(phone);
  const isValid = !validation && phone.length > 0;

  async function handleSend() {
    if (!isValid) return;
    setLoading(true);
    setError(null);

    try {
      // Check if phone is registered
      const lookup = await lookupPhone(toE164(phone));
      if (lookup.inactive) {
        router.replace('/(auth)/inactive' as any);
        return;
      }

      // Send OTP
      await signInWithPhone(toE164(phone));
      router.push({ pathname: '/(auth)/code' as any, params: { phone: formatUyPhone(phone) } });
    } catch (err: any) {
      if (err.code === 'unknown_number') {
        router.replace('/(auth)/unknown' as any);
      } else if (err.code === 'network') {
        setOffline(true);
      } else {
        setError(err.message || 'No pudimos enviar el código. Probá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={{ flex: 1, padding: screenMargin }}>
        {offline && <Banner message="No tenés conexión" variant="offline" />}

        <View style={{ alignItems: 'center', marginTop: space.s5, marginBottom: space.s10 }}>
          <Image
            source={require('@/../../assets/images/logo-client.jpg')}
            style={{ width: 160, height: 160 * (1003 / 1084), borderRadius: 8, resizeMode: 'contain' }}
          />
        </View>

        <Text variant="title" style={{ marginBottom: space.s3, textAlign: 'center' }}>
          Entrá con tu celular
        </Text>

        <View style={{ flexDirection: 'row', gap: space.s2, marginBottom: space.s4 }}>
          <View style={{ justifyContent: 'center' }}>
            <Text variant="bodyStrong" color="muted">
              +598
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Input
              value={phone}
              onChangeText={setPhone}
              placeholder="9X XXX XXX"
              keyboardType="phone-pad"
              error={validation}
              editable={!loading}
              autoComplete="tel-local"
            />
          </View>
        </View>

        <Button
          title="Enviar código"
          onPress={handleSend}
          disabled={!isValid || loading}
          loading={loading}
          style={{ marginBottom: space.s3 }}
        />

        <Text variant="small" color="muted" style={{ textAlign: 'center' }}>
          Te mandamos un código por WhatsApp
        </Text>

        {error && (
          <Text variant="small" color="red" style={{ marginTop: space.s3, textAlign: 'center' }}>
            {error}
          </Text>
        )}
      </View>
    </Screen>
  );
}
