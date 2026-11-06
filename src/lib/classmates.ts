import { initials } from './format';

export interface ClassmateNameParts {
  first_name: string | null;
  last_name: string | null;
  display_name: string;
}

/** Without the visibility authorization the server sends no name parts, only a masked display name. */
export function classmateName({ first_name, last_name, display_name }: ClassmateNameParts): string {
  if (!first_name) return display_name;
  return last_name ? `${first_name} ${last_name.charAt(0)}.` : first_name;
}

export function classmateInitials({ first_name, last_name, display_name }: ClassmateNameParts): string {
  if (!first_name) return display_name.replace(/[^\p{L}]/gu, '').toUpperCase();
  return initials(first_name, last_name ?? '');
}
