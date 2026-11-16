export const FIRST_SIGN_IN_COPY = {
  title: (childFirstName: string) => `Autorizaciones de ${childFirstName}`,
  lede: 'Para cada hijo, el jardín necesita saber qué autorizás. Respondé Sí o No en cada una: nada viene marcado. Podés cambiarlo cuando quieras en Perfil.',
  later: 'Después',
  next: (childFirstName: string) => `Siguiente: ${childFirstName}`,
  done: 'Listo',
  stepOf: (stepNumber: number, stepCount: number) => `Hijo ${stepNumber} de ${stepCount}`,
  backTo: (childFirstName: string) => `Volver a ${childFirstName}`,
  photo: (childFirstName: string) => `Foto de ${childFirstName}`,
  saved: 'Guardado',
  loadError: 'No pudimos cargar las autorizaciones.',
  retry: 'Reintentar',
};
