import { badgeText, bellLabel, chatIconLabel, initials, relationshipLabel, relationshipWord } from '../format';

describe('small UI formatters', () => {
  it('caps the badge at 9+', () => {
    expect(badgeText(3)).toBe('3');
    expect(badgeText(12)).toBe('9+');
    expect(badgeText(0)).toBeNull();
  });

  it('labels the bell for screen readers', () => {
    expect(bellLabel(2)).toBe('Avisos, 2 sin leer');
    expect(bellLabel(0)).toBe('Avisos');
  });

  it('says how many room chats have unread messages on the chat icon', () => {
    expect(chatIconLabel(2)).toBe('Chat, 2 con mensajes sin leer');
    expect(chatIconLabel(0)).toBe('Chat');
  });

  it('builds initials from first and last name', () => {
    expect(initials('Mateo', 'Pérez García')).toBe('MP');
  });

  it('translates relationships to the chip word', () => {
    expect(relationshipLabel('mother')).toBe('Madre');
    expect(relationshipLabel('grandmother')).toBe('Abuela');
    expect(relationshipLabel('Tía')).toBe('Tía');
  });

  it('names the relationship in a signature in lower case', () => {
    expect(relationshipWord('mother')).toBe('madre');
    expect(relationshipWord('father')).toBe('padre');
    expect(relationshipWord('Tía')).toBe('tía');
  });
});
