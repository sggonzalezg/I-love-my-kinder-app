import { useRouter } from 'expo-router';
import { Phone } from 'lucide-react-native';
import { Linking } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { nurseryWhatsAppUrlWithMessage } from '@/constants/nursery';
import { BlockedNotice } from '@/features/email-sign-in/components/BlockedNotice/BlockedNotice';
import { EMAIL_SIGN_IN_COPY } from '@/features/email-sign-in/email-sign-in-copy';

interface AccountNotEnabledScreenProps {
  email: string;
}

export function AccountNotEnabledScreen({ email }: AccountNotEnabledScreenProps) {
  const router = useRouter();
  return (
    <Screen>
      <BlockedNotice withPhoto email={email} title={EMAIL_SIGN_IN_COPY.notEnabledTitle} body={EMAIL_SIGN_IN_COPY.notEnabledBody}>
        <Button
          label={EMAIL_SIGN_IN_COPY.askToRegister}
          icon={Phone}
          variant="soft"
          block
          onPress={() => Linking.openURL(nurseryWhatsAppUrlWithMessage(EMAIL_SIGN_IN_COPY.registerMessage(email)))}
        />
        <Button label={EMAIL_SIGN_IN_COPY.otherAccount} variant="plain" block onPress={() => router.back()} />
      </BlockedNotice>
    </Screen>
  );
}
