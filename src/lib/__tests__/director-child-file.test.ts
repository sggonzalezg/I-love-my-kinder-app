import {
  CHILD_FILE_PARTS,
  birthDateText,
  changedChildColumns,
  childFileErrors,
  initialChildFileValues,
  isHealthGranted,
  savesWithActionBar,
  type DirectorChildFile,
} from '../director-child-file';
import { NEW_CHILD_MESSAGES } from '../new-child-form';

const TODAY = new Date(2026, 10, 15);

const FILE: DirectorChildFile = {
  id: 'child-1',
  firstName: 'Mateo',
  lastName: 'Rodríguez',
  birthDate: '2023-05-12',
  allergies: 'Proteína de leche de vaca.',
  photoPath: null,
  healthGranted: true,
};

describe('birthDateText', () => {
  it('writes a stored day as dd/mm/yyyy', () => {
    expect(birthDateText('2023-05-02')).toBe('02/05/2023');
  });

  it('is empty when there is no birth date', () => {
    expect(birthDateText(null)).toBe('');
  });
});

describe('initialChildFileValues', () => {
  it('fills the form from the stored child', () => {
    expect(initialChildFileValues(FILE)).toEqual({ firstName: 'Mateo', lastName: 'Rodríguez', birthDate: '12/05/2023', allergies: 'Proteína de leche de vaca.' });
  });

  it('uses empty text for missing fields', () => {
    const values = initialChildFileValues({ ...FILE, lastName: null, birthDate: null, allergies: null });

    expect([values.lastName, values.birthDate, values.allergies]).toEqual(['', '', '']);
  });
});

describe('childFileErrors', () => {
  it('checks the names and the birth date on Datos', () => {
    const errors = childFileErrors(CHILD_FILE_PARTS.data, { ...initialChildFileValues(FILE), firstName: ' ', birthDate: '12/05/2030' }, TODAY);

    expect(errors).toEqual({ firstName: NEW_CHILD_MESSAGES.firstNameMissing, birthDate: NEW_CHILD_MESSAGES.birthDateFuture });
  });

  it('does not check Datos while saving Salud', () => {
    const errors = childFileErrors(CHILD_FILE_PARTS.health, { ...initialChildFileValues(FILE), firstName: '' }, TODAY);

    expect(errors).toEqual({});
  });
});

describe('changedChildColumns', () => {
  it('returns only the changed Datos columns, trimmed', () => {
    const columns = changedChildColumns(CHILD_FILE_PARTS.data, FILE, { ...initialChildFileValues(FILE), firstName: ' Mateo José ', birthDate: '1/6/2023' });

    expect(columns).toEqual({ first_name: 'Mateo José', birth_date: '2023-06-01' });
  });

  it('leaves the allergies out when saving Datos', () => {
    const columns = changedChildColumns(CHILD_FILE_PARTS.data, FILE, { ...initialChildFileValues(FILE), allergies: 'Ninguna' });

    expect(columns).toEqual({});
  });

  it('stores emptied allergies as null', () => {
    const columns = changedChildColumns(CHILD_FILE_PARTS.health, FILE, { ...initialChildFileValues(FILE), allergies: '  ' });

    expect(columns).toEqual({ allergies: null });
  });

  it('is empty when nothing changed', () => {
    expect(changedChildColumns(CHILD_FILE_PARTS.health, FILE, initialChildFileValues(FILE))).toEqual({});
  });
});

describe('isHealthGranted', () => {
  it('follows the latest health record', () => {
    const records = [
      { document_type: 'auth_health', accepted: true, created_at: '2026-01-01T10:00:00Z' },
      { document_type: 'auth_health', accepted: false, created_at: '2026-03-01T10:00:00Z' },
    ];

    expect(isHealthGranted(records)).toBe(false);
  });

  it('is not granted without records', () => {
    expect(isHealthGranted([])).toBe(false);
  });
});

describe('savesWithActionBar', () => {
  it('saves Datos with the action bar', () => {
    expect(savesWithActionBar(CHILD_FILE_PARTS.data, false)).toBe(true);
  });

  it('saves Salud only with the health authorization', () => {
    expect([savesWithActionBar(CHILD_FILE_PARTS.health, true), savesWithActionBar(CHILD_FILE_PARTS.health, false)]).toEqual([true, false]);
  });

  it('leaves Contactos and Retiran to their own form', () => {
    expect([savesWithActionBar(CHILD_FILE_PARTS.contacts, true), savesWithActionBar(CHILD_FILE_PARTS.pickup, true)]).toEqual([false, false]);
  });
});
