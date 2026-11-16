import { View } from 'react-native';

import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { KidPhoto } from '@/features/family-today/components/KidPhoto/KidPhoto';
import { FAMILY_TODAY_COPY } from '@/features/family-today/family-today-copy';
import type { AuthorizationReminder } from '@/lib/authorization-reminders';
import { missingAuthorizationsLine } from '@/lib/child-authorization-status';
import { initials } from '@/lib/format';
import { size } from '@/theme/tokens';

import { useAuthorizationReminderCardStyles } from './AuthorizationReminderCard.styles';

interface AuthorizationReminderCardProps {
  reminder: AuthorizationReminder;
  /** A card on its way out has nothing left to answer, so it loses its button. */
  leaving: boolean;
  onAnswer: (reminder: AuthorizationReminder) => void;
}

export function AuthorizationReminderCard({ reminder, leaving, onAnswer }: AuthorizationReminderCardProps) {
  const styles = useAuthorizationReminderCardStyles();
  const title = FAMILY_TODAY_COPY.reminderTitle(reminder.firstName);

  return (
    <View style={styles.card}>
      <KidPhoto photoPath={reminder.photoPath} firstName={reminder.firstName} initials={initials(reminder.firstName, reminder.lastName)} small />
      <View style={styles.text}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <Text variant="small">{missingAuthorizationsLine(reminder.missingKeys)}</Text>
        {leaving ? null : (
          <View style={styles.action}>
            <Button
              label={FAMILY_TODAY_COPY.reminderAnswer}
              variant="soft"
              height={size.touch}
              accessibilityHint={title}
              onPress={() => onAnswer(reminder)}
            />
          </View>
        )}
      </View>
    </View>
  );
}
