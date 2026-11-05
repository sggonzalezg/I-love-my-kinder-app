import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { badgeText } from '@/lib/format';
import { fonts, radius, size, tabular } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { PressableScale } from './pressable-scale';
import { Text } from './text';

type Props = {
  icon: LucideIcon;
  /** Required: every icon-only control has an accessible label (design.md section 10). */
  label: string;
  onPress?: () => void;
  ghost?: boolean;
  badge?: number;
  disabled?: boolean;
};

/** design.md section 6 Icon button: 44 px circle, surface or transparent, optional red count badge. */
export function IconButton({ icon: Icon, label, onPress, ghost, badge = 0, disabled }: Props) {
  const c = useColors();
  const count = badgeText(badge);
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.base, { backgroundColor: ghost ? 'transparent' : pressed ? c.raised : c.surface }]}>
      <Icon size={24} color={disabled ? c.muted : c.ink} strokeWidth={1.8} />
      {count && (
        <View style={[styles.badge, { backgroundColor: c.red }]} importantForAccessibility="no">
          <Text style={[styles.badgeText, { color: c.onRed }]}>{count}</Text>
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { width: size.touch, height: size.touch, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 2, right: 0, minWidth: 18, height: 18, paddingHorizontal: 5, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: fonts.text700, fontSize: 11, lineHeight: 18, ...tabular },
});
