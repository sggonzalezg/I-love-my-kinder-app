import { toIsoDate } from './dates';
import { nationalIdFieldError, nationalIdSaveMessage, normalizeNationalId } from './national-id';
import { SHIFT_ORDER, shiftLabel, type ShiftName } from './shift';

export const CHILD_NAME_MAX_LENGTH = 60;
export const BIRTH_DATE_MAX_LENGTH = 10;
export const NATIONAL_ID_MAX_LENGTH = 11;

const BIRTH_DATE_PATTERN = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
const ROOM_NAME_COLLATOR = new Intl.Collator('es', { numeric: true });

export const NEW_CHILD_MESSAGES = {
  firstNameMissing: 'Escribí sus nombres.',
  lastNameMissing: 'Escribí sus apellidos.',
  birthDateMissing: 'Escribí su fecha de nacimiento.',
  birthDateInvalid: 'Escribí la fecha como 12/05/2023.',
  birthDateFuture: 'La fecha no puede ser futura.',
  roomMissing: 'Elegí la sala.',
  shiftMissing: 'Elegí el turno.',
  nationalIdOfOtherChild: 'Esa cédula ya es de otro niño del jardín.',
  groupNotInNursery: 'Esa sala o ese turno ya no están en el jardín. Elegí otro.',
  saveFailed: 'No pudimos guardar. Probá de nuevo.',
} as const;

export interface NewChildFormValues {
  firstName: string;
  lastName: string;
  birthDate: string;
  nationalId: string;
  roomId: string | null;
  shiftId: string | null;
}

export type NewChildField = keyof NewChildFormValues;
export type NewChildFieldErrors = Partial<Record<NewChildField, string>>;

export interface NewChildSaveError {
  field: NewChildField | null;
  message: string;
}

export interface NewChildRoom {
  id: string;
  name: string;
}

export interface NewChildShift {
  id: string;
  name: ShiftName;
}

export interface NewChildChoice {
  value: string;
  label: string;
}

export interface CreateChildArgs {
  target_nursery_id: string;
  child_first_name: string;
  child_last_name: string;
  child_birth_date: string;
  child_national_id: string;
  target_room_id: string;
  target_shift_id: string;
}

export const EMPTY_NEW_CHILD_VALUES: NewChildFormValues = { firstName: '', lastName: '', birthDate: '', nationalId: '', roomId: null, shiftId: null };

/** "12/05/2023" → "2023-05-12"; null when the text is not a real calendar day. */
export function birthDateToIso(text: string): string | null {
  const match = BIRTH_DATE_PATTERN.exec(text.trim());
  if (!match) return null;
  const [day, month, year] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  const isRealDay = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return isRealDay ? toIsoDate(date) : null;
}

function birthDateError(text: string, today: Date): string | null {
  if (!text.trim()) return NEW_CHILD_MESSAGES.birthDateMissing;
  const iso = birthDateToIso(text);
  if (!iso) return NEW_CHILD_MESSAGES.birthDateInvalid;
  return iso > toIsoDate(today) ? NEW_CHILD_MESSAGES.birthDateFuture : null;
}

export function validateNewChild(values: NewChildFormValues, today: Date): NewChildFieldErrors {
  const errors: NewChildFieldErrors = {};
  if (!values.firstName.trim()) errors.firstName = NEW_CHILD_MESSAGES.firstNameMissing;
  if (!values.lastName.trim()) errors.lastName = NEW_CHILD_MESSAGES.lastNameMissing;
  const birthDate = birthDateError(values.birthDate, today);
  if (birthDate) errors.birthDate = birthDate;
  const nationalId = nationalIdFieldError(values.nationalId);
  if (nationalId) errors.nationalId = nationalId;
  if (!values.roomId) errors.roomId = NEW_CHILD_MESSAGES.roomMissing;
  if (!values.shiftId) errors.shiftId = NEW_CHILD_MESSAGES.shiftMissing;
  return errors;
}

export function hasErrors(errors: NewChildFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Only call with values that passed `validateNewChild`. */
export function createChildArgs(nurseryId: string, values: NewChildFormValues): CreateChildArgs {
  return {
    target_nursery_id: nurseryId,
    child_first_name: values.firstName.trim(),
    child_last_name: values.lastName.trim(),
    child_birth_date: birthDateToIso(values.birthDate) ?? '',
    child_national_id: normalizeNationalId(values.nationalId) ?? '',
    target_room_id: values.roomId ?? '',
    target_shift_id: values.shiftId ?? '',
  };
}

/** Maps the `create_child` exceptions to the field they belong to. */
export function newChildSaveError(errorMessage: string): NewChildSaveError {
  if (errorMessage.includes('national_id_taken')) return { field: 'nationalId', message: NEW_CHILD_MESSAGES.nationalIdOfOtherChild };
  const nationalIdMessage = nationalIdSaveMessage(errorMessage);
  if (nationalIdMessage) return { field: 'nationalId', message: nationalIdMessage };
  if (errorMessage.includes('group_not_in_nursery')) return { field: null, message: NEW_CHILD_MESSAGES.groupNotInNursery };
  return { field: null, message: NEW_CHILD_MESSAGES.saveFailed };
}

export function roomChoices(rooms: NewChildRoom[]): NewChildChoice[] {
  return [...rooms].sort((first, second) => ROOM_NAME_COLLATOR.compare(first.name, second.name)).map((room) => ({ value: room.id, label: room.name }));
}

/** As the mockup, the first shift (morning) starts chosen until the director picks another. */
export function withDefaultShift(values: NewChildFormValues, shifts: NewChildChoice[]): NewChildFormValues {
  return values.shiftId ? values : { ...values, shiftId: shifts[0]?.value ?? null };
}

export function shiftChoices(shifts: NewChildShift[]): NewChildChoice[] {
  return [...shifts]
    .sort((first, second) => SHIFT_ORDER.indexOf(first.name) - SHIFT_ORDER.indexOf(second.name))
    .map((shift) => ({ value: shift.id, label: shiftLabel(shift.name) }));
}
