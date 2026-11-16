import { Text } from '@/components/text';
import { EMAIL_SIGN_IN_COPY, NURSERY_EMAIL_SENDER } from '@/features/email-sign-in/email-sign-in-copy';

import { styles, useSpamTipStyles } from './SpamTip.styles';

export function SpamTip() {
  const themed = useSpamTipStyles();
  return (
    <Text variant="small" tone="muted" style={[styles.tip, themed.tip]}>
      {EMAIL_SIGN_IN_COPY.spamTipStart}
      <Text variant="smallStrong">{EMAIL_SIGN_IN_COPY.spamFolder}</Text>
      {EMAIL_SIGN_IN_COPY.spamOr}
      <Text variant="smallStrong">{EMAIL_SIGN_IN_COPY.promotionsFolder}</Text>
      {EMAIL_SIGN_IN_COPY.spamFrom}
      <Text variant="smallStrong">{NURSERY_EMAIL_SENDER}</Text>.
    </Text>
  );
}
