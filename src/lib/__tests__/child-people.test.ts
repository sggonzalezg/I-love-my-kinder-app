import {
  PERSON_FORM_MESSAGES,
  PERSON_KINDS,
  personDetailLine,
  personFormErrors,
  personFormValues,
  personNationalIdLine,
  personRow,
  type PersonFormValues,
} from '@/lib/child-people';
import { NATIONAL_ID_MESSAGES } from '@/lib/national-id';

const VALID_PICKUP: PersonFormValues = { name: 'Marta González', relationship: 'Abuela', phone: '099 300 120', nationalId: '4.876.543-8' };

describe('personFormValues', () => {
  it('starts empty for a new person', () => {
    expect(personFormValues(null)).toEqual({ name: '', relationship: '', phone: '', nationalId: '' });
  });

  it('shows the stored phone as typed in Uruguay and the cédula formatted', () => {
    const values = personFormValues({ id: 'p1', name: 'Marta', relationship: 'Abuela', phone: '+59899300120', national_id: '48765438' });
    expect(values).toEqual({ name: 'Marta', relationship: 'Abuela', phone: '099 300 120', nationalId: '4.876.543-8' });
  });

  it('leaves the cédula empty for an emergency contact', () => {
    expect(personFormValues({ id: 'c1', name: 'Ana', relationship: null, phone: '+59899123456' }).nationalId).toBe('');
  });
});

describe('personFormErrors', () => {
  it('accepts a complete pickup person', () => {
    expect(personFormErrors(PERSON_KINDS.pickup, VALID_PICKUP)).toEqual({});
  });

  it('asks for the name', () => {
    expect(personFormErrors(PERSON_KINDS.contact, { ...VALID_PICKUP, name: '  ' }).name).toBe(PERSON_FORM_MESSAGES.nameMissing);
  });

  it('asks for the phone', () => {
    expect(personFormErrors(PERSON_KINDS.contact, { ...VALID_PICKUP, phone: '' }).phone).toBe(PERSON_FORM_MESSAGES.phoneMissing);
  });

  it('refuses a number that is not a phone', () => {
    expect(personFormErrors(PERSON_KINDS.contact, { ...VALID_PICKUP, phone: '123' }).phone).toBe(PERSON_FORM_MESSAGES.phoneInvalid);
  });

  it('accepts a Uruguayan landline', () => {
    expect(personFormErrors(PERSON_KINDS.contact, { ...VALID_PICKUP, phone: '2222 2224' }).phone).toBeUndefined();
  });

  it('requires the cédula with its check digit for a pickup person', () => {
    expect(personFormErrors(PERSON_KINDS.pickup, { ...VALID_PICKUP, nationalId: '4.876.543-1' }).nationalId).toBe(NATIONAL_ID_MESSAGES.wrongCheckDigit);
  });

  it('does not ask an emergency contact for a cédula', () => {
    expect(personFormErrors(PERSON_KINDS.contact, { ...VALID_PICKUP, nationalId: '' }).nationalId).toBeUndefined();
  });
});

describe('personRow', () => {
  it('trims the text and stores the phone in E.164', () => {
    expect(personRow(PERSON_KINDS.contact, { ...VALID_PICKUP, name: ' Ana Rodríguez ', relationship: ' Madre ' })).toEqual({
      name: 'Ana Rodríguez',
      relationship: 'Madre',
      phone: '+59899300120',
    });
  });

  it('stores an empty vínculo as null', () => {
    expect(personRow(PERSON_KINDS.contact, { ...VALID_PICKUP, relationship: '  ' }).relationship).toBeNull();
  });

  it('stores the cédula digits for a pickup person', () => {
    expect(personRow(PERSON_KINDS.pickup, VALID_PICKUP).national_id).toBe('48765438');
  });
});

describe('person lines', () => {
  it('joins the vínculo and the phone', () => {
    expect(personDetailLine({ id: 'c1', name: 'Ana', relationship: 'Madre', phone: '+59899123456' })).toBe('Madre · 099 123 456');
  });

  it('shows only the phone without a vínculo', () => {
    expect(personDetailLine({ id: 'c1', name: 'Ana', relationship: null, phone: '+59899123456' })).toBe('099 123 456');
  });

  it('masks the cédula until it is shown', () => {
    expect(personNationalIdLine('48765438', false)).toBe('CI •••••••-8');
  });

  it('shows the whole cédula when revealed', () => {
    expect(personNationalIdLine('48765438', true)).toBe('CI 4.876.543-8');
  });
});
