import {
  ALL_ROOMS_KEY,
  deletedToast,
  deleteMediaCopy,
  directorEmptyTitle,
  mediaDeletePaths,
  mediaName,
  roomChipsOf,
  uploadedLine,
  type DirectorGalleryMedia,
} from '../director-gallery';

const NOW = new Date(2026, 9, 24, 12, 0);

function directorMedia(overrides: Partial<DirectorGalleryMedia> = {}): DirectorGalleryMedia {
  return {
    id: 'media-1',
    type: 'photo',
    createdAt: new Date(2026, 9, 24, 10, 24).toISOString(),
    url: 'https://example.test/media-1',
    filePath: 'nursery/sala-2/morning/media-1.jpg',
    uploader: { label: 'Maestra Sofía', initials: 'SP', photoPath: null },
    groupLabel: 'Sala 2 · Matutino',
    coverPath: null,
    ...overrides,
  };
}

describe('roomChipsOf', () => {
  it('starts with "Todas" and lists the rooms by name, Sala 10 after Sala 2', () => {
    const chips = roomChipsOf([
      { id: 'sala-10', name: 'Sala 10' },
      { id: 'sala-2', name: 'Sala 2' },
      { id: 'sala-1', name: 'Sala 1' },
    ]);

    expect(chips).toEqual([
      { key: ALL_ROOMS_KEY, label: 'Todas' },
      { key: 'sala-1', label: 'Sala 1' },
      { key: 'sala-2', label: 'Sala 2' },
      { key: 'sala-10', label: 'Sala 10' },
    ]);
  });
});

describe('mediaDeletePaths', () => {
  it('removes only the file of a photo', () => {
    expect(mediaDeletePaths(directorMedia())).toEqual(['nursery/sala-2/morning/media-1.jpg']);
  });

  it('removes the cover of a video with its file', () => {
    const video = directorMedia({ type: 'video', filePath: 'n/r/s/v.mp4', coverPath: 'n/r/s/v-cover.jpg' });

    expect(mediaDeletePaths(video)).toEqual(['n/r/s/v.mp4', 'n/r/s/v-cover.jpg']);
  });
});

describe('mediaName', () => {
  it('names a photo with its group', () => {
    expect(mediaName(directorMedia())).toBe('Foto de Sala 2 · Matutino');
  });

  it('names a video with its group', () => {
    expect(mediaName(directorMedia({ type: 'video' }))).toBe('Video de Sala 2 · Matutino');
  });
});

describe('uploadedLine', () => {
  it('shows only the time for something uploaded today', () => {
    expect(uploadedLine(directorMedia(), NOW)).toBe('Subida por Maestra Sofía · 10:24');
  });

  it('adds the day for something uploaded before today', () => {
    const yesterday = directorMedia({ createdAt: new Date(2026, 9, 23, 9, 5).toISOString() });

    expect(uploadedLine(yesterday, NOW)).toBe('Subida por Maestra Sofía · Ayer · 9:05');
  });

  it('leaves the uploader out when it does not read', () => {
    expect(uploadedLine(directorMedia({ uploader: null }), NOW)).toBe('Subida a las 10:24');
  });
});

describe('deleteMediaCopy', () => {
  it('asks about a photo', () => {
    expect(deleteMediaCopy('photo')).toEqual({ title: '¿Borrar esta foto?', confirm: 'Borrar foto' });
  });

  it('asks about a video', () => {
    expect(deleteMediaCopy('video')).toEqual({ title: '¿Borrar este video?', confirm: 'Borrar video' });
  });
});

describe('deletedToast', () => {
  it('says a photo was deleted', () => {
    expect(deletedToast('photo')).toBe('Foto borrada');
  });

  it('says a video was deleted', () => {
    expect(deletedToast('video')).toBe('Video borrado');
  });
});

describe('directorEmptyTitle', () => {
  it('names the chosen room', () => {
    expect(directorEmptyTitle('Sala 4')).toBe('Sala 4 todavía no tiene fotos');
  });

  it('speaks of the whole nursery with no room chosen', () => {
    expect(directorEmptyTitle(null)).toBe('Todavía no hay fotos');
  });
});
