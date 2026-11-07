import { View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import type { GuardianChild, OutingDetails } from '@/data/outing-permission';
import { OUTING } from '@/legal/texts';
import { formatTime } from '@/lib/dates';
import { initials, relationshipWord } from '@/lib/format';
import { formatOutingDay } from '@/lib/outing-permission';
import type { AnswerIntent } from './outing-permission-reducer';
import { PERMISSION_COPY } from './outing-permission-copy';
import { styles } from './permission-confirm-sheet.styles';

interface PermissionConfirmSheetProps {
  intent: AnswerIntent | null;
  child: GuardianChild | null;
  outing: OutingDetails;
  signerName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function PermissionConfirmSheet({ intent, child, outing, signerName, onConfirm, onClose }: PermissionConfirmSheetProps) {
  return (
    <Sheet visible={intent !== null && child !== null} onClose={onClose}>
      {intent && child ? (
        <View style={styles.body}>
          <Text variant="caption" color="muted">
            {PERMISSION_COPY.screenTitle}
          </Text>
          {intent === 'withdraw' ? (
            <WithdrawContent child={child} outing={outing} onConfirm={onConfirm} onClose={onClose} />
          ) : (
            <AnswerContent intent={intent} child={child} outing={outing} signerName={signerName} onConfirm={onConfirm} onClose={onClose} />
          )}
        </View>
      ) : null}
    </Sheet>
  );
}

interface ContentProps {
  child: GuardianChild;
  outing: OutingDetails;
  onConfirm: () => void;
  onClose: () => void;
}

function AnswerContent({ intent, child, outing, signerName, onConfirm, onClose }: ContentProps & { intent: AnswerIntent; signerName: string }) {
  const day = formatOutingDay(outing.startsAt);
  const authorizing = intent === 'authorize';
  const relationship = relationshipWord(child.relationship);
  const question = authorizing
    ? OUTING.confirmYes(child.firstName, outing.title, day)
    : OUTING.confirmNo(child.firstName, outing.title, day);
  const signsAs = authorizing
    ? PERMISSION_COPY.signsAs(signerName, relationship, child.firstName)
    : PERMISSION_COPY.answersAs(signerName, relationship, child.firstName);
  const [givenName = '', familyName = ''] = signerName.split(' ');

  return (
    <>
      <Text variant="title">{question}</Text>
      {authorizing && outing.location && outing.transport ? (
        <Text color="muted">
          {PERMISSION_COPY.confirmSummary(
            outing.location,
            day,
            formatTime(new Date(outing.startsAt)),
            formatTime(new Date(outing.endsAt)),
            outing.transport.toLowerCase(),
          )}
        </Text>
      ) : null}
      <View style={styles.signer}>
        <Avatar photoPath={null} initials={initials(givenName, familyName)} />
        <Text style={styles.signerText}>
          {signsAs} {PERMISSION_COPY.whatWeKeep}
        </Text>
      </View>
      <Button label={authorizing ? PERMISSION_COPY.confirmYes : PERMISSION_COPY.confirmNo} variant={authorizing ? 'primary' : 'danger'} block onPress={onConfirm} />
      <Button label={PERMISSION_COPY.cancelConfirm} variant="plain" block onPress={onClose} />
    </>
  );
}

function WithdrawContent({ child, outing, onConfirm, onClose }: ContentProps) {
  return (
    <>
      <Text variant="title">{PERMISSION_COPY.withdrawTitle}</Text>
      <Text color="muted">{PERMISSION_COPY.withdrawBody(child.firstName, outing.location ?? outing.title)}</Text>
      <Button label={PERMISSION_COPY.withdraw} variant="danger" block onPress={onConfirm} />
      <Button label={PERMISSION_COPY.withdrawCancel} variant="plain" block onPress={onClose} />
    </>
  );
}
