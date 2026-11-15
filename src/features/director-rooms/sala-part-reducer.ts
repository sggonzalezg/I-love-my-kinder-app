export const SALA_PARTS = {
  ROOMS: 'rooms',
  CHILDREN: 'children',
} as const;

export type SalaPart = (typeof SALA_PARTS)[keyof typeof SALA_PARTS];

export interface SalaPartState {
  part: SalaPart;
}

export const INITIAL_SALA_PART_STATE: SalaPartState = { part: SALA_PARTS.ROOMS };

export const SALA_PART_ACTIONS = {
  PART_CHOSEN: 'partChosen',
} as const;

export type SalaPartAction = { type: typeof SALA_PART_ACTIONS.PART_CHOSEN; part: SalaPart };

export function salaPartReducer(state: SalaPartState, action: SalaPartAction): SalaPartState {
  switch (action.type) {
    case SALA_PART_ACTIONS.PART_CHOSEN:
      return { part: action.part };
  }
}
