export const DELETE_ACCOUNT_COPY = {
  profileRow: 'Eliminar mi cuenta',
  profileRowMeta: 'Borra tu perfil y tu acceso. No se puede deshacer.',
  summaryTitle: '¿Eliminar tu cuenta?',
  deletedNowLabel: 'Se borra ahora:',
  staysLabel: 'Queda en el jardín:',
  legalProofLabel: 'Se guarda como prueba legal:',
  familyDeletedNow: (accessLine: string) =>
    ` tu cuenta y la forma de entrar (Google, Apple o el código al e-mail), tus lecturas del chat y ${accessLine}. Se cierra la sesión en todos tus teléfonos.`,
  familyStays:
    ' tus datos de familiar que cargó la dirección (nombre, e-mail y celular), hasta que ella los borre; la ficha de tus hijos mientras estén inscriptos y tus mensajes del chat, con tu nombre y tu vínculo, para que se sepa con quién se conversó. Si otro familiar está vinculado, sigue viendo su día.',
  familyLegalProof: ' qué documentos aceptaste y cuándo. Nada más.',
  familyFootnote: 'Las fotos que ya guardaste en tu teléfono siguen ahí. Esto no se puede deshacer.',
  staffDeletedNow:
    ' tu cuenta y la forma de entrar, tu foto, tu sociedad médica, tu horario de trabajo y tu acceso a tus salas.',
  staffStays:
    ' tus datos de maestra que cargó la dirección (nombre, e-mail y celular), hasta que ella los borre, y las rutinas, fotos, videos, avisos y mensajes que cargaste, con tu nombre.',
  staffLegalProof: ' qué documentos aceptaste y cuándo.',
  continue: 'Continuar',
  cancel: 'Cancelar',
  retry: 'Reintentar',
  onlyDirectorTitle: 'Antes, sumá otra persona de dirección',
  onlyDirectorBody: (nurseryName: string) =>
    `Sos la única cuenta de dirección de ${nurseryName}. Si la borrás, nadie podría administrar el jardín.`,
  onlyDirectorAsk: 'Pedile al soporte de la app que sume a otra persona de dirección con su e-mail, y después volvé acá.',
  notNow: 'Ahora no',
  codeTitle: 'Confirmá que sos vos',
  back: 'Volver',
  codeSentTo: 'Te mandamos un código de 6 números a ',
  accountEmailFallback: 'tu e-mail',
  pasteCode: 'Pegar código',
  resendIn: (countdown: string) => `Reenviar en ${countdown}`,
  resend: 'Reenviar código',
  spamTip: '¿No llegó? Mirá en Correo no deseado o Promociones.',
  deleteForGood: 'Eliminar definitivamente',
  deleting: 'Eliminando…',
  deletedTitle: 'Tu cuenta se eliminó',
  done: 'Listo',
} as const;
