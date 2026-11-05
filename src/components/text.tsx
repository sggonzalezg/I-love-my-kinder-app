import { Text as RNText, type TextProps } from 'react-native';

import { tabular, type, type ColorName } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

type Variant = keyof typeof type;
type Tone = ColorName | 'ink' | 'muted' | 'blue' | 'red' | 'ok' | 'wait' | 'onBlue' | 'ground' | 'onRed' | 'white';

type Props = TextProps & { variant?: Variant; tone?: Tone; color?: Tone; numeric?: boolean };

export function Text({ variant = 'body', tone, color, numeric, style, ...rest }: Props) {
  const c = useColors();
  const actualTone = color || tone || 'ink';
  // @ts-ignore - color names are available
  const textColor = c[actualTone] || c.ink;
  return <RNText {...rest} style={[type[variant], { color: textColor }, numeric && tabular, style]} />;
}

export default Text;
