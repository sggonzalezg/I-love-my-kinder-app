import { initials } from './format';

export interface ClassmateNameParts {
  first_name: string;
  last_name: string;
}

export function classmateName({ first_name, last_name }: ClassmateNameParts): string {
  return last_name ? `${first_name} ${last_name.charAt(0)}.` : first_name;
}

export function classmateInitials({ first_name, last_name }: ClassmateNameParts): string {
  return initials(first_name, last_name);
}
