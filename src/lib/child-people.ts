import { detailLine, formatNationalId, maskNationalId } from './child-file';
import { relationshipLabel } from './format';
import { nationalIdFieldError, normalizeNationalId } from './national-id';
import { toPhoneFieldValue, toStoredPhone } from './phone';

export const PERSON_KINDS = { contact: 'contact', pickup: 'pickup' } as const;
export type PersonKind = (typeof PERSON_KINDS)[keyof typeof PERSON_KINDS];

export const PERSON_NAME_MAX_LENGTH = 80;
export const RELATIONSHIP_MAX_LENGTH = 40;
export const PHONE_MAX_LENGTH = 20;

const NATIONAL_ID_PREFIX = 'CI';

export const PERSON_FORM_MESSAGES = {
  nameMissing: 'Escribí el nombre.',
  phoneMissing: 'Escribí el celular.',
  phoneInvalid: 'Revisá el número: no es un teléfono válido.',
} as const;

export interface ChildContact {
  id: string;
  name: string;
  relationship: string | null;
  phone: string;
}

export interface PickupPerson extends ChildContact {
  national_id: string | null;
}

export type ChildPerson = ChildContact | PickupPerson;

export interface ChildPeople {
  emergencyContacts: ChildContact[];
  pickupPeople: PickupPerson[];
}

export interface PersonFormValues {
  name: string;
  relationship: string;
  phone: string;
  nationalId: string;
}

export type PersonFormField = keyof PersonFormValues;
export type PersonFormErrors = Partial<Record<PersonFormField, string>>;

export interface PersonRow {
  name: string;
  relationship: string | null;
  phone: string;
  national_id?: string;
}

const PHONE_OPTIONS = { allowLandline: true };

/** Only pickup people have a cédula. */
export function personNationalId(person: ChildPerson | null): string | null {
  return person && 'national_id' in person ? person.national_id : null;
}

export function personFormValues(person: ChildPerson | null): PersonFormValues {
  const nationalId = personNationalId(person);
  return {
    name: person?.name ?? '',
    relationship: person?.relationship ? relationshipLabel(person.relationship) : '',
    phone: toPhoneFieldValue(person?.phone ?? null),
    nationalId: nationalId ? formatNationalId(nationalId) : '',
  };
}

function phoneError(phone: string): string | null {
  if (!phone.trim()) return PERSON_FORM_MESSAGES.phoneMissing;
  return toStoredPhone(phone, PHONE_OPTIONS) ? null : PERSON_FORM_MESSAGES.phoneInvalid;
}

export function personFormErrors(kind: PersonKind, values: PersonFormValues): PersonFormErrors {
  const errors: PersonFormErrors = {};
  if (!values.name.trim()) errors.name = PERSON_FORM_MESSAGES.nameMissing;
  const phone = phoneError(values.phone);
  if (phone) errors.phone = phone;
  const nationalId = kind === PERSON_KINDS.pickup ? nationalIdFieldError(values.nationalId) : null;
  if (nationalId) errors.nationalId = nationalId;
  return errors;
}

/** Only call with values that passed `personFormErrors`. */
export function personRow(kind: PersonKind, values: PersonFormValues): PersonRow {
  const row: PersonRow = {
    name: values.name.trim(),
    relationship: values.relationship.trim() || null,
    phone: toStoredPhone(values.phone, PHONE_OPTIONS) ?? '',
  };
  if (kind === PERSON_KINDS.pickup) row.national_id = normalizeNationalId(values.nationalId) ?? '';
  return row;
}

export function personDetailLine(person: ChildPerson): string {
  return detailLine([person.relationship ? relationshipLabel(person.relationship) : null, toPhoneFieldValue(person.phone)]);
}

export function personNationalIdLine(nationalId: string, revealed: boolean): string {
  return `${NATIONAL_ID_PREFIX} ${revealed ? formatNationalId(nationalId) : maskNationalId(nationalId)}`;
}
