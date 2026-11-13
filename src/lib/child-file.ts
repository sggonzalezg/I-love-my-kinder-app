import { NATIONAL_ID_MASK, PART_SEPARATOR } from '@/constants/child-file';

import { fromIsoDate } from './dates';

const MONTHS_PER_YEAR = 12;
const THOUSANDS_GROUP = /\B(?=(\d{3})+(?!\d))/g;

export type AllergyState = 'notAuthorized' | 'none' | 'listed';

/** Allergies are health data: shown only with the child's `auth_health` (design T3, legal Ley 18.331 art. 18). */
export function allergyState(allergies: string | null, healthGranted: boolean): AllergyState {
  if (!healthGranted) return 'notAuthorized';
  return allergies?.trim() ? 'listed' : 'none';
}

function monthsBetween(birth: Date, today: Date): number {
  const months = (today.getFullYear() - birth.getFullYear()) * MONTHS_PER_YEAR + today.getMonth() - birth.getMonth();
  return today.getDate() < birth.getDate() ? months - 1 : months;
}

export function ageLabel(birthDate: string, today: Date): string {
  const months = monthsBetween(fromIsoDate(birthDate), today);
  if (months < MONTHS_PER_YEAR) return months === 1 ? '1 mes' : `${months} meses`;
  const years = Math.floor(months / MONTHS_PER_YEAR);
  return years === 1 ? '1 año' : `${years} años`;
}

export function detailLine(parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(PART_SEPARATOR);
}

export function childFileSubtitle(groupLabels: string[], birthDate: string | null, today: Date): string {
  return detailLine([...groupLabels, birthDate ? ageLabel(birthDate, today) : null]);
}

export function formatNationalId(nationalId: string): string {
  const body = nationalId.slice(0, -1).replace(THOUSANDS_GROUP, '.');
  return `${body}-${nationalId.slice(-1)}`;
}

export function maskNationalId(nationalId: string): string {
  return `${NATIONAL_ID_MASK}-${nationalId.slice(-1)}`;
}
