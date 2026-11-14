export const DIRECTOR_TODAY_COPY = {
  title: 'Hoy',
  loggedOf: (total: number) => `de ${total} con el día cargado`,
  noTeacher: 'Sin maestra',
  loadError: 'No pudimos cargar el día de las salas.',
  retry: 'Reintentar',
  emptyTitle: 'Todavía no hay niños en las salas.',
  emptyHint: 'Cuando haya niños en una sala, acá vas a ver cuántos tienen el día cargado.',
  showMissing: 'Ver quiénes faltan',
  hideMissing: 'Ocultar quiénes faltan',
} as const;
