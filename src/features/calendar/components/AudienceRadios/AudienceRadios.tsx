import * as Haptics from 'expo-haptics';
import { Fragment } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/text';
import type { EventAudienceOption } from '@/lib/event-form';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles, useAudienceRadiosStyles } from './AudienceRadios.styles';

interface AudienceRadiosProps {
  label: string;
  options: EventAudienceOption[];
  value: string | null;
  onChange: (key: string) => void;
}

export function AudienceRadios({ label, options, value, onChange }: AudienceRadiosProps) {
  const backgroundStyles = useBackgroundColorStyles();
  const themed = useAudienceRadiosStyles();
  return (
    <View style={[styles.group, backgroundStyles.surface]} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {options.map((option, index) => {
        const selected = option.key === value;
        return (
          <Fragment key={option.key}>
            {index > 0 ? <View style={[styles.divider, backgroundStyles.raised]} /> : null}
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => {
                if (selected) return;
                Haptics.selectionAsync();
                onChange(option.key);
              }}
              style={styles.radio}>
              <View style={[styles.dot, selected ? themed.dotOn : themed.dotOff]} />
              <Text variant="bodyStrong">{option.label}</Text>
            </Pressable>
          </Fragment>
        );
      })}
    </View>
  );
}
