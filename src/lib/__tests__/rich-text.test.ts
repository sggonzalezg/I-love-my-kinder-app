import { richSegments } from '../rich-text';

describe('richSegments', () => {
  it('keeps plain text as one segment', () => {
    expect(richSegments('Es un canal de trabajo.', {})).toEqual([{ text: 'Es un canal de trabajo.', bold: false, link: null }]);
  });

  it('marks the text between double asterisks as bold', () => {
    expect(richSegments('**No es para emergencias.** Llamá.', {})).toEqual([
      { text: 'No es para emergencias.', bold: true, link: null },
      { text: ' Llamá.', bold: false, link: null },
    ]);
  });

  it('turns each known phrase into a link', () => {
    expect(
      richSegments('Más información en la Política de uso del chat del Jardín y en la Política de privacidad.', {
        'Política de uso del chat del Jardín': 'teacherChat',
        'Política de privacidad': 'privacy',
      }),
    ).toEqual([
      { text: 'Más información en la ', bold: false, link: null },
      { text: 'Política de uso del chat del Jardín', bold: false, link: 'teacherChat' },
      { text: ' y en la ', bold: false, link: null },
      { text: 'Política de privacidad', bold: false, link: 'privacy' },
      { text: '.', bold: false, link: null },
    ]);
  });
});
