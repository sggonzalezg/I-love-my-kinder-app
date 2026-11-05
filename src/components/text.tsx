import { Text as RNText, type TextProps } from 'react-native';

import { tabular, type } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

type Variant = keyof typeof type;
type Tone = 'ink' | 'muted' | 'blue' | 'red' | 'ok' | 'wait' | 'onBlue' | 'ground';

type Props = TextProps & { variant?: Variant; tone?: Tone; numeric?: boolean };

/** Every text in the app goes through here so font, size and color come from the tokens. */
export function Text({ variant = 'body', tone = 'ink', numeric, style, ...rest }: Props) {
  const c = useColors();
  return <RNText {...rest} style={[type[variant], { color: c[tone] }, numeric && tabular, style]} />;
}
