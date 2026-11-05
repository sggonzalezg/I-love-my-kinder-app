import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { screenMargin } from '@/theme/tokens';
import { useColors, useIsDark } from '@/theme/use-theme';

type Props = { children: ReactNode; header?: ReactNode; scroll?: boolean };

export function Screen({ children, header, scroll = true }: Props) {
  const c = useColors();
  const dark = useIsDark();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { backgroundColor: c.ground, paddingTop: insets.top }]}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      {header}
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.root]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: screenMargin, paddingBottom: 24, gap: 16 },
});
