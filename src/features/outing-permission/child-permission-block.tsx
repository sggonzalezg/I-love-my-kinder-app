import { Phone } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { Text } from '@/components/text';
import { PERMISSION_CHIP_VARIANT } from '@/constants/outing';
import type { GuardianChild, OutingDetails } from '@/data/outing-permission';
import { OUTING } from '@/legal/texts';
import { formatTime } from '@/lib/dates';
import { relationshipWord } from '@/lib/format';
import {
  firstName,
  formatAnswerDay,
  formatOutingDay,
  formatOutingShortDay,
  transportClause,
  type ChildPermission,
  type HistoryEntry,
} from '@/lib/outing-permission';
import { useChildPermissionBlockStyles } from './child-permission-block.styles';
import { PermissionAnswers } from './permission-answers';
import { PermissionHistory } from './permission-history';
import { PermissionRecordCard } from './permission-record-card';
import type { AnswerIntent, SaveFailureReason } from './outing-permission-reducer';
import { PERMISSION_COPY } from './outing-permission-copy';

interface ChildPermissionBlockProps {
  child: GuardianChild;
  outing: OutingDetails;
  permission: ChildPermission;
  history: HistoryEntry[];
  signerName: string;
  saving: boolean;
  failure: SaveFailureReason | null;
  justSigned: boolean;
  showChip: boolean;
  showAnswers: boolean;
  onAnswer: (intent: AnswerIntent) => void;
  onCallNursery: () => void;
}

export function ChildPermissionBlock({
  child,
  outing,
  permission,
  history,
  signerName,
  saving,
  failure,
  justSigned,
  showChip,
  showAnswers,
  onAnswer,
  onCallNursery,
}: ChildPermissionBlockProps) {
  const styles = useChildPermissionBlockStyles();
  const { status, answer, answeredBy, locked } = permission;
  const out = formatTime(new Date(outing.startsAt));
  const back = formatTime(new Date(outing.endsAt));
  const shortDay = formatOutingShortDay(outing.startsAt);
  const hasAnswered = answer !== null;

  return (
    <View style={styles.block}>
      <Text variant="section" accessibilityRole="header">
        {PERMISSION_COPY.forChild(child.firstName)}
      </Text>
      {showChip ? <Chip label={PERMISSION_COPY.statusChip[status]} variant={PERMISSION_CHIP_VARIANT[status]} /> : null}

      {answer && status !== 'pending' ? (
        <PermissionRecordCard
          status={status}
          line={(status === 'authorized' ? OUTING.signed : OUTING.declined)(answer.signer_name, formatAnswerDay(answer.created_at), formatTime(new Date(answer.created_at)))}
          justSigned={justSigned}
        />
      ) : null}

      {!hasAnswered && !locked ? (
        <>
          <AuthorizationSentence child={child} outing={outing} signerName={signerName} />
          <Text color="muted">{PERMISSION_COPY.staysIfDeclined(child.firstName)}</Text>
          <Text color="muted">{PERMISSION_COPY.changeUntil(shortDay, out)}</Text>
        </>
      ) : null}

      {hasAnswered && answeredBy === 'other' ? <Text>{PERMISSION_COPY.resolvedForChild(child.firstName)}</Text> : null}
      {status === 'declined' ? <Text>{PERMISSION_COPY.staysWhileOuting(shortDay, out, back, child.firstName)}</Text> : null}

      {locked ? <NurseryCallCard title={PERMISSION_COPY.startedTitle} body={PERMISSION_COPY.startedBody} onCall={onCallNursery} /> : null}

      {history.length > 0 && hasAnswered ? <PermissionHistory entries={history} /> : null}

      {!locked && answeredBy === 'other' && answer ? (
        <NurseryCallCard body={PERMISSION_COPY.disagree(firstName(answer.signer_name))} onCall={onCallNursery} />
      ) : null}

      {!locked && answeredBy === 'me' && status === 'authorized' ? (
        <Button label={PERMISSION_COPY.withdraw} variant="danger-soft" block loading={saving} onPress={() => onAnswer('withdraw')} />
      ) : null}
      {!locked && answeredBy === 'me' && status === 'declined' ? (
        <Button label={PERMISSION_COPY.changeToAuthorize} variant="primary" block loading={saving} onPress={() => onAnswer('authorize')} />
      ) : null}

      {showAnswers && !hasAnswered && !locked ? <PermissionAnswers saving={saving} onAnswer={onAnswer} /> : null}

      {failure ? (
        <Text color="red" accessibilityRole="alert">
          {failure === 'offline' ? PERMISSION_COPY.offline : PERMISSION_COPY.saveError}
        </Text>
      ) : null}
    </View>
  );
}

interface AuthorizationSentenceProps {
  child: GuardianChild;
  outing: OutingDetails;
  signerName: string;
}

function AuthorizationSentence({ child, outing, signerName }: AuthorizationSentenceProps) {
  const styles = useChildPermissionBlockStyles();
  const sentence = OUTING.text({
    signer: signerName,
    relationship: relationshipWord(child.relationship),
    child: `${child.firstName} ${child.lastName}`,
    title: outing.title,
    date: formatOutingDay(outing.startsAt),
    out: formatTime(new Date(outing.startsAt)),
    back: formatTime(new Date(outing.endsAt)),
    place: outing.location ?? '',
    transportClause: transportClause(outing.transport ?? ''),
  });
  return (
    <View style={styles.sentencePlate}>
      <Text>{sentence}</Text>
    </View>
  );
}

interface NurseryCallCardProps {
  title?: string;
  body: string;
  onCall: () => void;
}

function NurseryCallCard({ title, body, onCall }: NurseryCallCardProps) {
  const styles = useChildPermissionBlockStyles();
  return (
    <View style={styles.callCard}>
      {title ? <Text variant="bodyStrong">{title}</Text> : null}
      <Text>{body}</Text>
      <Button label={PERMISSION_COPY.callNursery} variant="soft" icon={Phone} onPress={onCall} />
    </View>
  );
}
