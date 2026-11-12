import type { ShiftName } from './shift';

export type MealKey = 'breakfast' | 'lunch' | 'snack';
export type MealAmount = 'all' | 'half' | 'little' | 'none';
export type HygieneKind = 'diaper' | 'bathroom';
export type HygieneType = 'pee' | 'poop' | 'dry';
export type HygieneEntry = { kind: HygieneKind; type: HygieneType; time: string };

export type RoutineDraft = {
  shift: ShiftName;
  meals: Partial<Record<MealKey, MealAmount>>;
  restStart: string | null;
  restEnd: string | null;
  noRest: boolean;
  hygieneKind: HygieneKind;
  hygiene: HygieneEntry[];
  notes: string;
};

export const MEAL_LABELS: Record<MealKey, string> = { breakfast: 'Desayuno', lunch: 'Almuerzo', snack: 'Merienda' };
export const AMOUNT_LABELS: Record<MealAmount, string> = { all: 'Todo', half: 'La mitad', little: 'Poco', none: 'Nada' };
export const AMOUNT_DOTS: Record<MealAmount, number> = { all: 4, half: 2, little: 1, none: 0 };
export const HYGIENE_TYPE_LABELS: Record<HygieneType, string> = { pee: 'Pis', poop: 'Caca', dry: 'Seco' };
export const HYGIENE_KIND_LABELS: Record<HygieneKind, string> = { diaper: 'Pañal', bathroom: 'Baño' };

export function mealsForShift(shift: ShiftName): MealKey[] {
  return shift === 'morning' ? ['breakfast', 'lunch'] : ['snack'];
}

export function defaultDraft(shift: ShiftName, lastHygieneKind: HygieneKind | null): RoutineDraft {
  return {
    shift,
    meals: Object.fromEntries(mealsForShift(shift).map((m) => [m, 'all'])),
    restStart: null,
    restEnd: null,
    noRest: false,
    hygieneKind: lastHygieneKind ?? 'diaper',
    hygiene: [],
    notes: '',
  };
}

export function addHygiene(draft: RoutineDraft, entry: HygieneEntry): RoutineDraft {
  const hygiene = [...draft.hygiene, entry].sort((a, b) => a.time.localeCompare(b.time));
  return { ...draft, hygiene };
}

export function removeHygiene(draft: RoutineDraft, index: number): RoutineDraft {
  return { ...draft, hygiene: draft.hygiene.filter((_, i) => i !== index) };
}

export type RoutineTarget = { childId: string; roomId: string; shiftId: string; routineDate: string };

export type SaveRoutinePayload = RoutineTarget & {
  meals: Partial<Record<MealKey, MealAmount>>;
  rest: { start: string | null; end: string | null; noSleep: boolean };
  hygiene: HygieneEntry[];
  notes: string | null;
};

export interface SavedRoutine {
  meals: Partial<Record<MealKey, MealAmount>> | null;
  rest_start_time: string | null;
  rest_end_time: string | null;
  no_sleep: boolean | null;
  hygiene_entries: HygieneEntry[] | null;
  notes: string | null;
}

export function toSavePayload(draft: RoutineDraft, target: RoutineTarget): SaveRoutinePayload {
  return {
    ...target,
    meals: draft.meals,
    rest: { start: draft.noRest ? null : draft.restStart, end: draft.noRest ? null : draft.restEnd, noSleep: draft.noRest },
    hygiene: draft.hygiene,
    notes: draft.notes.trim() || null,
  };
}

export function hasRestRangeError(draft: RoutineDraft): boolean {
  if (draft.noRest || !draft.restStart || !draft.restEnd) return false;
  return draft.restEnd <= draft.restStart;
}

function toHourMinute(time: string | null): string | null {
  return time ? time.slice(0, 5) : null;
}

export function lastHygieneKind(entries: HygieneEntry[]): HygieneKind | null {
  return entries.length ? entries[entries.length - 1].kind : null;
}

export function draftFromRoutine(routine: SavedRoutine, shift: ShiftName): RoutineDraft {
  const hygiene = routine.hygiene_entries ?? [];
  return {
    shift,
    meals: routine.meals ?? {},
    restStart: toHourMinute(routine.rest_start_time),
    restEnd: toHourMinute(routine.rest_end_time),
    noRest: routine.no_sleep ?? false,
    hygieneKind: lastHygieneKind(hygiene) ?? 'diaper',
    hygiene,
    notes: routine.notes ?? '',
  };
}

export function nextPendingIndex(logged: boolean[]): number {
  return logged.findIndex((l) => !l);
}

export function progressLabel(done: number, total: number): string {
  return `${done} de ${total}`;
}
