import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useReducer, type Dispatch } from 'react';

import { OUTING_EVENT_TYPE } from '@/constants/outing';
import { calendarWithToastHref } from '@/constants/routes';
import { createEvent, fetchAudienceFamilyCount, fetchEventForm, updateEvent, type StoredEvent } from '@/data/events';
import { DEFAULT_PERMISSION_VERSION, fetchOutingAnswers } from '@/data/outing-permission';
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
import { isOuting } from '@/lib/outing-fields';
import {
  outingAnswerCounts,
  permissionChangeLine,
  permissionVersionAfterEdit,
  resignLine,
  savedOutingToast,
  type OutingAnswerCounts,
} from '@/lib/outing-form';
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
  resignText: string | null;
  close: () => void;
  save: () => Promise<void>;
  confirmResign: () => Promise<void>;
}

const NO_ANSWERS: OutingAnswerCounts = { authorizedCount: 0, childCount: 0 };

async function fetchAnswerCounts(eventId: string, stored: StoredEvent | null): Promise<OutingAnswerCounts> {
  if (stored?.event_type !== OUTING_EVENT_TYPE) return NO_ANSWERS;
  return outingAnswerCounts(await fetchOutingAnswers([eventId]), stored.permission_version ?? DEFAULT_PERMISSION_VERSION);
}

export function useEventForm(eventId: string | undefined): EventForm {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const [state, dispatch] = useReducer(eventFormReducer, emptyEventForm(null), initialEventFormState);
  const load = useAsync(
    async () => {
      const [groups, stored] = await Promise.all([fetchTeacherGroups(userId!), eventId ? fetchEventForm(eventId) : null]);
      const answers = eventId ? await fetchAnswerCounts(eventId, stored) : NO_ANSWERS;
      return { groups, stored, answers };
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
  const answers = load.data?.answers ?? NO_ANSWERS;
  const changeLine = stored ? permissionChangeLine(state.initial, state.values) : null;
  const resignText = changeLine && answers.authorizedCount > 0 ? `${changeLine} ${resignLine(answers.authorizedCount, answers.childCount)}` : null;

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
    if (resignText) dispatch({ type: EVENT_FORM_ACTIONS.RESIGN_ASKED });
    else await write();
  }

  async function write() {
    if (!audience || !session) return;
    dispatch({ type: EVENT_FORM_ACTIONS.SAVE_STARTED });
    const row = eventWriteRow(state.values, audience);
    try {
      if (eventId && stored) {
        const permissionVersion = permissionVersionAfterEdit(stored.permission_version ?? DEFAULT_PERMISSION_VERSION, state.initial, state.values);
        await updateEvent(eventId, { ...row, ...eventChange(stored.starts_at, row.starts_at, new Date()), permission_version: permissionVersion });
      } else await createEvent(row, { nurseryId: session.nursery_id, userId: session.user_id });
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: EVENT_FORM_ACTIONS.SAVE_FAILED, offline: isNetworkFailure(error) });
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const toast = !eventId && isOuting(state.values) ? savedOutingToast(familyCount) : savedEventToast(Boolean(eventId), familyCount);
    router.dismissTo(calendarWithToastHref(toast, state.values.date ?? undefined));
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
    resignText,
    close,
    save,
    confirmResign: write,
  };
}

