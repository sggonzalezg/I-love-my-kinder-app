import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useReducer, type Dispatch } from 'react';

import { OUTING_EVENT_TYPE } from '@/constants/outing';
import { calendarWithToastHref } from '@/constants/routes';
import {
  applyEventImageChange,
  createEvent,
  fetchAudienceFamilyCount,
  fetchEventForm,
  fetchEventImageUrl,
  updateEvent,
  type EventOwner,
  type StoredEvent,
} from '@/data/events';
import { fetchNurseryAudience } from '@/data/nursery-audience';
import { DEFAULT_PERMISSION_VERSION, fetchOutingAnswers } from '@/data/outing-permission';
import { useSession } from '@/data/session';
import { fetchTeacherGroups } from '@/data/teacher-day';
import { useAsync } from '@/data/use-async';
import { EVENT_FORM_ACTIONS, eventFormReducer, initialEventFormState, type EventFormAction, type EventFormState } from '@/features/calendar/event-form-reducer';
import { audienceReach, directorAudienceOptions, type AudienceReach } from '@/lib/director-event-audience';
import {
  audienceKey,
  audienceOptions,
  emptyEventForm,
  eventChange,
  eventWriteRow,
  formValuesFromRow,
  isFormDirty,
  savedEventToast,
  type EventAudienceOption,
  type EventWriteRow,
} from '@/lib/event-form';
import { eventImageChange, isEventImageChanged, type EventImage } from '@/lib/event-image';
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
  isDirector: boolean;
  reach: AudienceReach | null;
  familyCount: number | null;
  resignText: string | null;
  close: () => void;
  save: () => Promise<void>;
  confirmResign: () => Promise<void>;
}

const NO_ANSWERS: OutingAnswerCounts = { authorizedCount: 0, declinedCount: 0, pendingCount: 0, childCount: 0 };

async function fetchStoredImage(stored: StoredEvent | null): Promise<EventImage | null> {
  const imageUrl = await fetchEventImageUrl(stored?.image_path ?? null);
  return imageUrl && stored?.image_path ? { uri: imageUrl, storedPath: stored.image_path } : null;
}

async function fetchAnswerCounts(eventId: string, stored: StoredEvent | null): Promise<OutingAnswerCounts> {
  if (stored?.event_type !== OUTING_EVENT_TYPE) return NO_ANSWERS;
  return outingAnswerCounts(await fetchOutingAnswers([eventId]), stored.permission_version ?? DEFAULT_PERMISSION_VERSION);
}

const NURSERY_AUDIENCE_KEY = audienceKey(null, null);

export function useEventForm(eventId: string | undefined): EventForm {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const isDirector = session?.active_role === 'director';
  const [state, dispatch] = useReducer(eventFormReducer, emptyEventForm(null), initialEventFormState);
  const load = useAsync(
    async () => {
      const [groups, nurseryAudience, stored] = await Promise.all([
        isDirector ? [] : fetchTeacherGroups(userId!),
        isDirector ? fetchNurseryAudience(session!.nursery_id, new Date()) : null,
        eventId ? fetchEventForm(eventId) : null,
      ]);
      const [answers, image] = await Promise.all([eventId ? fetchAnswerCounts(eventId, stored) : NO_ANSWERS, fetchStoredImage(stored)]);
      return { groups, nurseryAudience, stored, answers, image };
    },
    userId ? `${userId}:${session?.active_role}:${eventId ?? 'new'}:event-form` : null,
  );
  const groups = load.data?.groups ?? [];
  const nurseryAudience = load.data?.nurseryAudience ?? null;
  const stored = load.data?.stored ?? null;
  const options = nurseryAudience ? directorAudienceOptions(nurseryAudience) : audienceOptions(groups);
  const audience = options.find((option) => option.key === state.values.audienceKey) ?? null;
  const reach = nurseryAudience && audience ? audienceReach(nurseryAudience, audience) : null;
  const familyCountLoad = useAsync(
    () => fetchAudienceFamilyCount(audience!.roomId!, audience!.shiftId),
    !isDirector && audience?.roomId && audience.shiftId ? `${audience.key}:family-count` : null,
  );
  const familyCount = isDirector ? (reach?.familyCount ?? null) : audience?.shiftId ? (familyCountLoad.data ?? null) : null;
  const notFound = Boolean(eventId && load.data && !stored);
  const answers = load.data?.answers ?? NO_ANSWERS;
  const changeLine = stored ? permissionChangeLine(state.initial, state.values) : null;
  const resignText = changeLine && answers.authorizedCount > 0 ? `${changeLine} ${resignLine(answers.authorizedCount, answers.childCount)}` : null;

  useEffect(() => {
    if (!load.data || state.loaded) return;
    if (eventId && !load.data.stored) return;
    const values = load.data.stored
      ? formValuesFromRow(load.data.stored)
      : emptyEventForm(isDirector ? NURSERY_AUDIENCE_KEY : (options[defaultGroupIndex(load.data.groups, new Date())]?.key ?? null));
    dispatch({ type: EVENT_FORM_ACTIONS.FORM_LOADED, values, image: load.data.image });
    // options derive from load.data, which this effect already watches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load.data, state.loaded]);

  function close() {
    if (isFormDirty(state.initial, state.values) || isEventImageChanged(state.initialImage, state.image)) dispatch({ type: EVENT_FORM_ACTIONS.DISCARD_ASKED });
    else router.back();
  }

  async function save() {
    if (resignText) dispatch({ type: EVENT_FORM_ACTIONS.RESIGN_ASKED });
    else await write();
  }

  async function writeEventRow(row: EventWriteRow, owner: EventOwner): Promise<string> {
    if (eventId && stored) {
      const permissionVersion = permissionVersionAfterEdit(stored.permission_version ?? DEFAULT_PERMISSION_VERSION, state.initial, state.values);
      await updateEvent(eventId, { ...row, ...eventChange(stored.starts_at, row.starts_at, new Date()), permission_version: permissionVersion });
      return eventId;
    }
    if (state.createdEventId) {
      await updateEvent(state.createdEventId, row);
      return state.createdEventId;
    }
    const createdEventId = await createEvent(row, owner);
    dispatch({ type: EVENT_FORM_ACTIONS.EVENT_CREATED, eventId: createdEventId });
    return createdEventId;
  }

  async function write() {
    if (!audience || !session) return;
    dispatch({ type: EVENT_FORM_ACTIONS.SAVE_STARTED });
    const row = eventWriteRow(state.values, audience);
    try {
      const owner = { nurseryId: session.nursery_id, userId: session.user_id };
      const savedEventId = await writeEventRow(row, owner);
      await applyEventImageChange(eventImageChange(state.initialImage, state.image), { nurseryId: owner.nurseryId, eventId: savedEventId });
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
    isDirector,
    reach,
    familyCount,
    resignText,
    close,
    save,
    confirmResign: write,
  };
}

