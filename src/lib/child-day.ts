import { MEAL_TIMES } from '@/constants/routine';

import type { RosterTeacher } from '@/data/family-room';

import { WEEKDAYS, dayChipLabel, formatDbTime, formatTime, toIsoDate } from './dates';
import { initials } from './format';
import type { ChildGroup } from './room-groups';
import {
  AMOUNT_DOTS,
  AMOUNT_LABELS,
  HYGIENE_TYPE_LABELS,
  MEAL_LABELS,
  type HygieneEntry,
  type HygieneKind,
  type MealAmount,
  type MealKey,
} from './routine';
import { currentShift, shiftBandTitle, shiftLabel, type ShiftName } from './shift';

export interface DayGroup extends ChildGroup {
  key: string;
  startTime: string;
  endTime: string;
}

type Meals = Partial<Record<MealKey, MealAmount>>;

/** Shape written by save-routine: each corrected field keeps its value before the correction. */
export type PreviousValues = { meals?: { previous_value?: Meals | null } };

export interface DayRoutine {
  roomId: string;
  shiftId: string;
  meals: Meals;
  restStart: string | null;
  restEnd: string | null;
  noSleep: boolean;
  hygiene: HygieneEntry[];
  notes: string | null;
  previousValues: PreviousValues;
  createdAt: string;
  correctedAt: string | null;
}

export interface GroupTeacher {
  label: string;
  initials: string;
  photoPath: string | null;
}

export interface StripDay {
  isoDate: string;
  date: Date;
  label: string;
}

export interface MealRow {
  key: MealKey;
  time: string;
  label: string;
  amount: string;
  dots: number;
  updated: string | null;
}

export interface TimeRow {
  time: string;
  label: string;
}

export interface HygieneBlock {
  kind: HygieneKind;
  title: string;
  count: string;
  rows: TimeRow[];
}

const TEACHER_ROLE = 'Maestra';
const MEAL_ORDER: MealKey[] = ['breakfast', 'lunch', 'snack'];
const SHIFT_ORDER: ShiftName[] = ['morning', 'afternoon'];
const HYGIENE_ORDER: HygieneKind[] = ['diaper', 'bathroom'];
const MINUTES_PER_HOUR = 60;
const DEFAULT_TEACHER = 'La maestra';

const HYGIENE_BLOCK_TITLES: Record<HygieneKind, string> = { diaper: 'Pañales', bathroom: 'Baño' };
const HYGIENE_COUNT: Record<HygieneKind, (count: number) => string> = {
  diaper: (count) => (count === 1 ? '1 cambio' : `${count} cambios`),
  bathroom: (count) => (count === 1 ? '1 vez' : `${count} veces`),
};

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * MINUTES_PER_HOUR + minutes;
}

function timeOf(iso: string): string {
  return formatTime(new Date(iso));
}

export function dayStrip(today: Date, count: number): StripDay[] {
  return Array.from({ length: count }, (_, daysBack) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysBack);
    return { isoDate: toIsoDate(date), date, label: dayChipLabel(date, today) };
  });
}

/** The child's open groups plus any group a routine of that day was saved in (a past day before a move). */
export function dayGroups(openGroups: DayGroup[], routineGroups: DayGroup[]): DayGroup[] {
  const byKey = new Map<string, DayGroup>();
  for (const group of [...openGroups, ...routineGroups]) if (!byKey.has(group.key)) byKey.set(group.key, group);
  return [...byKey.values()].sort((a, b) => SHIFT_ORDER.indexOf(a.shift) - SHIFT_ORDER.indexOf(b.shift));
}

export function initialGroupKey(groups: DayGroup[], now: Date): string | null {
  const shift = currentShift(now);
  return (groups.find((group) => group.shift === shift) ?? groups[0])?.key ?? null;
}

export function bandLine(group: DayGroup, teacherLabel: string | null, withRoom: boolean): string {
  const hours = `${formatDbTime(group.startTime)} a ${formatDbTime(group.endTime)}`;
  return [withRoom ? group.roomName : null, hours, teacherLabel].filter(Boolean).join(' · ');
}

