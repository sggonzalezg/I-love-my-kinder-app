import { useReducer } from 'react';

import { SegmentedControl } from '@/components/segmented-control';
import { DirectorChildrenScreen } from '@/features/director-children/screens/DirectorChildrenScreen';
import { DIRECTOR_ROOMS_COPY } from '@/features/director-rooms/director-rooms-copy';
import { INITIAL_SALA_PART_STATE, SALA_PART_ACTIONS, SALA_PARTS, salaPartReducer, type SalaPart } from '@/features/director-rooms/sala-part-reducer';
import { DirectorRoomsScreen } from '@/features/director-rooms/screens/DirectorRoomsScreen';

// shortcut: Familias and Maestras join the switch with D7 and D8 (steps 17e, 17f), so no part leads nowhere.
const PART_OPTIONS: { label: string; value: SalaPart }[] = [
  { label: DIRECTOR_ROOMS_COPY.partRooms, value: SALA_PARTS.ROOMS },
  { label: DIRECTOR_ROOMS_COPY.partChildren, value: SALA_PARTS.CHILDREN },
];

export function DirectorSalaScreen() {
  const [state, dispatch] = useReducer(salaPartReducer, INITIAL_SALA_PART_STATE);
  const partSwitch = (
    <SegmentedControl options={PART_OPTIONS} value={state.part} onChange={(part) => dispatch({ type: SALA_PART_ACTIONS.PART_CHOSEN, part: part as SalaPart })} />
  );

  if (state.part === SALA_PARTS.CHILDREN) return <DirectorChildrenScreen partSwitch={partSwitch} />;
  return <DirectorRoomsScreen partSwitch={partSwitch} />;
}
