import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const BLOCK_ICON_SIZE = 24;
export const FOOTER_ICON_SIZE = 16;
// The mockup's rest duration: 32 px numbers with a 20 px muted unit.
const REST_VALUE_SIZE = 32;
const REST_UNIT_SIZE = 20;

export const styles = StyleSheet.create({
  shift: { gap: space.s3 },
  restValue: { fontSize: REST_VALUE_SIZE, lineHeight: REST_VALUE_SIZE + space.s2 },
  restUnit: { fontSize: REST_UNIT_SIZE },
  footer: { flexDirection: 'row', alignItems: 'flex-start', gap: space.s2 },
  footerText: { flex: 1 },
});
