import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useIsDark } from '@/theme/use-theme';

import { styles, topInsetStyle } from './screen.styles';

type Props = { children: ReactNode; header?: ReactNode; scroll?: boolean };

export function Screen({ children, header, scroll = true }: Props) {
  const backgroundStyles = useBackgroundColorStyles();
  const dark = useIsDark();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, backgroundStyles.ground, topInsetStyle(insets.top)]}>
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

export default Screen;
