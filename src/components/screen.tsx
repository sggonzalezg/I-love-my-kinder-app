import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useIsDark } from '@/theme/use-theme';

import { styles, topInsetStyle } from './screen.styles';

/** `bleed` hands the whole area to the children, with no scroll and no margins (chat). */
type Props = { children: ReactNode; header?: ReactNode; scroll?: boolean; bleed?: boolean };

export function Screen({ children, header, scroll = true, bleed = false }: Props) {
  const backgroundStyles = useBackgroundColorStyles();
  const dark = useIsDark();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, backgroundStyles.ground, topInsetStyle(insets.top)]}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      {header}
      {bleed ? <View style={styles.root}>{children}</View> : null}
      {!bleed && scroll ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : null}
      {!bleed && !scroll ? <View style={[styles.content, styles.root]}>{children}</View> : null}
    </View>
  );
}

export default Screen;
