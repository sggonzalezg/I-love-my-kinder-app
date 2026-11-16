import { router } from 'expo-router';
import { useEffect, useMemo, useReducer } from 'react';

import { TOAST_VISIBLE_MS } from '@/components/toast';
import { childAuthorizationsHref } from '@/constants/routes';
import type { FamilyToday } from '@/data/family-today';
import {
  AUTHORIZATION_REMINDERS_ACTIONS,
  authorizationRemindersReducer,
  initialAuthorizationRemindersState,
} from '@/features/family-today/authorization-reminders-reducer';
import { authorizationReminders, type AuthorizationReminder } from '@/lib/authorization-reminders';
import { REMINDER_CARD_LEAVE_DELAY_MS } from '@/theme/motion';

export interface AuthorizationRemindersView {
  cards: AuthorizationReminder[];
  leavingChildId: string | null;
  finishedChildName: string | null;
  answer: (reminder: AuthorizationReminder) => void;
}

export function useAuthorizationReminders(familyToday: FamilyToday | null): AuthorizationRemindersView {
  const [state, dispatch] = useReducer(authorizationRemindersReducer, initialAuthorizationRemindersState);
  const authorizationStates = familyToday?.authorizationStates;
  const kids = familyToday?.kids;
  const reminders = useMemo(() => (kids && authorizationStates ? authorizationReminders(kids, authorizationStates) : null), [kids, authorizationStates]);

  useEffect(() => {
    if (reminders) dispatch({ type: AUTHORIZATION_REMINDERS_ACTIONS.REMINDERS_LOADED, reminders });
  }, [reminders]);

  useEffect(() => {
    if (!state.leavingChildId) return;
    const timer = setTimeout(() => dispatch({ type: AUTHORIZATION_REMINDERS_ACTIONS.LEAVE_FINISHED }), REMINDER_CARD_LEAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [state.leavingChildId]);

  useEffect(() => {
    if (!state.finishedChildName) return;
    const timer = setTimeout(() => dispatch({ type: AUTHORIZATION_REMINDERS_ACTIONS.TOAST_HIDDEN }), TOAST_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [state.finishedChildName]);

  function answer(reminder: AuthorizationReminder) {
    dispatch({ type: AUTHORIZATION_REMINDERS_ACTIONS.REMINDER_OPENED, childId: reminder.childId });
    router.push(childAuthorizationsHref(reminder.childId, reminder.firstName, reminder.focusKey));
  }

  return { cards: state.cards, leavingChildId: state.leavingChildId, finishedChildName: state.finishedChildName, answer };
}
