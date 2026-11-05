import { CircleAlert, CloudOff, Info, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { radius } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { Text } from './text';

type Kind = 'offline' | 'info' | 'error';
const ICONS: Record<Kind, LucideIcon> = { offline: CloudOff, info: Info, error: CircleAlert };

interface BannerProps {
  kind?: Kind;
  variant?: Kind;
  text?: string;
  message?: string;
}

export function Banner({ kind, variant, text, message }: BannerProps) {
  const c = useColors();
  const actualKind = kind || variant || 'info';
  const actualText = text || message || '';
  const [bg, fg] = { offline: [c.wait50, c.wait], info: [c.blue50, c.blue], error: [c.red50, c.red] }[actualKind];
  const Icon = ICONS[actualKind];
  return (
    <View style={[styles.banner, { backgroundColor: bg }]} accessibilityRole={actualKind === 'error' ? 'alert' : undefined}>
      <Icon size={20} color={fg} strokeWidth={1.8} />
      <Text variant="smallStrong" style={styles.text}>
        {actualText}
      </Text>
    </View>
  );
}

export default Banner;

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 12, borderRadius: radius.md },
  text: { flex: 1 },
});
