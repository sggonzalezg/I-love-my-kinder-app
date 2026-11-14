export const DIRECTOR_ROOMS_COPY = {
  title: 'Sala',
  loadError: 'No pudimos cargar las salas.',
  retry: 'Reintentar',
  emptyTitle: 'Todavía no hay salas',
  emptyHint: 'Creá la primera desde el panel.',
  noTeacher: 'Sin maestra',
  back: 'Volver a salas',
  teachers: 'Maestras',
  children: 'Niños',
  groupLoadError: 'No pudimos cargar el grupo.',
  groupRowLabel: (label: string, meta: string, hasNoTeacher: boolean) => `${label}, ${meta}${hasNoTeacher ? ', sin maestra' : ''}`,
} as const;
