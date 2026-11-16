import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useReducer } from 'react';

import { fetchNurserySettings, saveNurserySettings } from '@/data/director-settings';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import {
  hasSettingsChanges,
  hasSettingsErrors,
  nurseryFieldErrors,
  shiftTimeError,
  type NurseryField,
  type NurserySettings,
  type ShiftTimeEdge,
} from '@/lib/director-settings';
import type { ShiftName } from '@/lib/shift';

import { SETTINGS_FORM_ACTIONS, initialSettingsFormState, settingsFormReducer } from './settings-form-reducer';

export function useNurserySettings() {
  const { session } = useSession();
  const nurseryId = session?.nursery_id ?? null;
  return useAsync(() => fetchNurserySettings(nurseryId ?? ''), nurseryId);
}

export function useSettingsForm(saved: NurserySettings) {
  const { session } = useSession();
  const nurseryId = session?.nursery_id ?? null;
  const [state, dispatch] = useReducer(settingsFormReducer, saved, initialSettingsFormState);
  const canSave = !hasSettingsErrors(saved, state.edited);

  async function save() {
    if (!nurseryId || !canSave) return;
    if (!hasSettingsChanges(saved, state.edited)) {
      router.back();
      return;
    }
    dispatch({ type: SETTINGS_FORM_ACTIONS.SAVE_STARTED });
    try {
      await saveNurserySettings(nurseryId, saved, state.edited);
    } catch (error) {
      console.warn('Saving the nursery settings failed:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: SETTINGS_FORM_ACTIONS.SAVE_FAILED });
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return {
    state,
    canSave,
    fieldErrors: nurseryFieldErrors(saved.details, state.edited.details),
    shiftErrors: Object.fromEntries(state.edited.shifts.map((shift) => [shift.name, shiftTimeError(shift)])) as Record<ShiftName, string | null>,
    changeField: (field: NurseryField, value: string) => dispatch({ type: SETTINGS_FORM_ACTIONS.FIELD_CHANGED, field, value }),
    openTimeSheet: (shiftName: ShiftName, edge: ShiftTimeEdge) => dispatch({ type: SETTINGS_FORM_ACTIONS.TIME_SHEET_OPENED, shiftName, edge }),
    changeDraftTime: (time: string) => dispatch({ type: SETTINGS_FORM_ACTIONS.DRAFT_TIME_CHANGED, time }),
    confirmTimeSheet: () => dispatch({ type: SETTINGS_FORM_ACTIONS.TIME_SHEET_CONFIRMED }),
    closeTimeSheet: () => dispatch({ type: SETTINGS_FORM_ACTIONS.TIME_SHEET_CLOSED }),
    save,
  };
}
