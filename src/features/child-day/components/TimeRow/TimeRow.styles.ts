import { createThemedStyles } from '@/theme/themed-styles';
import { fonts, space } from '@/theme/tokens';

const TIME_COLUMN_WIDTH = 52;
const ROW_PADDING_VERTICAL = 10;

export const useTimeRowStyles = createThemedStyles((colors) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingVertical: ROW_PADDING_VERTICAL },
  divided: { borderTopWidth: 1, borderTopColor: colors.raised },
  time: { width: TIME_COLUMN_WIDTH, fontFamily: fonts.text700, fontSize: 17, lineHeight: 20 },
  label: { flex: 1, minWidth: 0 },
}));
