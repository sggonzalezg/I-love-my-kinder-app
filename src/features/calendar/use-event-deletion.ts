import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useReducer } from 'react';

import { calendarWithToastHref } from '@/constants/routes';
import { cancelEvent, fetchEventReach } from '@/data/events';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { EVENT_DELETE_ACTIONS, INITIAL_EVENT_DELETE_STATE, eventDeleteReducer, type EventDeleteState } from '@/features/calendar/event-delete-reducer';
import type { Event } from '@/lib/calendar';
import { deletedEventToast, eventStaffAction, type EventReach, type EventStaffAction } from '@/lib/event-cancellation';

export interface EventDeletion {
  staffAction: EventStaffAction;
  reach: EventReach | null;
  state: EventDeleteState;
  openSheet: () => void;
  closeSheet: () => void;
  changeReason: (reason: string) => void;
  confirm: () => Promise<void>;
}

export function useEventDeletion(event: Event | null): EventDeletion {
  const { session } = useSession();
  const [state, dispatch] = useReducer(eventDeleteReducer, INITIAL_EVENT_DELETE_STATE);
  const userId = session?.user_id ?? null;
  const role = session?.active_role ?? 'family';
  const staffAction = event ? eventStaffAction(role, event.created_by === userId) : 'none';
  const isStaff = role !== 'family';
  const reachLoad = useAsync(
    () => fetchEventReach(event!, userId!),
    event && userId && isStaff ? `${userId}:${event.id}:reach` : null,
  );
  const reach = reachLoad.data;

  async function confirm() {
    if (!event) return;
    dispatch({ type: EVENT_DELETE_ACTIONS.DELETE_STARTED });
    try {
      await cancelEvent(event.id, state.reason);
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: EVENT_DELETE_ACTIONS.DELETE_FAILED });
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.dismissTo(calendarWithToastHref(deletedEventToast(event.has_ended === true, reach)));
  }

  return {
    staffAction,
    reach,
    state,
    openSheet: () => dispatch({ type: EVENT_DELETE_ACTIONS.SHEET_OPENED }),
    closeSheet: () => dispatch({ type: EVENT_DELETE_ACTIONS.SHEET_CLOSED }),
    changeReason: (reason) => dispatch({ type: EVENT_DELETE_ACTIONS.REASON_CHANGED, reason }),
    confirm,
  };
}
