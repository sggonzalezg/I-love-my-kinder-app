export function badgeText(count: number): string | null {
  if (count <= 0) return null;
  return count > 9 ? '9+' : String(count);
}

export function bellLabel(unread: number): string {
  return unread > 0 ? `Avisos, ${unread} sin leer` : 'Avisos';
}

export function initials(first: string, last = ''): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

const RELATIONSHIPS: Record<string, { chip: string; short: string }> = {
  mother: { chip: 'Madre', short: 'mamá' },
  father: { chip: 'Padre', short: 'papá' },
  tutor: { chip: 'Tutor', short: 'tutor' },
  grandmother: { chip: 'Abuela', short: 'abuela' },
  grandfather: { chip: 'Abuelo', short: 'abuelo' },
};

export function relationshipLabel(relationship: string): string {
  return RELATIONSHIPS[relationship]?.chip ?? relationship;
}

type Sender =
  | { role: 'family'; name: string; relationship: string; childFirstName: string; childVisible: boolean }
  | { role: 'teacher' | 'assistant' | 'director'; name: string };

/** consent-texts.md 7.3: the child's first name only with the visibility authorization. */
export function senderLabel(sender: Sender): string {
  switch (sender.role) {
    case 'director':
      return 'Dirección';
    case 'teacher':
      return `${sender.name} · Maestra`;
    case 'assistant':
      return `${sender.name} · Asistente`;
    case 'family': {
      if (!sender.childVisible) return `${sender.name}, familia`;
      const short = RELATIONSHIPS[sender.relationship]?.short ?? sender.relationship.toLowerCase();
      return `${sender.name}, ${short} de ${sender.childFirstName}`;
    }
  }
}
