import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '@/data/session';
import { Button } from '@/components/button';
import OtpInput from '@/components/otp-input';
import { Text } from '@/components/text';
import { space, radius, screenMargin } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

type Step = 'confirm' | 'code' | 'deleting' | 'deleted';

export default function DeleteAccountScreen() {
  const { session } = useSession();
  const [step, setStep] = useState<Step>('confirm');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const c = useColors();
  const insets = useSafeAreaInsets();

  if (!session) return null;

  function handleCancel() {
    router.back();
  }

  function handleConfirm() {
    // TODO: validate if director or single teacher
    // TODO: call delete-account edge function step 1
    setStep('code');
  }

  function handleCodeSubmit() {
    // TODO: verify code with delete-account edge function step 2
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }
    setStep('deleting');
    // Simulate deletion
    setTimeout(() => setStep('deleted'), 2000);
  }

  if (step === 'confirm') {
    return (
      <View style={[styles.root, { backgroundColor: c.ground }]}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Button icon={ArrowLeft} onPress={handleCancel} title=" " variant="plain" />
          <Text variant="title" style={{ color: c.ink, flex: 1 }}>
            Eliminar mi cuenta
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.card, { backgroundColor: c.red50 }]}>
            <Text style={{ color: c.red }}>
              Esta acción no se puede deshacer.
            </Text>
            <Text variant="small" style={{ color: c.red }}>
              Se elimina tu cuenta, tus datos y tus accesos a las salas. Los mensajes que escribiste en el chat se conservan con tu nombre.
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: c.surface }]}>
            <Text style={{ color: c.ink }}>
              Los datos se conservarán como prueba legal según la ley 18.331.
            </Text>
          </View>

          <Button
            label="Sí, quiero eliminar mi cuenta"
            variant="danger"
            block
            onPress={handleConfirm}
          />
          <Button
            label="Cancelar"
            variant="ghost"
            block
            onPress={handleCancel}
          />
        </ScrollView>
      </View>
    );
  }

  if (step === 'code') {
    return (
      <View style={[styles.root, { backgroundColor: c.ground }]}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Button icon={ArrowLeft} onPress={handleCancel} title=" " variant="plain" />
          <Text variant="title" style={{ color: c.ink, flex: 1 }}>
            Confirmar con SMS
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={{ color: c.muted }}>
            Te mandamos un código por SMS al {session.phone}
          </Text>

          <View style={styles.otpContainer}>
            <OtpInput
              value={code}
              onChangeText={setCode}
            />
          </View>

          {error && (
            <Text style={{ color: c.red }}>
              {error}
            </Text>
          )}

          <Button
            label="Confirmar eliminación"
            variant="danger"
            block
            disabled={code.length < 6}
            onPress={handleCodeSubmit}
          />
          <Button
            label="Cancelar"
            variant="ghost"
            block
            onPress={handleCancel}
          />
        </ScrollView>
      </View>
    );
  }

  if (step === 'deleting') {
    return (
      <View style={[styles.root, { backgroundColor: c.ground, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: c.ink }}>
          Eliminando tu cuenta…
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: c.ground }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text variant="title" style={{ color: c.ink }}>
          Cuenta eliminada
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: c.surface }]}>
          <Text style={{ color: c.ink }}>
            Tu cuenta ha sido eliminada exitosamente.
          </Text>
          <Text variant="small" style={{ color: c.muted }}>
            Serás desconectado en 3 segundos…
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: screenMargin,
    paddingBottom: space.s4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s3,
  },
  content: {
    paddingHorizontal: screenMargin,
    paddingBottom: space.s6,
    gap: space.s3,
  },
  card: {
    borderRadius: radius.lg,
    padding: space.s4,
    gap: space.s2,
  },
  otpContainer: {
    alignItems: 'center',
    paddingVertical: space.s4,
  },
});
