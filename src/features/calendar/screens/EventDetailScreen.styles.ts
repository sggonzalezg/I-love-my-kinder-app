import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const HERO_HEIGHT = 220;
export const REMINDER_ICON_SIZE = 16;
export const SKELETON_TITLE_HEIGHT = 64;

export const styles = StyleSheet.create({
  hero: { width: '100%', height: HERO_HEIGHT, borderRadius: radius.lg, marginBottom: space.s4 },
  title: { marginTop: space.s3, marginBottom: space.s4 },
  block: { marginBottom: space.s3 },
  description: { marginVertical: space.s4 },
  reminder: { flexDirection: 'row', alignItems: 'center', gap: space.s2, padding: space.s3, borderRadius: radius.md, marginBottom: space.s6 },
  reminderText: { flex: 1 },
  feedback: { gap: space.s3, alignItems: 'flex-start' },
  staffAction: { marginBottom: space.s6 },
});

export const useEventDetailScreenStyles = createThemedStyles((colors) => ({
  reminder: { backgroundColor: colors.blue50 },
}));
