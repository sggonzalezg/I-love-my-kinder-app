import { CircleAlert, CloudOff, Info, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { BANNER_ICON_SIZE, BANNER_PALETTES, styles, type BannerKind } from './banner.styles';
import { Text } from './text';

const ICONS: Record<BannerKind, LucideIcon> = { offline: CloudOff, info: Info, error: CircleAlert };

interface BannerProps {
  kind?: BannerKind;
  variant?: BannerKind;
  text?: string;
  message?: string;
}

export function Banner({ kind, variant, text, message }: BannerProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const actualKind = kind || variant || 'info';
  const actualText = text || message || '';
  const palette = BANNER_PALETTES[actualKind];
  const Icon = ICONS[actualKind];
  return (
    <View style={[styles.banner, backgroundStyles[palette.background]]} accessibilityRole={actualKind === 'error' ? 'alert' : undefined}>
      <Icon size={BANNER_ICON_SIZE} color={colors[palette.icon]} strokeWidth={1.8} />
      <Text variant="smallStrong" style={styles.text}>
        {actualText}
      </Text>
    </View>
  );
}

export default Banner;
