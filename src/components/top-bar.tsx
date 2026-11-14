import { router } from 'expo-router';
import { ChevronLeft, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { IconButton } from './icon-button';
import { Text } from './text';
import { styles } from './top-bar.styles';

type Props = {
  title?: string;
  subtitle?: string;
  backLabel?: string;
  /** A full-screen form closes with ✕ instead of going back. */
  backIcon?: LucideIcon;
  onBack?: () => void;
  right?: ReactNode;
};

export function TopBar({ title, subtitle, backLabel, backIcon = ChevronLeft, onBack, right }: Props) {
  return (
    <View style={styles.bar}>
      {backLabel && <IconButton icon={backIcon} label={backLabel} onPress={onBack ?? (() => router.back())} />}
      <View style={styles.titles}>
        {title && (
          <Text variant="title" accessibilityRole="header">
            {title}
          </Text>
        )}
        {subtitle && (
          <Text variant="smallStrong" tone="muted">
            {subtitle}
          </Text>
        )}
      </View>
      {right && <View style={styles.right}>{right}</View>}
    </View>
  );
}
