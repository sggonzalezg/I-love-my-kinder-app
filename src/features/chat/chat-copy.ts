import type { LegalDocKey } from '@/legal/documents.generated';
import { formatDbTime } from '@/lib/dates';
import type { WorkHours } from '@/lib/chat';

export const CHAT_COPY = {
  title: 'Chat',
  backToToday: 'Volver a Hoy',
  backToChats: 'Volver al chat',
  continue: 'Continuar',
  noticeSaveError: 'No pudimos guardar tu respuesta. Probá de nuevo.',
  loadError: 'No pudimos cargar el chat. Probá de nuevo.',
  retry: 'Reintentar',
  noThreadsTitle: 'Todavía no estás en ningún chat de sala',
  noThreadsBody: 'Cuando estés en una sala y turno, vas a ver su chat acá.',
  emptyTitle: 'Todavía no hay mensajes',
  emptyBody: (familyCount: number) =>
    `Es el chat de toda la sala: lo que escribas lo leen ${familyCount === 1 ? 'la familia' : `las ${familyCount} familias`}, las maestras y la dirección.`,
  inputPlaceholder: 'Escribí un mensaje',
  inputLabel: 'Mensaje para la sala',
  send: 'Enviar',
  sending: 'Enviando…',
  failed: 'No se mandó · Reintentar',
  seenBy: (count: number) => `Visto por ${count}`,
  offline: 'Sin conexión. Se ve lo último que cargó.',
  offHours: (hours: WorkHours) =>
    `Estás fuera de tu horario de trabajo (${formatDbTime(hours.start)} a ${formatDbTime(hours.end)}). No recibís notificaciones del chat.`,
  unavailableTitle: 'Este chat ya no está disponible',
  unavailableBody: {
    family: 'Ninguno de tus hijos está ahora en esa sala y turno. Tus chats de sala están en la lista.',
    teacher: 'Ya no estás asignada a esa sala y turno. Por dudas, hablá con la dirección.',
    director: 'Esa sala y turno ya no existe.',
  },
  seeMyChats: 'Ver mis chats',
  membersTitleHint: 'Lo leen todas estas personas',
  membersStaff: 'Maestras y dirección',
  membersFamilies: (count: number) => `Familias (${count})`,
  membersFamiliesNote: 'Todas las familias de los niños de esta sala y turno.',
  direction: 'Dirección',
  close: 'Cerrar',
  openMembers: 'Ver quiénes están en el chat',
  callUrgent: 'Llamar por una urgencia',
  unreadLabel: (count: number) => `${count} sin leer`,
} as const;

export const NOTICE_LINKS: Record<string, LegalDocKey> = {
  'Política de uso del chat del Jardín': 'teacherChat',
  'Política de privacidad': 'privacy',
};

export const NOTICE_SCREEN = { family: 'F13', teacher: 'T12' } as const;
