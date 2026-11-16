import { currentAuthorizations, type AuthorizationRecord } from './authorizations';
import { birthDateToIso, validateChildIdentity } from './new-child-form';
import { CHILD_AUTHORIZATIONS } from '@/legal/texts';

export const ALLERGIES_MAX_LENGTH = 500;

export const CHILD_FILE_PARTS = { data: 'data', health: 'health', contacts: 'contacts', pickup: 'pickup' } as const;
export type ChildFilePart = (typeof CHILD_FILE_PARTS)[keyof typeof CHILD_FILE_PARTS];

export interface DirectorChildFile {
  id: string;
  firstName: string;
  lastName: string | null;
  birthDate: string | null;
  allergies: string | null;
  photoPath: string | null;
  healthGranted: boolean;
}

export interface ChildFileValues {
  firstName: string;
  lastName: string;
  birthDate: string;
  allergies: string;
}

export type ChildFileField = keyof ChildFileValues;
export type ChildFileErrors = Partial<Record<ChildFileField, string>>;

export interface ChildColumns {
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  allergies?: string | null;
}

const twoDigits = (value: string) => value.padStart(2, '0');

/** "2023-05-12" → "12/05/2023", the format the director types. */
export function birthDateText(iso: string | null): string {
  if (!iso) return '';
  const [year, month, day] = iso.split('-');
  return `${twoDigits(day)}/${twoDigits(month)}/${year}`;
}

export function initialChildFileValues(file: DirectorChildFile): ChildFileValues {
  return { firstName: file.firstName, lastName: file.lastName ?? '', birthDate: birthDateText(file.birthDate), allergies: file.allergies ?? '' };
}

export function childFileErrors(part: ChildFilePart, values: ChildFileValues, today: Date): ChildFileErrors {
  return part === CHILD_FILE_PARTS.data ? validateChildIdentity(values, today) : {};
}

/** Only call with values that passed `childFileErrors`; as the panel, an emptied allergy text is stored as null. */
export function changedChildColumns(part: ChildFilePart, file: DirectorChildFile, values: ChildFileValues): ChildColumns {
  const columns: ChildColumns = {};
  if (part === CHILD_FILE_PARTS.health) {
    const allergies = values.allergies.trim() || null;
    if (allergies !== file.allergies) columns.allergies = allergies;
    return columns;
  }
  const firstName = values.firstName.trim();
  const lastName = values.lastName.trim();
  const birthDate = birthDateToIso(values.birthDate);
  if (firstName !== file.firstName) columns.first_name = firstName;
  if (lastName !== (file.lastName ?? '')) columns.last_name = lastName;
  if (birthDate && birthDate !== file.birthDate) columns.birth_date = birthDate;
  return columns;
}

export function isHealthGranted(records: AuthorizationRecord[]): boolean {
  return currentAuthorizations(records)[CHILD_AUTHORIZATIONS.health.id].granted;
}

/** Contactos and Retiran save each person in its own form; Salud saves only with the family's health authorization. */
export function savesWithActionBar(part: ChildFilePart, healthGranted: boolean): boolean {
  return part === CHILD_FILE_PARTS.data || (part === CHILD_FILE_PARTS.health && healthGranted);
}
