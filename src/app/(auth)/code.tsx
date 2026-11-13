import { useEffect, useState } from 'react';
import { View, useColorScheme } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSession, verifyPhoneCode } from '@/data/session';
import { supabase } from '@/data/supabase';
import { toE164 } from '@/lib/phone';
import { getDocumentsToAccept } from '@/lib/consent';
import { useColors } from '@/theme/use-theme';
import { space, screenMargin } from '@/theme/tokens';
import Button from '@/components/button';
import OtpInput from '@/components/otp-input';
import Text from '@/components/text';
import Banner from '@/components/banner';
import Screen from '@/components/screen';

export default function CodeLoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { startSession } = useSession();
  const c = useColors();

  const phone = params.phone as string;
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [codeError, setCodeError] = useState(false);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  async function handleVerify() {
    if (code.length !== 6) return;
    setLoading(true);
    setError(null);
    setCodeError(false);

    try {
      const session = await verifyPhoneCode(toE164(phone), code);
      startSession(session);

      // Check which login documents need acceptance.
      const { data: records } = await supabase
        .from('consent_records')
        .select('document_id, version, accepted')
        .eq('user_id', session.user_id)
        .in('document_id', ['terms', 'privacy']);

      const docsToAccept = getDocumentsToAccept(records || []);

      if (docsToAccept.length > 0) {
        router.replace('/(auth)/consent' as any);
      } else {
        router.replace('/(auth)/push' as any);
      }
    } catch (err: any) {
      if (err.code === 'invalid_code') {
        setCodeError(true);
        setError('El código no es correcto');
      } else if (err.code === 'expired_code') {
        setError('El código expiró. Reenvíalo.');
        setResendCountdown(30);
      } else {
        setError(err.message || 'No pudimos verificar tu código. Probá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    // Resend code logic would go here
    setResendCountdown(30);
  }

  return (
    <Screen>
      <View style={{ flex: 1, padding: screenMargin }}>
        <Text variant="title" style={{ marginBottom: space.s2, textAlign: 'center' }}>
          Escribí el código
        </Text>

        <Text variant="body" color="muted" style={{ marginBottom: space.s5, textAlign: 'center' }}>
          Lo mandamos al {phone} · {' '}
          <Text variant="body" color="blue" onPress={() => router.replace('/(auth)/phone' as any)}>
            Cambiar
          </Text>
        </Text>

        <View style={{ marginBottom: space.s6 }}>
          <OtpInput value={code} onChangeText={setCode} error={codeError} editable={!loading} />
        </View>

        <Button
          title="Verificar"
          onPress={handleVerify}
          disabled={code.length !== 6 || loading}
          loading={loading}
          style={{ marginBottom: space.s4 }}
        />

        <View style={{ alignItems: 'center' }}>
          {resendCountdown > 0 ? (
            <Text variant="small" color="muted">
              Reenviar en 0:{resendCountdown.toString().padStart(2, '0')}
            </Text>
          ) : (
            <Text
              variant="small"
              color="blue"
              onPress={handleResend}
              style={{ textDecorationLine: 'underline' }}
            >
              Reenviar código
            </Text>
          )}
        </View>

        {error && (
          <Text variant="small" color="red" style={{ marginTop: space.s3, textAlign: 'center' }}>
            {error}
          </Text>
        )}
      </View>
    </Screen>
  );
}
