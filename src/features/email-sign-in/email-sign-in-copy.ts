import { EMAIL_CODE_LENGTH, EMAIL_PROBLEMS, type EmailProblem } from '@/lib/email-sign-in';
import type { SocialProvider } from '@/lib/social-sign-in';

export const NURSERY_EMAIL_SENDER = 'hola@ilovemykinder.uy';

export const EMAIL_SIGN_IN_COPY = {
  logoLabel: 'I love my kinder, Jardín Maternal e Inicial',
  entryTitle: 'Entrá al jardín',
  entryLede: 'Con la cuenta o el e-mail que le diste a la dirección.',
  emailLabel: 'Tu e-mail',
  emailPlaceholder: 'nombre@correo.com',
  sendCode: 'Enviarme un código',
  troubleQuestion: '¿Problemas para entrar? ',
  troubleLink: 'Escribile al jardín',
  offline: 'Sin conexión. Probá de nuevo cuando vuelva.',
  sendFailed: 'No pudimos mandarte el código. Probá de nuevo.',

  back: 'Volver a la entrada',
  codeTitle: 'Revisá tu e-mail',
  codeSentTo: `Te mandamos un código de ${EMAIL_CODE_LENGTH} números a `,
  change: 'Cambiar',
  codeLabel: (filled: number) => `Código, ${filled} de ${EMAIL_CODE_LENGTH} números`,
  paste: 'Pegar código',
  resendIn: (countdown: string) => `Reenviar en ${countdown}`,
  resend: 'Reenviar código',
  openMail: 'Abrir mi correo',
  spamTipStart: '¿No llegó? Mirá en ',
  spamFolder: 'Correo no deseado',
  spamOr: ' o ',
  promotionsFolder: 'Promociones',
  spamFrom: '. Llega de ',
  signingIn: 'Entrando…',
  wrongCode: 'El código no es correcto. Revisalo o pedí otro.',
  expired: 'Este código venció. Duran 10 minutos.',
  sendAnother: 'Mandarme otro código',
  verifyFailed: 'No pudimos revisar el código. Probá de nuevo.',
  waitTitle: 'Esperá un momento',
  waitBefore: 'Hiciste muchos intentos seguidos con ',
  waitAfter: '. Esperá un momento y probá de nuevo.',

  notEnabledTitle: 'Tu cuenta no está habilitada',
  notEnabledBody: 'El jardín no tiene registrado este e-mail. Pedile al jardín que te registre con él.',
  askToRegister: 'Pedirle al jardín que me registre',
  registerMessage: (email: string) => `Hola, quiero entrar a la app I love my kinder con el e-mail ${email}. ¿Me pueden registrar?`,
  otherAccount: 'Entrar con otra cuenta',

  deactivatedTitle: 'Tu cuenta de este jardín ya no está activa. Hablá con la dirección',
  writeNursery: 'Escribirle al jardín',
} as const;

const PROVIDER_NAMES: Record<SocialProvider, string> = { apple: 'Apple', google: 'Google' };

export const SOCIAL_SIGN_IN_COPY = {
  continueWith: { apple: 'Continuar con Apple', google: 'Continuar con Google' } satisfies Record<SocialProvider, string>,
  opening: { apple: 'Abriendo Apple…', google: 'Abriendo Google…' } satisfies Record<SocialProvider, string>,
  orWithEmail: 'o con tu e-mail',
  cancelled: (provider: SocialProvider) => `No terminaste de entrar con ${PROVIDER_NAMES[provider]}. Probá de nuevo o usá tu e-mail.`,
  failed: (provider: SocialProvider) => `No pudimos entrar con ${PROVIDER_NAMES[provider]}. Probá de nuevo o entrá con tu e-mail.`,
} as const;

export const EMAIL_PROBLEM_COPY: Record<EmailProblem, string> = {
  [EMAIL_PROBLEMS.EMPTY]: 'Escribí tu e-mail.',
  [EMAIL_PROBLEMS.MALFORMED]: 'Revisá el e-mail: tiene que ser como nombre@correo.com',
  [EMAIL_PROBLEMS.MISSING_END]: 'Revisá el e-mail: le falta el final, por ejemplo .com',
};
