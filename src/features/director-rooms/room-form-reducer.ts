import type { RoomFormField, RoomFormValues } from '@/lib/room-form';

export type RoomFormStatus = 'editing' | 'saving' | 'failed';

export interface RoomFormState {
  values: RoomFormValues;
  status: RoomFormStatus;
}

export const ROOM_FORM_ACTIONS = {
  FIELD_CHANGED: 'fieldChanged',
  SAVE_STARTED: 'saveStarted',
  SAVE_FAILED: 'saveFailed',
} as const;

export type RoomFormAction =
  | { type: typeof ROOM_FORM_ACTIONS.FIELD_CHANGED; field: RoomFormField; value: string }
  | { type: typeof ROOM_FORM_ACTIONS.SAVE_STARTED }
  | { type: typeof ROOM_FORM_ACTIONS.SAVE_FAILED };

export function initialRoomFormState(values: RoomFormValues): RoomFormState {
  return { values, status: 'editing' };
}

export function roomFormReducer(state: RoomFormState, action: RoomFormAction): RoomFormState {
  switch (action.type) {
    case ROOM_FORM_ACTIONS.FIELD_CHANGED:
      if (state.status === 'saving') return state;
      return { values: { ...state.values, [action.field]: action.value }, status: 'editing' };
    case ROOM_FORM_ACTIONS.SAVE_STARTED:
      return { ...state, status: 'saving' };
    case ROOM_FORM_ACTIONS.SAVE_FAILED:
      return { ...state, status: 'failed' };
  }
}
