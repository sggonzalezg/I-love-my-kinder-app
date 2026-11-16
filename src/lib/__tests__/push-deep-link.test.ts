import { pushDataToHref } from '@/lib/push-deep-link';

describe('pushDataToHref', () => {
  it('opens the notice of an announcement push', () => {
    expect(pushDataToHref({ screen: 'announcements', id: 'notice-1' })).toBe('/notices/notice-1');
  });

  it('opens the event of an event push', () => {
    expect(pushDataToHref({ screen: 'events', id: 'event-1' })).toBe('/event/event-1');
  });

  it('opens the child day of a routine push', () => {
    expect(pushDataToHref({ screen: 'today', child_id: 'child-1' })).toBe('/day/child-1');
  });

  it('opens the room chat of a message push', () => {
    expect(pushDataToHref({ screen: 'chat', thread_id: 'thread-1' })).toBe('/chat/thread-1');
  });

  it('opens the Sala tab for a birthday push', () => {
    expect(pushDataToHref({ screen: 'child', childId: 'child-1', type: 'birthday' })).toBe('/room');
  });

  it('opens the outing permission of an outing reminder', () => {
    expect(pushDataToHref({ screen: 'outing', eventId: 'event-1', childId: 'child-1' })).toBe('/permission/event-1');
  });

  it('encodes the ids it puts in the path', () => {
    expect(pushDataToHref({ screen: 'events', id: 'a/b' })).toBe('/event/a%2Fb');
  });

  it('opens nothing when the push names an unknown screen', () => {
    expect(pushDataToHref({ screen: 'billing', id: 'x' })).toBeNull();
  });

  it('opens nothing when the id the screen needs is missing', () => {
    expect(pushDataToHref({ screen: 'events' })).toBeNull();
  });

  it('opens nothing when the id is not a string', () => {
    expect(pushDataToHref({ screen: 'announcements', id: 42 })).toBeNull();
  });

  it('opens nothing for a push without data', () => {
    expect(pushDataToHref(undefined)).toBeNull();
  });
});
