import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Sheet } from '@/components/sheet';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { Toast, TOAST_VISIBLE_MS } from '@/components/toast';
import { TopBar } from '@/components/top-bar';
import { recordConsent } from '@/data/consent';
import { fetchChildAuthorizationRecords } from '@/data/family-room';
import { useAsync } from '@/data/use-async';
import { CHILD_AUTHORIZATIONS, withdrawConfirm } from '@/legal/texts';
import {
  AUTHORIZATION_KEYS,
  currentAuthorizations,
  type AuthorizationKey,
  type AuthorizationState,
} from '@/lib/authorizations';
import { space } from '@/theme/tokens';
import { AuthorizationRow } from './authorization-row';
import { AuthorizationTextSheet } from './authorization-text-sheet';
import { AUTHORIZATION_SAVE_ERROR, AUTHORIZATION_SAVED, authorizationsFootnote, authorizationsIntro } from './authorization-copy';

const SCREEN_ID = 'F3';

interface AuthorizationsScreenProps {
  childId: string;
  childName: string;
}

export function AuthorizationsScreen({ childId, childName }: AuthorizationsScreenProps) {
  const records = useAsync(() => fetchChildAuthorizationRecords(childId), childId);
  const [overrides, setOverrides] = useState<Partial<Record<AuthorizationKey, AuthorizationState>>>({});
  const [savingKey, setSavingKey] = useState<AuthorizationKey | null>(null);
  const [failedKey, setFailedKey] = useState<AuthorizationKey | null>(null);
  const [confirmKey, setConfirmKey] = useState<AuthorizationKey | null>(null);
  const [textKey, setTextKey] = useState<AuthorizationKey | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!showSaved) return;
    const timer = setTimeout(() => setShowSaved(false), TOAST_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [showSaved]);

  const stored = records.data ? currentAuthorizations(records.data) : null;
  const stateOf = (key: AuthorizationKey) => overrides[key] ?? stored?.[CHILD_AUTHORIZATIONS[key].id];

  async function save(key: AuthorizationKey, granted: boolean) {
    const document = CHILD_AUTHORIZATIONS[key];
    setSavingKey(key);
    setFailedKey(null);
    try {
      await recordConsent({ documentId: document.id, version: document.version, accepted: granted, screen: SCREEN_ID, childId });
      setOverrides((current) => ({ ...current, [key]: { granted, changedAt: new Date().toISOString() } }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowSaved(true);
    } catch (error) {
      console.warn('record-consent failed:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setFailedKey(key);
    } finally {
      setSavingKey(null);
    }
  }

  function handleChange(key: AuthorizationKey, granted: boolean) {
    if (granted) save(key, true);
    else setConfirmKey(key);
  }

  function confirmWithdraw() {
    if (!confirmKey) return;
    const key = confirmKey;
    setConfirmKey(null);
    save(key, false);
  }

  return (
    <View style={styles.root}>
      <Screen header={<TopBar title={`Autorizaciones de ${childName}`} backLabel="Volver" onBack={() => router.back()} />}>
        <Text>{authorizationsIntro(childName)}</Text>
        {records.failed && (
          <View style={styles.error}>
            <Text color="red">No pudimos cargar las autorizaciones. Probá de nuevo.</Text>
            <Button label="Reintentar" variant="soft" onPress={records.reload} />
          </View>
        )}
        {records.loading && AUTHORIZATION_KEYS.map((key) => <Skeleton key={key} height={120} />)}
        {stored && (
          <View style={styles.list}>
            {AUTHORIZATION_KEYS.map((key) => (
              <AuthorizationRow
                key={key}
                authorizationKey={key}
                childName={childName}
                state={stateOf(key)!}
                saving={savingKey === key}
                failed={failedKey === key}
                errorMessage={AUTHORIZATION_SAVE_ERROR}
                onChange={(granted) => handleChange(key, granted)}
                onOpenText={() => setTextKey(key)}
              />
            ))}
          </View>
        )}
        <Text variant="caption" color="muted">
          {authorizationsFootnote(childName)}
        </Text>
      </Screen>

      <Sheet visible={confirmKey !== null} onClose={() => setConfirmKey(null)}>
        {confirmKey && (
          <View style={styles.confirm}>
            <Text variant="title">{withdrawConfirm(CHILD_AUTHORIZATIONS[confirmKey].title, childName)}</Text>
            <Button label="Retirar" variant="danger" block onPress={confirmWithdraw} />
            <Button label="Cancelar" variant="plain" block onPress={() => setConfirmKey(null)} />
          </View>
        )}
      </Sheet>

      <AuthorizationTextSheet authorizationKey={textKey} childName={childName} onClose={() => setTextKey(null)} />

      {showSaved && <Toast message={AUTHORIZATION_SAVED} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: { gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start' },
  confirm: { gap: space.s3 },
});
