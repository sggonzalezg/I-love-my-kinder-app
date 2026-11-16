import { createThemedStyles } from '@/theme/themed-styles';
import { fonts, radius, space } from '@/theme/tokens';

const CARD_PADDING = 14;
const RING_WIDTH = 2;
const TEXT_GAP = 6;
const TITLE_FONT_SIZE = 17;
const TITLE_LINE_HEIGHT = 21;

export const useAuthorizationReminderCardStyles = createThemedStyles((colors) => ({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.s3,
    padding: CARD_PADDING - RING_WIDTH,
    borderRadius: radius.lg,
    borderWidth: RING_WIDTH,
    borderColor: colors.wait50,
    backgroundColor: colors.surface,
  },
  text: { flex: 1, minWidth: 0, gap: TEXT_GAP },
  title: { fontFamily: fonts.display800, fontSize: TITLE_FONT_SIZE, lineHeight: TITLE_LINE_HEIGHT },
  action: { alignSelf: 'flex-start', marginTop: space.s1 },
}));