export function restDuration(start: string | null, end: string | null): { value: string; unit: string } | null {
  if (!start || !end) return null;
  const total = toMinutes(end) - toMinutes(start);
  const hours = Math.floor(total / MINUTES_PER_HOUR);
  const minutes = total % MINUTES_PER_HOUR;
  if (hours === 0) return { value: String(minutes), unit: 'min' };
  if (minutes === 0) return { value: String(hours), unit: 'h' };
  return { value: `${hours} h ${minutes}`, unit: 'min' };
}

export function mealRows(routine: DayRoutine): MealRow[] {
  const previous = routine.previousValues.meals?.previous_value ?? {};
  return MEAL_ORDER.flatMap((key) => {
    const amount = routine.meals[key];
    if (!amount) return [];
    const before = previous[key];
    const updated = routine.correctedAt && before && before !== amount ? `Actualizado ${timeOf(routine.correctedAt)} · antes "${AMOUNT_LABELS[before]}"` : null;
    return [{ key, time: MEAL_TIMES[key], label: MEAL_LABELS[key], amount: AMOUNT_LABELS[amount], dots: AMOUNT_DOTS[amount], updated }];
  });
}

export function hygieneBlocks(entries: HygieneEntry[]): HygieneBlock[] {
  return HYGIENE_ORDER.flatMap((kind) => {
    const ofKind = entries.filter((entry) => entry.kind === kind).sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
    if (ofKind.length === 0) return [];
    const rows = ofKind.map((entry) => ({ time: formatDbTime(entry.time), label: HYGIENE_TYPE_LABELS[entry.type] }));
    return [{ kind, title: HYGIENE_BLOCK_TITLES[kind], count: HYGIENE_COUNT[kind](ofKind.length), rows }];
  });
}

export function hasRest(routine: DayRoutine): boolean {
  return routine.noSleep || routine.restStart !== null;
}

export function routineEntryCount(routine: DayRoutine): number {
  return Object.keys(routine.meals).length + routine.hygiene.length + (hasRest(routine) ? 1 : 0) + (routine.notes ? 1 : 0);
}

export function sealTitle(teacherLabel: string | null, shift: ShiftName): string {
  return `${teacherLabel ?? DEFAULT_TEACHER} firmó el ${shiftBandTitle(shift).toLowerCase()}`;
}

function relativeDay(day: Date, today: Date): string {
  const label = dayChipLabel(day, today);
  return label === 'Hoy' || label === 'Ayer' ? label : WEEKDAYS[day.getDay()];
}

export function sealLine(routine: DayRoutine, day: Date, today: Date): string {
  const signed = `${relativeDay(day, today)} a las ${timeOf(routine.createdAt)}`;
  if (routine.correctedAt) return `${signed} · actualizado a las ${timeOf(routine.correctedAt)}`;
  const count = routineEntryCount(routine);
  return `${signed} · ${count} ${count === 1 ? 'registro' : 'registros'}`;
}

export function notYetLine(firstName: string, group: DayGroup): string {
  return `Te avisamos apenas esté. ${firstName} va en el turno ${shiftLabel(group.shift).toLowerCase()}: suele estar a las ${formatDbTime(group.endTime)}.`;
}

export function emptyDayTitle(day: Date): string {
  return `No hay registro del ${WEEKDAYS[day.getDay()].toLowerCase()}`;
}

export function savedTimeOf(routine: DayRoutine): string {
  return timeOf(routine.createdAt);
}

/** Families cannot read who saved a routine (teachers RLS), so the day names the group's teacher from the roster. */
export function groupTeacher(teachers: RosterTeacher[]): GroupTeacher | null {
  const teacher = teachers.find((member) => member.role === TEACHER_ROLE);
  if (!teacher) return null;
  return { label: `${TEACHER_ROLE} ${teacher.first_name}`, initials: initials(teacher.first_name, teacher.last_name), photoPath: teacher.photo_path };
}
