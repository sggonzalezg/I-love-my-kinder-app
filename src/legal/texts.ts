// Verbatim from projects/i-love-my-kinder/legal/consent-texts.md v1.10 (04/11/2026).
// Do not reword: each acceptance points at the exact text and version the person saw.

export const NURSERY_NAME = 'I Love My Kinder';

export const CONSENT = {
  termsBefore: 'Leí y acepto los ',
  termsLink: 'Términos y condiciones',
  termsAfter: '.',
  privacyBefore: 'Leí la ',
  privacyLink: 'Política de privacidad',
  privacyAfter:
    ' y autorizo el tratamiento de mis datos personales para las finalidades que allí se indican, incluido el envío de mi teléfono y de las notificaciones a proveedores en Estados Unidos.',
  error: 'Necesitamos que aceptes para seguir',
  updated: (docName: string, date: string) => `Actualizamos ${docName} el ${date}. Leelo y aceptalo para seguir usando la app.`,
};

export const SAVE_MEDIA_NOTICE = {
  id: 'notice_save_media',
  version: '1.0',
  title: 'Estas fotos son para uso familiar. No las publiques ni compartas en redes.',
  body: 'En ellas aparecen otros niños. Lo que hagas con las copias guardadas es tu responsabilidad.',
  action: 'Entendido',
};

export const CHILD_AUTHORIZATIONS = {
  image: {
    id: 'auth_image',
    version: '2.1',
    title: 'Imagen en redes sociales',
    text: (child: string) =>
      `Como madre, padre o tutor legal de ${child}, autorizo a ${NURSERY_NAME} a publicar fotos y videos de ${child} tomados durante las actividades del Jardín en su Instagram (https://www.instagram.com/ilovemykinder_), donde puede verlos cualquier persona. Se conservan publicados mientras ${child} esté inscripto, salvo que retire esta autorización. Sé que puedo retirarla en cualquier momento desde la app o pidiéndolo al Jardín; desde ese momento no se publican nuevas imágenes y el Jardín quita las que publicó en sus cuentas, pero no puede recuperar copias que otras personas hayan guardado o compartido. Esta autorización es solo para redes sociales. Dentro de la app, las fotos y videos en los que aparece ${child} pueden llegar a otras familias de su sala.`,
  },
  visibility: {
    id: 'auth_visibility',
    version: '1.1',
    title: 'Mostrar a las familias de la sala',
    text: (child: string) =>
      `Autorizo que las familias de la sala y turno de ${child} vean en la lista de la sala su nombre, su foto y el día y mes de su cumpleaños (sin el año). Si no lo autorizo, en la lista verán solo sus iniciales y no su cumpleaños. Puedo retirarla en cualquier momento.`,
  },
  health: {
    id: 'auth_health',
    version: '1.0',
    title: 'Datos de salud',
    text: (child: string) =>
      `Autorizo de forma expresa a ${NURSERY_NAME} a registrar en la app las alergias de ${child}, para que sus maestras y la dirección las conozcan y lo cuiden, en especial en las comidas. Sé que es un dato de salud (dato sensible, art. 18 de la Ley 18.331), que no estoy obligado a darlo, que solo lo ven sus maestras y la dirección, que nunca aparece en notificaciones, y que puedo retirar esta autorización en cualquier momento.`,
  },
} as const;

export const withdrawConfirm = (typeTitle: string, child: string) =>
  `¿Retirar la autorización de ${typeTitle.toLowerCase()} para ${child}? Rige desde ahora.`;

export const OUTING = {
  id: 'outing_authorization',
  version: '1.0',
  text: (p: { signer: string; relationship: string; child: string; title: string; date: string; out: string; back: string; place: string; transport: string; notes?: string | null }) =>
    `Yo, ${p.signer} (${p.relationship}), autorizo a que ${p.child} salga del Jardín para ${p.title} el ${p.date}, de ${p.out} a ${p.back}, a ${p.place}, en ${p.transport}, acompañado por el personal del Jardín.${p.notes ? ` ${p.notes}` : ''} Puedo cambiar o retirar esta autorización hasta que empiece la salida. Tocar "Autorizo" y confirmar equivale a mi firma.`,
  confirmYes: (child: string, title: string, date: string) => `¿Confirmás que autorizás a ${child} a ir a ${title} el ${date}?`,
  confirmNo: (child: string, title: string, date: string) => `¿Confirmás que ${child} no va a ${title} el ${date}?`,
  signed: (name: string, date: string, time: string) => `Autorizado por ${name} el ${date} a las ${time}`,
  declined: (name: string, date: string, time: string) => `No autorizado por ${name} el ${date} a las ${time}`,
  changed: (date: string) => `Cambió la salida del ${date}: confirmá de nuevo el permiso.`,
};

export const STAFF_HINTS = {
  notes: 'No escribir datos de salud ni nombres de niños.',
  imagePicker: 'Lo van a ver otras familias. Elegí imágenes adecuadas para compartir.',
};

export const CHAT_NOTICE_FAMILY = {
  id: 'chat_notice',
  version: '1.6',
  title: 'Antes de usar el chat de la sala',
  bullets: (urgentPhone: string) => [
    `**Es el único chat de la sala. Lo leen todas las familias de la sala, sus maestras y asistentes y la dirección de ${NURSERY_NAME}.** Todos ven cada mensaje, cada foto y el nombre de quien lo manda, también quienes se sumen después. No hay chats privados.`,
    'La dirección está en todos los chats de sala: puede leer y escribir en cualquier momento.',
    '**No escribas datos de salud ni temas privados de tu hijo/a** (fiebre, medicación, alergias, temas de familia, reclamos). Para eso llamá o hablá con el Jardín.',
    `**No es para emergencias.** Por una urgencia, llamá al ${urgentPhone}.`,
    'No mandes fotos donde se vean otros niños ni escribas datos de otras familias.',
    'Más información en la Política de privacidad.',
  ],
  checkbox: 'Leí este aviso. Sé que todas las familias de la sala leen lo que escribo y quiero usar el chat.',
};

export const CHAT_NOTICE_STAFF = {
  id: 'chat_notice_staff',
  version: '1.4',
  title: 'Antes de usar el chat de la sala',
  bullets: () => [
    `**Es el único chat de la sala. Lo leen todas las familias de la sala, sus maestras y asistentes y la dirección de ${NURSERY_NAME},** que también puede escribir en cualquier momento. No hay chats privados con familias.`,
    'Es un canal de trabajo: usalo solo para temas de la sala y del Jardín. No lo uses para temas personales.',
    '**Nunca escribas datos de salud ni temas privados de un niño o de una familia:** todas las familias lo leen. Para eso, hablá con esa familia o con la dirección.',
    '**Fotos:** que no se vean niños. Las fotos de la sala van en la galería.',
    'Más información en la Política de uso del chat del Jardín y en la Política de privacidad.',
  ],
  checkbox: 'Leí este aviso y sé que todas las familias de la sala y la dirección leen el chat.',
};

export const CHAT_FIXED = {
  urgent: (phone: string) => `Por una urgencia, llamá al ${phone}`,
  noTeacher: (phone: string) => `Esta sala no tiene maestra asignada por ahora. Por una urgencia, llamá al ${phone}`,
};

export const WITHDRAWN_FAMILY = (child: string) =>
  `${child} ya no está inscripto en el Jardín. Podés seguir viendo los comunicados, eventos, fotos y videos que recibiste. Si querés borrar todo, eliminá tu cuenta en Perfil.`;
