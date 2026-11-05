import { CircleAlert, CloudOff, Info, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { radius } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { Text } from './text';

type Kind = 'offline' | 'info' | 'error';
const ICONS: Record<Kind, LucideIcon> = { offline: CloudOff, info: Info, error: CircleAlert };

/** design.md section 6 Banner: inline, full width inside the margins; offline (wait), info (blue), error (red). */
export function Banner({ kind, text }: { kind: Kind; text: string }) {
  const c = useColors();
  const [bg, fg] = { offline: [c.wait50, c.wait], info: [c.blue50, c.blue], error: [c.red50, c.red] }[kind];
  const Icon = ICONS[kind];
  return (
    <View style={[styles.banner, { backgroundColor: bg }]} accessibilityRole={kind === 'error' ? 'alert' : undefined}>
      <Icon size={20} color={fg} strokeWidth={1.8} />
      <Text variant="smallStrong" style={styles.text}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 12, borderRadius: radius.md },
  text: { flex: 1 },
});
