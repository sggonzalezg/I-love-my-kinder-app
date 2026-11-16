export const ROOM_NAME_MAX_LENGTH = 40;
export const ROOM_AGE_MAX_LENGTH = 20;

export interface RoomFormValues {
  name: string;
  age: string;
}

export type RoomFormField = keyof RoomFormValues;

export interface RoomRow {
  name: string;
  description: string | null;
}

export function canSaveRoom(values: RoomFormValues): boolean {
  return values.name.trim().length > 0;
}

/** As the panel W12: the age goes in `rooms.description` ("2 años"), the only free text column a room has. */
export function roomRow(values: RoomFormValues): RoomRow {
  return { name: values.name.trim(), description: values.age.trim() || null };
}
