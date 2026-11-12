export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  imageUrl?: string;
  group?: string;
  disabledReason?: string;
}

export type SelectRow = { kind: 'group'; title: string } | { kind: 'option'; option: SelectOption };

export interface SelectState {
  isOpen: boolean;
  query: string;
}

export const SELECT_ACTIONS = {
  OPENED: 'opened',
  CLOSED: 'closed',
  QUERY_CHANGED: 'queryChanged',
  OPTION_CHOSEN: 'optionChosen',
} as const;

export type SelectAction =
  | { type: typeof SELECT_ACTIONS.OPENED }
  | { type: typeof SELECT_ACTIONS.CLOSED }
  | { type: typeof SELECT_ACTIONS.OPTION_CHOSEN }
  | { type: typeof SELECT_ACTIONS.QUERY_CHANGED; query: string };

export const INITIAL_SELECT_STATE: SelectState = { isOpen: false, query: '' };

const SEARCH_OPTION_THRESHOLD = 8;
const COMBINING_MARKS = /[̀-ͯ]/g;

export function selectReducer(state: SelectState, action: SelectAction): SelectState {
  switch (action.type) {
    case SELECT_ACTIONS.OPENED:
      return { isOpen: true, query: '' };
    case SELECT_ACTIONS.QUERY_CHANGED:
      return { ...state, query: action.query };
    case SELECT_ACTIONS.CLOSED:
    case SELECT_ACTIONS.OPTION_CHOSEN:
      return INITIAL_SELECT_STATE;
  }
}

function foldForSearch(text: string): string {
  return text.normalize('NFD').replace(COMBINING_MARKS, '').toLowerCase();
}

function matchesQuery(option: SelectOption, foldedQuery: string): boolean {
  return foldForSearch(`${option.label} ${option.description ?? ''}`).includes(foldedQuery);
}

/** Options that match the query, with each group's name before its first remaining option. */
export function buildSelectRows(options: SelectOption[], query: string): SelectRow[] {
  const foldedQuery = foldForSearch(query.trim());
  const rows: SelectRow[] = [];
  let currentGroup: string | undefined;
  for (const option of options) {
    if (!matchesQuery(option, foldedQuery)) continue;
    if (option.group && option.group !== currentGroup) rows.push({ kind: 'group', title: option.group });
    currentGroup = option.group;
    rows.push({ kind: 'option', option });
  }
  return rows;
}

export function shouldShowSearch(options: SelectOption[], searchable?: boolean): boolean {
  return searchable ?? options.length > SEARCH_OPTION_THRESHOLD;
}

/** A filter chip filters while its value is not the first option ("Todas las salas"). */
export function isFilteringValue(options: SelectOption[], value: string | null): boolean {
  return value !== null && options.length > 0 && options[0].value !== value;
}
