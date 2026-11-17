import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { AccountChip } from '@/components/AccountChip/AccountChip';
import { AlertLine } from '@/components/AlertLine/AlertLine';
import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { legalDocumentHref } from '@/constants/routes';
import { ConsentBox } from '@/features/login-consent/components/ConsentBox/ConsentBox';
import { LOGIN_CONSENT_COPY, missingConsentMessage, updatedDocumentNotice } from '@/features/login-consent/login-consent-copy';
import { LOGIN_CONSENT_STATUS, uncheckedDocuments } from '@/features/login-consent/login-consent-reducer';
import { useLoginConsent } from '@/features/login-consent/use-login-consent';
import { LEGAL_DOCUMENTS } from '@/legal/documents.generated';
import { CONSENT } from '@/legal/texts';
import { legalDocumentDate, LOGIN_DOCUMENTS, type LoginDocumentKey, type PendingLoginDocument } from '@/lib/consent';

import { SKELETON_BOX_HEIGHT, styles } from './LoginConsentScreen.styles';

const BOX_TEXTS: Record<LoginDocumentKey, { before: string; link: string; after: string }> = {
  terms: { before: CONSENT.termsBefore, link: CONSENT.termsLink, after: CONSENT.termsAfter },
  privacy: { before: CONSENT.privacyBefore, link: CONSENT.privacyLink, after: CONSENT.privacyAfter },
};

const SKELETON_KEYS = Object.keys(LOGIN_DOCUMENTS);

function updatedNotices(pending: PendingLoginDocument[]) {
  return pending.flatMap((document) => {
    const date = document.updated ? legalDocumentDate(LEGAL_DOCUMENTS[document.key].body) : null;
    return date ? [{ key: document.key, text: updatedDocumentNotice(document.key, date) }] : [];
  });
}

export function LoginConsentScreen() {
  const router = useRouter();
  const { state, email, load, continueToApp, toggleBox, signOutAndLeave } = useLoginConsent();
  const asksNewDocument = state.pending.some((document) => !document.updated);
  const missingMessage = missingConsentMessage(state.missing, state.pending.length);

  return (
    <Screen>
      <Text variant="display" accessibilityRole="header" style={styles.title}>
        {LOGIN_CONSENT_COPY.title}
      </Text>
      {email ? (
        <View style={styles.account}>
          <AccountChip email={email} />
        </View>
      ) : null}

      {state.status === LOGIN_CONSENT_STATUS.LOADING && (
        <View style={styles.loading}>
          {SKELETON_KEYS.map((key) => (
            <Skeleton key={key} height={SKELETON_BOX_HEIGHT} />
          ))}
        </View>
      )}

      {state.status === LOGIN_CONSENT_STATUS.LOAD_FAILED && (
        <View style={styles.error}>
          <Text tone="red">{LOGIN_CONSENT_COPY.loadFailed}</Text>
          <Button label={LOGIN_CONSENT_COPY.retry} variant="soft" onPress={load} />
        </View>
      )}

      {state.status === LOGIN_CONSENT_STATUS.READY && (
        <>
          <View style={styles.notices}>
            {asksNewDocument && <Text>{LOGIN_CONSENT_COPY.intro}</Text>}
            {updatedNotices(state.pending).map((notice) => (
              <Banner key={notice.key} kind="info" text={notice.text} />
            ))}
          </View>
          <View style={styles.boxes}>
            {state.pending.map(({ key }) => (
              <ConsentBox
                key={key}
                checked={state.checked.includes(key)}
                missing={state.missing.includes(key)}
                disabled={state.saving}
                textBefore={BOX_TEXTS[key].before}
                linkText={BOX_TEXTS[key].link}
                textAfter={BOX_TEXTS[key].after}
                onToggle={() => toggleBox(key)}
                onOpenDocument={() => router.push(legalDocumentHref(key))}
              />
            ))}
          </View>
          <Button
            label={state.saving ? LOGIN_CONSENT_COPY.saving : LOGIN_CONSENT_COPY.continue}
            block
            inactive={uncheckedDocuments(state).length > 0}
            loading={state.saving}
            onPress={continueToApp}
            style={styles.continue}
          />
          {missingMessage && <AlertLine text={missingMessage} />}
          {state.saveFailed && <AlertLine text={LOGIN_CONSENT_COPY.saveFailed} />}
        </>
      )}

      <Button label={LOGIN_CONSENT_COPY.notMe} variant="plain" block disabled={state.saving} onPress={signOutAndLeave} style={styles.notMe} />
    </Screen>
  );
}
