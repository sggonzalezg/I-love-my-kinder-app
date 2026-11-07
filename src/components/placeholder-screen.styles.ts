import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

const LOGO_SIZE = 160;
const ROW_MIN_HEIGHT = 64;

export const PLACEHOLDER_AVATAR_SIZE = 44;
export const PLACEHOLDER_TITLE_LINE = { width: '60%', height: 14 } as const;
export const PLACEHOLDER_SUBTITLE_LINE = { width: '40%', height: 12 } as const;

export const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.s4, alignItems: 'center', gap: space.s3 },
  logo: { width: LOGO_SIZE, height: LOGO_SIZE },
  center: { textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, padding: space.s3, borderRadius: radius.lg, minHeight: ROW_MIN_HEIGHT },
  lines: { flex: 1, gap: space.s2 },
});
