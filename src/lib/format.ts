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

/** The word a signature uses: "Ana Rodríguez (madre)". */
export function relationshipWord(relationship: string): string {
  return RELATIONSHIPS[relationship]?.formal ?? relationship.toLowerCase();
}

type Sender =
  | { role: 'family'; name: string; relationship: string; childFirstName: string; childVisible: boolean }
  | { role: 'teacher' | 'assistant' | 'director'; name: string };

/** The child's first name appears only with the visibility authorization (legal/consent-texts.md 7.3). */
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
