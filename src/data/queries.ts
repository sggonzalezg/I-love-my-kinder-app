import type { ShiftName } from '@/lib/shift';

export interface Child {
  id: string;
  name: string;
  photo_url?: string;
  room: string;
  shift: ShiftName;
  second_shift?: ShiftName;
  birthday?: string; // YYYY-MM-DD
  status: 'enrolled' | 'withdrawn';
}

export interface RoutineEntry {
  id: string;
  type: 'meal' | 'nap' | 'hygiene';
  value: string; // meal name, nap time or diaper/toilet
  time?: string; // HH:mm
  notes?: string;
  signed_by?: string;
  signed_at?: string; // ISO datetime
}

export interface Routine {
  id: string;
  child_id: string;
  date: string; // ISO date
  shift: ShiftName;
  entries: RoutineEntry[];
  photo_url?: string;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

// Mock children for development
export const mockChildren: Child[] = [
  {
    id: 'child-1',
    name: 'Mateo',
    room: 'Sala 2',
    shift: 'morning',
    second_shift: 'afternoon',
    birthday: '2023-06-15',
    status: 'enrolled',
  },
  {
    id: 'child-2',
    name: 'Ana',
    room: 'Sala 2',
    shift: 'morning',
    status: 'enrolled',
  },
];

export const mockRoutines: Routine[] = [
  {
    id: 'routine-1',
    child_id: 'child-1',
    date: new Date().toISOString().split('T')[0],
    shift: 'morning',
    entries: [
      {
        id: 'entry-1',
        type: 'meal',
        value: 'Desayuno',
        time: '08:30',
        signed_by: 'Maestra Sofía',
        signed_at: new Date().toISOString(),
      },
      {
        id: 'entry-2',
        type: 'nap',
        value: 'Se durmió',
        time: '11:00',
        signed_by: 'Maestra Sofía',
        signed_at: new Date().toISOString(),
      },
      {
        id: 'entry-3',
        type: 'hygiene',
        value: 'Pañal',
        time: '12:30',
        signed_by: 'Maestra Sofía',
        signed_at: new Date().toISOString(),
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function getChildrenForFamily(): Child[] {
  return mockChildren;
}

export function getRoutineForChildDate(childId: string, date: string): Routine | undefined {
  return mockRoutines.find((r) => r.child_id === childId && r.date === date);
}

export function getTodayRoutine(childId: string): Routine | undefined {
  const today = new Date().toISOString().split('T')[0];
  return getRoutineForChildDate(childId, today);
}

