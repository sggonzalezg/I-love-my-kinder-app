import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton } from './icon-button';
import { Text } from './text';

type Props = {
  title?: string;
  subtitle?: string;
  backLabel?: string;
  onBack?: () => void;
  right?: ReactNode;
};

export function TopBar({ title, subtitle, backLabel, onBack, right }: Props) {
  return (
    <View style={styles.bar}>
      {backLabel && <IconButton icon={ChevronLeft} label={backLabel} onPress={onBack ?? (() => router.back())} />}
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

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 8, paddingBottom: 12, paddingHorizontal: 20, minHeight: 56 },
  titles: { flex: 1 },
  right: { flexDirection: 'row', gap: 8 },
});
