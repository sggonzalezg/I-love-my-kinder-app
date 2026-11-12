import {
  INITIAL_SELECT_STATE,
  SELECT_ACTIONS,
  buildSelectRows,
  isFilteringValue,
  selectReducer,
  shouldShowSearch,
  type SelectOption,
} from '@/components/Select/select-reducer';

const ROOMS: SelectOption[] = [
  { value: 'all', label: 'Todas las salas' },
  { value: 'r1', label: 'Sala 1', group: 'Matutino' },
  { value: 'r2', label: 'Sala 2', group: 'Matutino', description: '14 niños · Maestra Lucía Ferreira' },
  { value: 'r3', label: 'Sala 3', group: 'Vespertino' },
];

describe('selectReducer', () => {
  it('starts closed with an empty query', () => {
    expect(INITIAL_SELECT_STATE).toEqual({ isOpen: false, query: '' });
  });

  it('opens with an empty query', () => {
    const state = selectReducer({ isOpen: false, query: 'old' }, { type: SELECT_ACTIONS.OPENED });

    expect(state).toEqual({ isOpen: true, query: '' });
  });

  it('keeps the typed query', () => {
    const state = selectReducer({ isOpen: true, query: '' }, { type: SELECT_ACTIONS.QUERY_CHANGED, query: 'rodri' });

    expect(state.query).toBe('rodri');
  });

  it('closes without changes', () => {
    const state = selectReducer({ isOpen: true, query: 'sala' }, { type: SELECT_ACTIONS.CLOSED });

    expect(state).toEqual({ isOpen: false, query: '' });
  });

  it('closes when an option is chosen', () => {
    const state = selectReducer({ isOpen: true, query: 'sala' }, { type: SELECT_ACTIONS.OPTION_CHOSEN });

    expect(state.isOpen).toBe(false);
  });
});

describe('buildSelectRows', () => {
  it('puts a group name before the first option of each group', () => {
    const rows = buildSelectRows(ROOMS, '');

    expect(rows.map((row) => (row.kind === 'group' ? `# ${row.title}` : row.option.value))).toEqual([
      'all',
      '# Matutino',
      'r1',
      'r2',
      '# Vespertino',
      'r3',
    ]);
  });

  it('finds options ignoring accents and case', () => {
    const people: SelectOption[] = [
      { value: 'a', label: 'Lucía Rodríguez' },
      { value: 'b', label: 'Bruno García' },
    ];

    const rows = buildSelectRows(people, 'rodriguez');

    expect(rows).toEqual([{ kind: 'option', option: people[0] }]);
  });

  it('finds options by their second line', () => {
    const rows = buildSelectRows(ROOMS, 'lucia');

    expect(rows.map((row) => row.kind === 'option' && row.option.value)).toEqual([false, 'r2']);
  });

  it('drops a group whose options are all filtered out', () => {
    const rows = buildSelectRows(ROOMS, 'sala 3');

    expect(rows).toEqual([
      { kind: 'group', title: 'Vespertino' },
      { kind: 'option', option: ROOMS[3] },
    ]);
  });

  it('returns nothing when no option matches', () => {
    expect(buildSelectRows(ROOMS, 'Rodrigo')).toEqual([]);
  });
});

describe('shouldShowSearch', () => {
  it('shows the search above eight options', () => {
    const nineOptions = Array.from({ length: 9 }, (_, index) => ({ value: `${index}`, label: `Sala ${index}` }));

    expect(shouldShowSearch(nineOptions)).toBe(true);
  });

  it('hides the search for short lists', () => {
    expect(shouldShowSearch(ROOMS)).toBe(false);
  });

  it('shows the search when the caller asks for it', () => {
    expect(shouldShowSearch(ROOMS, true)).toBe(true);
  });
});

describe('isFilteringValue', () => {
  it('is not filtering on the first option', () => {
    expect(isFilteringValue(ROOMS, 'all')).toBe(false);
  });

  it('is filtering on any other option', () => {
    expect(isFilteringValue(ROOMS, 'r2')).toBe(true);
  });
});
