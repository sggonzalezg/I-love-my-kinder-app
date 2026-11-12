import type { Ref } from 'react';
import { Text as RNText, type HostInstance, type TextProps } from 'react-native';

import { useTextColorStyles } from '@/theme/color-styles';
import { type, type ColorName } from '@/theme/tokens';

import { styles, variantStyles } from './text.styles';

type Variant = keyof typeof type;
type Tone = ColorName;

type Props = TextProps & { variant?: Variant; tone?: Tone; color?: Tone; numeric?: boolean; ref?: Ref<HostInstance> };

export function Text({ variant = 'body', tone, color, numeric, style, ...rest }: Props) {
  const textColorStyles = useTextColorStyles();
  const actualTone = color || tone || 'ink';
  return <RNText {...rest} style={[variantStyles[variant], textColorStyles[actualTone] ?? textColorStyles.ink, numeric && styles.numeric, style]} />;
}

export default Text;
