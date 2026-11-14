import { Children, Fragment, type ReactNode } from 'react';
import { View } from 'react-native';

import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './FormRows.styles';

export function FormRows({ children }: { children: ReactNode }) {
  const backgroundStyles = useBackgroundColorStyles();
  const rows = Children.toArray(children);
  return (
    <View style={[styles.group, backgroundStyles.surface]}>
      {rows.map((row, index) => (
        <Fragment key={index}>
          {index > 0 ? <View style={[styles.divider, backgroundStyles.raised]} /> : null}
          {row}
        </Fragment>
      ))}
    </View>
  );
}
