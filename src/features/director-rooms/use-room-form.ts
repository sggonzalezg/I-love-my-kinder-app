import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useReducer } from 'react';

import { saveRoom } from '@/data/director-rooms';
import { useSession } from '@/data/session';
import { canSaveRoom, roomRow, type RoomFormField, type RoomFormValues } from '@/lib/room-form';

import { ROOM_FORM_ACTIONS, initialRoomFormState, roomFormReducer, type RoomFormState } from './room-form-reducer';

export interface RoomFormControl {
  state: RoomFormState;
  canSave: boolean;
  change: (field: RoomFormField, value: string) => void;
  save: () => Promise<void>;
}

export function useRoomForm(roomId: string | null, initialValues: RoomFormValues): RoomFormControl {
  const { session } = useSession();
  const nurseryId = session?.nursery_id ?? null;
  const [state, dispatch] = useReducer(roomFormReducer, initialValues, initialRoomFormState);

  async function save() {
    if (!nurseryId || !canSaveRoom(state.values)) return;
    dispatch({ type: ROOM_FORM_ACTIONS.SAVE_STARTED });
    try {
      await saveRoom(nurseryId, roomId, roomRow(state.values));
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: ROOM_FORM_ACTIONS.SAVE_FAILED });
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return {
    state,
    canSave: canSaveRoom(state.values),
    change: (field, value) => dispatch({ type: ROOM_FORM_ACTIONS.FIELD_CHANGED, field, value }),
    save,
  };
}
