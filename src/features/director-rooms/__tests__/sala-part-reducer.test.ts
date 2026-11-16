import { INITIAL_SALA_PART_STATE, SALA_PART_ACTIONS, SALA_PARTS, salaPartReducer } from '../sala-part-reducer';

describe('salaPartReducer', () => {
  it('opens on the rooms', () => {
    expect(INITIAL_SALA_PART_STATE.part).toBe(SALA_PARTS.ROOMS);
  });

  it('switches to the children', () => {
    expect(salaPartReducer(INITIAL_SALA_PART_STATE, { type: SALA_PART_ACTIONS.PART_CHOSEN, part: SALA_PARTS.CHILDREN })).toEqual({ part: SALA_PARTS.CHILDREN });
  });
});
