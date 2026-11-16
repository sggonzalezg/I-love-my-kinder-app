import Animated, { useReducedMotion } from 'react-native-reanimated';

import { AuthorizationReminderCard } from '@/features/family-today/components/AuthorizationReminderCard/AuthorizationReminderCard';
import type { AuthorizationRemindersView } from '@/features/family-today/use-authorization-reminders';
import { layoutReflowTransition, listEntering, reminderCardExiting } from '@/theme/motion';

import { styles } from './AuthorizationReminderList.styles';

interface AuthorizationReminderListProps {
  reminders: AuthorizationRemindersView;
}

export function AuthorizationReminderList({ reminders }: AuthorizationReminderListProps) {
  const reduced = useReducedMotion();
  if (reminders.cards.length === 0) return null;

  // The list leaves with its last card, which cannot animate out once its parent is gone.
  return (
    <Animated.View exiting={reminderCardExiting(reduced)} layout={layoutReflowTransition} style={styles.list}>
      {reminders.cards.map((reminder, index) => (
        <Animated.View
          key={reminder.childId}
          entering={listEntering(index, reduced)}
          exiting={reminderCardExiting(reduced)}
          layout={layoutReflowTransition}>
          <AuthorizationReminderCard reminder={reminder} leaving={reminder.childId === reminders.leavingChildId} onAnswer={reminders.answer} />
        </Animated.View>
      ))}
    </Animated.View>
  );
}
