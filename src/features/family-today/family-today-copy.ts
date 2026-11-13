export const FAMILY_TODAY_COPY = {
  logo: 'I love my kinder',
  dayReady: 'Día listo',
  dayNotYet: 'Todavía no',
  readOnly: 'Solo lectura',
  readOnlyLine: (firstName: string) => `${firstName} ya no está en el jardín. Podés seguir viendo las fotos, los avisos y los eventos que recibiste.`,
  kidPhoto: (firstName: string) => `Foto de ${firstName}`,
  nextEvent: 'Próximo en el jardín',
  seeCalendar: 'Ver calendario',
  offline: 'Sin conexión. Te mostramos lo último que guardamos.',
  loadError: 'No pudimos cargar tus hijos.',
  retry: 'Reintentar',
  noChildren: 'Tu hijo no está inscripto en el jardín.',
} as const;
