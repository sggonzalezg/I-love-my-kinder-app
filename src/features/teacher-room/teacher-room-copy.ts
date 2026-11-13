export const TEACHER_ROOM_COPY = {
  upcomingBirthdays: 'Próximos cumples',
  roomChildren: 'Niños de la sala',
  seeFile: 'Ver ficha',
  todayBirthday: (firstName: string) => `Hoy cumple ${firstName}`,
  birthdayPhoto: 'Torta de cumpleaños',
  noBirthdays: 'No hay cumples este mes',
  childRowLabel: (name: string, hasAllergy: boolean) => `${name}, ${hasAllergy ? 'alergia, ' : ''}ver ficha`,
} as const;
