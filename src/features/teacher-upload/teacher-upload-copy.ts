import type { UploadMediaKind } from '@/lib/gallery-upload';

export const TEACHER_UPLOAD_COPY = {
  title: 'Subir a la galería',
  takeMedia: 'Sacar foto o video',
  chooseMedia: 'Elegir de la galería',
  emptyTitle: 'Mostrales el día a las familias',
  emptyText: 'Fotos y videos de hasta 1:30.',
  shareHint: 'Lo van a ver otras familias. Elegí imágenes adecuadas para compartir.',
  picked: (count: number) => `Elegiste ${count}`,
  tooLong: (count: number) =>
    count === 1 ? '1 video es muy largo (máx. 1:30). No se va a subir.' : `${count} videos son muy largos (máx. 1:30). No se van a subir.`,
  uploadTo: 'Subir a',
  uploadToHint: (groupCount: number) => (groupCount === 2 ? 'Podés elegir las dos' : 'Podés elegir varias'),
  uploadButton: (fileCount: number, groupCount: number) => {
    if (groupCount === 0) return 'Elegí al menos una sala';
    return groupCount > 1 ? `Subir ${fileCount} a ${groupCount} salas` : `Subir ${fileCount}`;
  },
  uploadingTo: (heading: string) => `Subiendo a ${heading}`,
  itemName: (kind: UploadMediaKind, duration: string | null) => (kind === 'video' ? (duration ? `Video · ${duration}` : 'Video') : 'Foto'),
  uploaded: (kind: UploadMediaKind) => (kind === 'video' ? 'Subido' : 'Subida'),
  preparing: 'Preparando video…',
  waiting: 'Esperando conexión',
  failed: 'No se subió',
  retry: 'Reintentar',
  offlineHint: 'Si se corta la conexión, esperamos y seguimos solos.',
  remove: 'Quitar',
  cameraDenied: 'Necesitamos permiso para usar la cámara.',
  openSettings: 'Abrir Ajustes',
  progress: (percent: number) => `${percent} %`,
} as const;
