import { Children, Fragment, type ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/text';

import { styles, usePeopleSectionStyles } from './PeopleSection.styles';

interface PeopleSectionProps {
  title: string;
  children: ReactNode;
  whenEmpty?: ReactNode;
}

export function PeopleSection({ title, children, whenEmpty }: PeopleSectionProps) {
  const themed = usePeopleSectionStyles();
  const rows = Children.toArray(children);
  return (
    <View style={styles.section}>
      <Text variant="section" accessibilityRole="header">
        {title}
      </Text>
      {rows.length ? (
        <View style={[styles.list, themed.list]}>
          {rows.map((row, index) => (
            <Fragment key={index}>
              {index > 0 ? <View style={[styles.separator, themed.separator]} /> : null}
              {row}
            </Fragment>
          ))}
        </View>
      ) : (
        whenEmpty
      )}
    </View>
  );
}
