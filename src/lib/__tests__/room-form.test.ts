import { canSaveRoom, roomRow } from '../room-form';

describe('canSaveRoom', () => {
  it('needs a name', () => {
    expect(canSaveRoom({ name: '', age: '5 años' })).toBe(false);
  });

  it('treats a name of only spaces as empty', () => {
    expect(canSaveRoom({ name: '   ', age: '' })).toBe(false);
  });

  it('saves with a name and no age', () => {
    expect(canSaveRoom({ name: 'Sala 5', age: '' })).toBe(true);
  });
});

describe('roomRow', () => {
  it('trims the name and keeps the age in description', () => {
    expect(roomRow({ name: '  Sala 5 ', age: ' 5 años ' })).toEqual({ name: 'Sala 5', description: '5 años' });
  });

  it('stores an empty age as no description', () => {
    expect(roomRow({ name: 'Sala 5', age: '  ' })).toEqual({ name: 'Sala 5', description: null });
  });
});
