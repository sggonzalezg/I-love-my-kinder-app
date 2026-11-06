import {
  getAnnouncements,
  getAnnouncementById,
  getUnreadAnnouncementCount,
  markAnnouncementAsSeen,
  mockAnnouncements,
  mockAnnouncementRecipients,
} from '../queries';

describe('Announcements queries', () => {
  beforeEach(() => {
    // Reset mock data
    mockAnnouncements.length = 0;
    mockAnnouncements.push(
      {
        id: 'announce-1',
        title: 'Test announcement',
        body: 'Test body',
        sender_name: 'Maestra Sofía',
        sender_role: 'teacher',
        room: 'Sala 2',
        created_at: new Date().toISOString(),
      },
      {
        id: 'announce-2',
        title: 'Another announcement',
        body: 'Another body',
        sender_name: 'Dirección',
        sender_role: 'director',
        created_at: new Date().toISOString(),
      }
    );

    mockAnnouncementRecipients.length = 0;
    mockAnnouncementRecipients.push(
      {
        id: 'recipient-1',
        announcement_id: 'announce-1',
        user_id: 'user-1',
      },
      {
        id: 'recipient-2',
        announcement_id: 'announce-2',
        user_id: 'user-1',
        seen_at: new Date().toISOString(),
      }
    );
  });

  describe('getAnnouncements', () => {
    it('returns all announcements', () => {
      const result = getAnnouncements();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('announce-1');
      expect(result[1].id).toBe('announce-2');
    });
  });

  describe('getAnnouncementById', () => {
    it('returns announcement by id', () => {
      const result = getAnnouncementById('announce-1');
      expect(result).toBeDefined();
      expect(result?.title).toBe('Test announcement');
    });

    it('returns undefined for non-existent id', () => {
      const result = getAnnouncementById('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('getUnreadAnnouncementCount', () => {
    it('counts unread announcements for a user', () => {
      const count = getUnreadAnnouncementCount('user-1');
      expect(count).toBe(1);
    });

    it('returns 0 when all announcements are read', () => {
      markAnnouncementAsSeen('announce-1', 'user-1');
      const count = getUnreadAnnouncementCount('user-1');
      expect(count).toBe(0);
    });

    it('returns 0 for user with no announcements', () => {
      const count = getUnreadAnnouncementCount('user-2');
      expect(count).toBe(0);
    });
  });

  describe('markAnnouncementAsSeen', () => {
    it('marks an announcement as seen', () => {
      markAnnouncementAsSeen('announce-1', 'user-1');
      const recipient = mockAnnouncementRecipients.find(
        (r) => r.announcement_id === 'announce-1' && r.user_id === 'user-1'
      );
      expect(recipient?.seen_at).toBeDefined();
    });

    it('does nothing if recipient does not exist', () => {
      markAnnouncementAsSeen('announce-1', 'user-2');
      const count = getUnreadAnnouncementCount('user-2');
      expect(count).toBe(0);
    });
  });
});
