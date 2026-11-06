import { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/data/session';
import { recordConsent } from '@/data/consent';
import { useColors } from '@/theme/use-theme';
import { space, screenMargin } from '@/theme/tokens';
import { CONSENT } from '@/legal/texts';
import { getDocumentsToAccept, LOGIN_DOCUMENTS } from '@/lib/consent';
import Button from '@/components/button';
import ConsentCheckbox from '@/components/consent-checkbox';
import Text from '@/components/text';
import Banner from '@/components/banner';
import Screen from '@/components/screen';

export default function ConsentScreen() {
  const router = useRouter();
  const { session } = useSession();
  const c = useColors();

  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  const canContinue = termsChecked && privacyChecked;

  async function handleContinue() {
    if (!canContinue || !session) return;
    setLoading(true);
    setError(null);

    try {
      for (const document of [LOGIN_DOCUMENTS.terms, LOGIN_DOCUMENTS.privacy]) {
        await recordConsent({ documentId: document.id, version: document.version, accepted: true, screen: 'S0c' });
      }

      router.replace('/(auth)/push' as any);
    } catch (err: any) {
      if (err.message?.includes('offline') || err.message?.includes('network')) {
        setOffline(true);
      } else {
        setError(err.message || 'No pudimos guardar tu consentimiento. Probá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: screenMargin, paddingBottom: space.s6 }}>
        {offline && <Banner message="No tenés conexión" variant="offline" />}

        <Text variant="title" style={{ marginBottom: space.s5, textAlign: 'center' }}>
          Antes de seguir
        </Text>

        <View style={{ gap: space.s4, marginBottom: space.s6 }}>
          <ConsentCheckbox
            checked={termsChecked}
            onPress={() => setTermsChecked(!termsChecked)}
            disabled={loading}
            label={
              <View>
                <Text variant="body">
                  {CONSENT.termsBefore}
                  <Text
                    variant="body"
                    color="blue"
                    style={{ textDecorationLine: 'underline' }}
                    onPress={() => router.push('/(app)/legal/terms' as any)}
                  >
                    {CONSENT.termsLink}
                  </Text>
                  {CONSENT.termsAfter}
                </Text>
              </View>
            }
          />

          <ConsentCheckbox
            checked={privacyChecked}
            onPress={() => setPrivacyChecked(!privacyChecked)}
            disabled={loading}
            label={
              <View>
                <Text variant="body">
                  {CONSENT.privacyBefore}
                  <Text
                    variant="body"
                    color="blue"
                    style={{ textDecorationLine: 'underline' }}
                    onPress={() => router.push('/(app)/legal/privacy' as any)}
                  >
                    {CONSENT.privacyLink}
                  </Text>
                  {CONSENT.privacyAfter}
                </Text>
              </View>
            }
          />
        </View>

        <Button
          title="Continuar"
          onPress={handleContinue}
          disabled={!canContinue || loading}
          loading={loading}
          style={{ marginBottom: space.s3 }}
        />

        {error && (
          <Text variant="small" color="red" style={{ textAlign: 'center' }}>
            {error}
          </Text>
        )}
      </ScrollView>
    </Screen>
  );
}
