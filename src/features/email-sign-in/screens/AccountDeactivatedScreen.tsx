import { useRouter } from 'expo-router';
import { Phone } from 'lucide-react-native';
import { Linking } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { NURSERY_WHATSAPP_URL } from '@/constants/nursery';
import { LOGIN_ROUTE } from '@/constants/routes';
import { BlockedNotice } from '@/features/email-sign-in/components/BlockedNotice/BlockedNotice';
import { EMAIL_SIGN_IN_COPY } from '@/features/email-sign-in/email-sign-in-copy';

export function AccountDeactivatedScreen() {
  const router = useRouter();
  return (
    <Screen>
      <BlockedNotice title={EMAIL_SIGN_IN_COPY.deactivatedTitle}>
        <Button label={EMAIL_SIGN_IN_COPY.writeNursery} icon={Phone} variant="soft" block onPress={() => Linking.openURL(NURSERY_WHATSAPP_URL)} />
        <Button label={EMAIL_SIGN_IN_COPY.otherAccount} variant="plain" block onPress={() => router.dismissTo(LOGIN_ROUTE)} />
      </BlockedNotice>
    </Screen>
  );
}
