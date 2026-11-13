import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { space } from '@/theme/tokens';

export const PLACEHOLDER_ICON_SIZE = 24;
export const RETRY_BUTTON_HEIGHT = 44;
const THUMB_SIZE = 60;
const THUMB_RADIUS = 12;
const ROW_MIN_HEIGHT = 64;
const SEPARATOR_WIDTH = 1;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingVertical: space.s3, paddingHorizontal: space.s4, minHeight: ROW_MIN_HEIGHT },
  separated: { borderTopWidth: SEPARATOR_WIDTH },
  thumb: { width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: THUMB_RADIUS, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, minWidth: 0 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.s3 },
});

export const useUploadQueueRowStyles = createThemedStyles((colors) => ({
  row: { borderColor: colors.raised },
  placeholder: { backgroundColor: colors.raised },
}));
