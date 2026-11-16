import type { AuthorizationReminder } from '@/lib/authorization-reminders';

export interface AuthorizationRemindersState {
  cards: AuthorizationReminder[];
  /** The child whose card opened F3; on the next load it tells "answered here" from "answered by the other guardian". */
  openedChildId: string | null;
  leavingChildId: string | null;
  finishedChildName: string | null;
}

export const AUTHORIZATION_REMINDERS_ACTIONS = {
  REMINDERS_LOADED: 'remindersLoaded',
  REMINDER_OPENED: 'reminderOpened',
  LEAVE_FINISHED: 'leaveFinished',
  TOAST_HIDDEN: 'toastHidden',
} as const;

type AuthorizationRemindersAction =
  | { type: typeof AUTHORIZATION_REMINDERS_ACTIONS.REMINDERS_LOADED; reminders: AuthorizationReminder[] }
  | { type: typeof AUTHORIZATION_REMINDERS_ACTIONS.REMINDER_OPENED; childId: string }
  | { type: typeof AUTHORIZATION_REMINDERS_ACTIONS.LEAVE_FINISHED }
  | { type: typeof AUTHORIZATION_REMINDERS_ACTIONS.TOAST_HIDDEN };

export const initialAuthorizationRemindersState: AuthorizationRemindersState = {
  cards: [],
  openedChildId: null,
  leavingChildId: null,
  finishedChildName: null,
};

function isListed(reminders: AuthorizationReminder[], childId: string): boolean {
  return reminders.some((reminder) => reminder.childId === childId);
}

/** The leaving card goes back between the cards that were around it before, so nothing moves until it leaves. */
function withLeavingCard(reminders: AuthorizationReminder[], previousCards: AuthorizationReminder[], leaving: AuthorizationReminder): AuthorizationReminder[] {
  const previousIndex = previousCards.indexOf(leaving);
  const cardsBefore = previousCards.slice(0, previousIndex).filter((card) => isListed(reminders, card.childId)).length;
  return [...reminders.slice(0, cardsBefore), leaving, ...reminders.slice(cardsBefore)];
}

function remindersLoaded(state: AuthorizationRemindersState, reminders: AuthorizationReminder[]): AuthorizationRemindersState {
  const leavingChildId = state.leavingChildId ?? state.openedChildId;
  const leaving = state.cards.find((card) => card.childId === leavingChildId && !isListed(reminders, card.childId));
  return {
    ...state,
    cards: leaving ? withLeavingCard(reminders, state.cards, leaving) : reminders,
    openedChildId: null,
    leavingChildId: leaving?.childId ?? null,
  };
}

export function authorizationRemindersReducer(state: AuthorizationRemindersState, action: AuthorizationRemindersAction): AuthorizationRemindersState {
  switch (action.type) {
    case AUTHORIZATION_REMINDERS_ACTIONS.REMINDERS_LOADED:
      return remindersLoaded(state, action.reminders);
    case AUTHORIZATION_REMINDERS_ACTIONS.REMINDER_OPENED:
      return { ...state, openedChildId: action.childId };
    case AUTHORIZATION_REMINDERS_ACTIONS.LEAVE_FINISHED: {
      const leaving = state.cards.find((card) => card.childId === state.leavingChildId);
      return {
        ...state,
        cards: state.cards.filter((card) => card !== leaving),
        leavingChildId: null,
        finishedChildName: leaving?.firstName ?? null,
      };
    }
    case AUTHORIZATION_REMINDERS_ACTIONS.TOAST_HIDDEN:
      return { ...state, finishedChildName: null };
  }
}
