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

type Target = { childId: string; roomId: string; shiftId: string };

// shortcut: the backend has one `meals` column and no 'dry' hygiene type; we send the main meal
// (last of the shift) plus `mealDetails`, and drop 'dry'. Upgrade when backend stores meals per item.
export function toSavePayload(draft: RoutineDraft, target: Target) {
  const keys = mealsForShift(draft.shift);
  const main = keys[keys.length - 1];
  return {
    ...target,
    meals: draft.meals[main] ?? 'all',
    mealDetails: draft.meals,
    restStart: draft.noRest ? null : draft.restStart,
    restEnd: draft.noRest ? null : draft.restEnd,
    hygiene: draft.hygiene.filter((h) => h.type !== 'dry'),
    notes: draft.notes.trim() || null,
  };
}

export function nextPendingIndex(logged: boolean[]): number {
  return logged.findIndex((l) => !l);
}

export function progressLabel(done: number, total: number): string {
  return `${done} de ${total}`;
}
