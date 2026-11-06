import type { AuthorizationKey } from '@/lib/authorizations';

export const AUTHORIZATION_PURPOSE: Record<AuthorizationKey, (child: string) => string> = {
  image: (child) => `Publicar fotos y videos de ${child} en las redes del jardín. No cambia lo que se ve en la galería ni en el chat.`,
  visibility: () => 'Nombre, foto y cumpleaños en la lista de compañeros.',
  health: () => 'Alergias, solo para maestras y dirección.',
};

export const authorizationsIntro = (child: string) =>
  `Son de ${child}, no de cada adulto: lo que autorizó otro adulto a cargo ya vale, no tenés que hacerlo de nuevo. Podés retirarlo cuando quieras.`;

export const authorizationsFootnote = (child: string) => `Si uno de los adultos a cargo lo retira, deja de valer para ${child}.`;

export const AUTHORIZATION_SAVE_ERROR = 'No pudimos guardar el cambio. Probá de nuevo.';
export const AUTHORIZATION_SAVED = 'Guardado';
