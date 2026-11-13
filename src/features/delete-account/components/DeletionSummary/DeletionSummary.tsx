import { ScrollView } from 'react-native';

import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { DELETE_ACCOUNT_COPY } from '@/features/delete-account/delete-account-copy';
import { familyAccessLine } from '@/lib/account-deletion';

import { styles } from './DeletionSummary.styles';

export interface DeletionSummaryProps {
  isFamily: boolean;
  childNames: string[];
  checking: boolean;
  error: string | null;
  onContinue: () => void;
  onCancel: () => void;
}

export function DeletionSummary({ isFamily, childNames, checking, error, onContinue, onCancel }: DeletionSummaryProps) {
  const deletedNow = isFamily ? DELETE_ACCOUNT_COPY.familyDeletedNow(familyAccessLine(childNames)) : DELETE_ACCOUNT_COPY.staffDeletedNow;
  const stays = isFamily ? DELETE_ACCOUNT_COPY.familyStays : DELETE_ACCOUNT_COPY.staffStays;
  const legalProof = isFamily ? DELETE_ACCOUNT_COPY.familyLegalProof : DELETE_ACCOUNT_COPY.staffLegalProof;

  return (
    <ScrollView bounces={false}>
      <Text variant="title" accessibilityRole="header" style={styles.title}>
        {DELETE_ACCOUNT_COPY.summaryTitle}
      </Text>
      <Text>
        <Text variant="bodyStrong">{DELETE_ACCOUNT_COPY.deletedNowLabel}</Text>
        {deletedNow}
      </Text>
      <Text style={styles.paragraph}>
        <Text variant="bodyStrong">{DELETE_ACCOUNT_COPY.staysLabel}</Text>
        {stays}
      </Text>
      <Text style={styles.paragraph}>
        <Text variant="bodyStrong">{DELETE_ACCOUNT_COPY.legalProofLabel}</Text>
        {legalProof}
      </Text>
      {isFamily && (
        <Text variant="small" tone="muted" style={styles.paragraph}>
          {DELETE_ACCOUNT_COPY.familyFootnote}
        </Text>
      )}
      {error && (
        <Text variant="small" tone="red" accessibilityRole="alert" style={styles.paragraph}>
          {error}
        </Text>
      )}
      <Button
        label={error ? DELETE_ACCOUNT_COPY.retry : DELETE_ACCOUNT_COPY.continue}
        variant="danger"
        block
        loading={checking}
        onPress={onContinue}
        style={styles.firstAction}
      />
      <Button label={DELETE_ACCOUNT_COPY.cancel} variant="plain" block onPress={onCancel} style={styles.nextAction} />
    </ScrollView>
  );
}
