import type { AuthorizationKey } from '@/lib/authorizations';

export const DIRECTOR_CHILDREN_COPY = {
  searchPlaceholder: 'Buscar niño',
  roomFilter: 'Sala',
  allRooms: 'Todas',
  loadError: 'No pudimos cargar los niños.',
  retry: 'Reintentar',
  emptyTitle: 'Todavía no hay niños',
  emptyHint: 'Cuando cargues niños desde el panel, los vas a ver acá.',
  noResultsTitle: 'No encontramos a nadie',
  noResultsHint: 'Probá con otro nombre o con otra sala.',
  groupsSeparator: ', ',
  authorizationChips: { image: 'Redes', visibility: 'Visibilidad', health: 'Salud' } satisfies Record<AuthorizationKey, string>,
  authorizationState: (label: string, granted: boolean) => `${label}: ${granted ? 'sí' : 'no'}`,
} as const;
