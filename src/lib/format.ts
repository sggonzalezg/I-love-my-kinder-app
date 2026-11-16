export function badgeText(count: number): string | null {
  if (count <= 0) return null;
  return count > 9 ? '9+' : String(count);
}

export function bellLabel(unread: number): string {
  return unread > 0 ? `Avisos, ${unread} sin leer` : 'Avisos';
}

export function chatIconLabel(unreadThreads: number): string {
  return unreadThreads > 0 ? `Chat, ${unreadThreads} con mensajes sin leer` : 'Chat';
}

export function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function initials(first: string, last = ''): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

const RELATIONSHIPS: Record<string, { chip: string; short: string; formal: string }> = {
  mother: { chip: 'Madre', short: 'mamá', formal: 'madre' },
  father: { chip: 'Padre', short: 'papá', formal: 'padre' },
  tutor: { chip: 'Tutor', short: 'tutor', formal: 'tutor' },
  grandmother: { chip: 'Abuela', short: 'abuela', formal: 'abuela' },
  grandfather: { chip: 'Abuelo', short: 'abuelo', formal: 'abuelo' },
};

export function relationshipLabel(relationship: string): string {
  return RELATIONSHIPS[relationship]?.chip ?? relationship;
}

/** The everyday word: "mamá", "papá". */
export function relationshipShortWord(relationship: string): string {
  return RELATIONSHIPS[relationship]?.short ?? relationship.toLowerCase();
}

/** The word a signature uses: "Ana Rodríguez (madre)". */
export function relationshipWord(relationship: string): string {
  return RELATIONSHIPS[relationship]?.formal ?? relationship.toLowerCase();
}
