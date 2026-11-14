import type { PermissionRowStatus } from '@/lib/outing-permissions';

export const OUTING_PERMISSIONS_COPY = {
  title: 'Permisos',
  back: 'Volver a la salida',
  filters: 'Filtrar por respuesta',
  tileAuthorized: 'Autorizaron',
  tileDeclined: 'No autorizan',
  tilePending: 'Sin responder',
  onePermissionPerChild:
    'Un permiso por niño: alcanza con que responda uno de los adultos a cargo, y al otro ya le aparece resuelto. Cada niño cuenta una sola vez y todas las respuestas quedan en su historial.',
  everyoneAnswered: 'Todas las familias respondieron',
  loadError: 'No pudimos cargar los permisos.',
  notFound: 'No encontramos esta salida.',
  retry: 'Reintentar',
} as const;

export const PERMISSION_ROW_CHIPS: Record<PermissionRowStatus, string> = {
  authorized: 'Autorizó',
  declined: 'No autoriza',
  withdrawn: 'Retirado',
  pending: 'Sin responder',
};
