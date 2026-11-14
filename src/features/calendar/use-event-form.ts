import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useReducer, type Dispatch } from 'react';

import { calendarWithToastHref } from '@/constants/routes';
import { createEvent, fetchAudienceFamilyCount, fetchEventForm, updateEvent } from '@/data/events';
import { useSession } from '@/data/session';
import { fetchTeacherGroups } from '@/data/teacher-day';
import { useAsync } from '@/data/use-async';
import { EVENT_FORM_ACTIONS, eventFormReducer, initialEventFormState, type EventFormAction, type EventFormState } from '@/features/calendar/event-form-reducer';
import {
  audienceOptions,
  emptyEventForm,
  eventChange,
  eventWriteRow,
  formValuesFromRow,
  isFormDirty,
  savedEventToast,
  type EventAudienceOption,
} from '@/lib/event-form';
import { isNetworkFailure } from '@/lib/network';
import { defaultGroupIndex } from '@/lib/teacher-day';

export interface EventForm {
  isEdit: boolean;
  loading: boolean;
  failed: boolean;
  notFound: boolean;
  reload: () => void;
  state: EventFormState;
  dispatch: Dispatch<EventFormAction>;
  options: EventAudienceOption[];
  audience: EventAudienceOption | null;
  familyCount: number | null;
  close: () => void;
  save: () => Promise<void>;
}

export function useEventForm(eventId: string | undefined): EventForm {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const [state, dispatch] = useReducer(eventFormReducer, emptyEventForm(null), initialEventFormState);
  const load = useAsync(
    async () => {
      const [groups, stored] = await Promise.all([fetchTeacherGroups(userId!), eventId ? fetchEventForm(eventId) : null]);
      return { groups, stored };
    },
    userId ? `${userId}:${eventId ?? 'new'}:event-form` : null,
  );
  const groups = load.data?.groups ?? [];
  const stored = load.data?.stored ?? null;
  const options = audienceOptions(groups);
  const audience = options.find((option) => option.key === state.values.audienceKey) ?? null;
  const familyCountLoad = useAsync(
    () => fetchAudienceFamilyCount(audience!.roomId, audience!.shiftId),
    audience?.shiftId ? `${audience.key}:family-count` : null,
  );
  const familyCount = audience?.shiftId ? (familyCountLoad.data ?? null) : null;
  const notFound = Boolean(eventId && load.data && !stored);

  useEffect(() => {
    if (!load.data || state.loaded) return;
    if (eventId && !load.data.stored) return;
    const values = load.data.stored
      ? formValuesFromRow(load.data.stored)
      : emptyEventForm(options[defaultGroupIndex(load.data.groups, new Date())]?.key ?? null);
    dispatch({ type: EVENT_FORM_ACTIONS.FORM_LOADED, values });
    // options derive from load.data, which this effect already watches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load.data, state.loaded]);

  function close() {
    if (isFormDirty(state.initial, state.values)) dispatch({ type: EVENT_FORM_ACTIONS.DISCARD_ASKED });
    else router.back();
  }

  async function save() {
    if (!audience || !session) return;
    dispatch({ type: EVENT_FORM_ACTIONS.SAVE_STARTED });
    const row = eventWriteRow(state.values, audience);
    try {
      if (eventId && stored) await updateEvent(eventId, { ...row, ...eventChange(stored.starts_at, row.starts_at, new Date()) });
      else await createEvent(row, { nurseryId: session.nursery_id, userId: session.user_id });
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: EVENT_FORM_ACTIONS.SAVE_FAILED, offline: isNetworkFailure(error) });
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.dismissTo(calendarWithToastHref(savedEventToast(Boolean(eventId), familyCount), state.values.date ?? undefined));
  }

  return {
    isEdit: Boolean(eventId),
    loading: !load.failed && !state.loaded && !notFound,
    failed: load.failed,
    notFound,
    reload: load.reload,
    state,
    dispatch,
    options,
    audience,
    familyCount,
    close,
    save,
  };
}

