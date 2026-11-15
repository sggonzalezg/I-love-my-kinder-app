import { toPhoneFieldValue, toStoredPhone } from './phone';
import { SHIFT_NAMES, shiftLabel, type ShiftName } from './shift';

export interface NurseryDetails {
  address: string;
  contactPhone: string;
  urgentPhone: string;
}

export type NurseryField = keyof NurseryDetails;

/** Times as "HH:MM"; null when the nursery never set them. */
export interface SettingsShift {
  name: ShiftName;
  startTime: string | null;
  endTime: string | null;
}

export type ShiftTimeEdge = 'startTime' | 'endTime';

export interface NurserySettings {
  details: NurseryDetails;
  shifts: SettingsShift[];
}

export interface NurseryRow {
  address: string | null;
  contact_phone: string | null;
  urgent_phone: string | null;
}

export interface ShiftRow {
  name: ShiftName;
  start_time: string | null;
  end_time: string | null;
}

export interface ShiftUpsertRow {
  nursery_id: string;
  name: ShiftName;
  start_time: string | null;
  end_time: string | null;
}

export const NURSERY_FIELDS: readonly NurseryField[] = ['address', 'contactPhone', 'urgentPhone'];
export const ADDRESS_MAX_LENGTH = 200;
export const PHONE_MAX_LENGTH = 24;

export const REQUIRED_FIELD_ERROR = 'No puede quedar vacío.';
export const ADDRESS_LENGTH_ERROR = 'La dirección puede tener hasta 200 letras.';
export const CONTACT_PHONE_ERROR = 'Revisá el número: tiene que ser un celular con WhatsApp.';
export const URGENT_PHONE_ERROR = 'Revisá el número: las familias lo llaman en una urgencia.';

const DB_TIME_LENGTH = 5;

function toSettingsTime(databaseTime: string | null): string | null {
  return databaseTime ? databaseTime.slice(0, DB_TIME_LENGTH) : null;
}

/** Every shift of SHIFT_NAMES is shown, also one the nursery has no row for yet (it is created on save, as in the panel). */
export function settingsShifts(rows: ShiftRow[]): SettingsShift[] {
  return SHIFT_NAMES.map((name) => {
    const row = rows.find((candidate) => candidate.name === name);
    return { name, startTime: toSettingsTime(row?.start_time ?? null), endTime: toSettingsTime(row?.end_time ?? null) };
  });
}

export function nurseryDetailsOf(row: NurseryRow): NurseryDetails {
  return { address: row.address ?? '', contactPhone: toPhoneFieldValue(row.contact_phone), urgentPhone: toPhoneFieldValue(row.urgent_phone) };
}

function storedPhoneOf(field: 'contactPhone' | 'urgentPhone', value: string): string | null {
  return toStoredPhone(value, { allowLandline: field === 'urgentPhone' });
}

function nurseryFieldError(field: NurseryField, savedValue: string, value: string): string | null {
  if (value.trim() === '') return savedValue.trim() === '' ? null : REQUIRED_FIELD_ERROR;
  if (field === 'address') return value.trim().length > ADDRESS_MAX_LENGTH ? ADDRESS_LENGTH_ERROR : null;
  if (storedPhoneOf(field, value)) return null;
  return field === 'contactPhone' ? CONTACT_PHONE_ERROR : URGENT_PHONE_ERROR;
}

/** Seba (change d752a1e2, as the panel W2): a saved field cannot be emptied; one never filled blocks nothing. */
export function nurseryFieldErrors(saved: NurseryDetails, edited: NurseryDetails): Partial<Record<NurseryField, string>> {
  const errors: Partial<Record<NurseryField, string>> = {};
  for (const field of NURSERY_FIELDS) {
    const error = nurseryFieldError(field, saved[field], edited[field]);
    if (error) errors[field] = error;
  }
  return errors;
}

export function shiftTimeError(shift: SettingsShift): string | null {
  const { startTime, endTime } = shift;
  if (startTime === null && endTime === null) return null;
  const shiftName = shiftLabel(shift.name).toLowerCase();
  if (startTime === null || endTime === null) return `Elegí cuándo empieza y termina el turno ${shiftName}.`;
  return endTime > startTime ? null : `El turno ${shiftName} termina antes de empezar.`;
}

export function hasSettingsErrors(saved: NurserySettings, edited: NurserySettings): boolean {
  return Object.keys(nurseryFieldErrors(saved.details, edited.details)).length > 0 || edited.shifts.some((shift) => shiftTimeError(shift) !== null);
}

function changedNurseryFields(saved: NurseryDetails, edited: NurseryDetails): NurseryField[] {
  return NURSERY_FIELDS.filter((field) => saved[field] !== edited[field]);
}

export function changedShifts(saved: SettingsShift[], edited: SettingsShift[]): SettingsShift[] {
  return edited.filter((shift) => {
    const before = saved.find((candidate) => candidate.name === shift.name);
    return !before || before.startTime !== shift.startTime || before.endTime !== shift.endTime;
  });
}

export function hasSettingsChanges(saved: NurserySettings, edited: NurserySettings): boolean {
  return changedNurseryFields(saved.details, edited.details).length > 0 || changedShifts(saved.shifts, edited.shifts).length > 0;
}

/** The `nurseries` columns of the changed fields, in the format the database checks. */
export function nurseryUpdate(saved: NurseryDetails, edited: NurseryDetails): Partial<NurseryRow> {
  const toColumn: Record<NurseryField, [keyof NurseryRow, (value: string) => string | null]> = {
    address: ['address', (value) => value.trim() || null],
    contactPhone: ['contact_phone', (value) => storedPhoneOf('contactPhone', value)],
    urgentPhone: ['urgent_phone', (value) => storedPhoneOf('urgentPhone', value)],
  };
  return Object.fromEntries(
    changedNurseryFields(saved, edited).map((field) => {
      const [column, toValue] = toColumn[field];
      return [column, toValue(edited[field])];
    }),
  );
}

export function shiftUpsertRows(nurseryId: string, shifts: SettingsShift[]): ShiftUpsertRow[] {
  return shifts.map((shift) => ({ nursery_id: nurseryId, name: shift.name, start_time: shift.startTime, end_time: shift.endTime }));
}
