import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { fonts, radius } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { Text } from './text';

export type ChipVariant = 'blue' | 'ok' | 'wait' | 'red' | 'grey';

/** design.md section 6 Chip: 28 px pill, 13 px 600, icon + word (status is never colour only). */
export function Chip({ label, icon: Icon, variant = 'blue' }: { label: string; icon?: LucideIcon; variant?: ChipVariant }) {
  const c = useColors();
  const [bg, fg] = {
    blue: [c.blue50, c.blue],
    ok: [c.ok50, c.ok],
    wait: [c.wait50, c.wait],
    red: [c.red50, c.red],
    grey: [c.raised, c.muted],
  }[variant];
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      {Icon && <Icon size={18} color={fg} strokeWidth={1.8} />}
      <Text variant="caption" style={{ color: fg, fontFamily: fonts.text600 }} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 28, paddingHorizontal: 10, borderRadius: radius.full, alignSelf: 'flex-start' },
});
