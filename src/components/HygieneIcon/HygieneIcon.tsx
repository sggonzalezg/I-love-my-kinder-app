import Svg, { Path } from 'react-native-svg';

import type { HygieneKind } from '@/lib/routine';

import { HYGIENE_ICON_STROKE } from './HygieneIcon.styles';

// Drawn from the mockup sprite (design/mockups/assets/icons.svg): lucide has no diaper or toilet.
const PATHS: Record<HygieneKind, string[]> = {
  diaper: ['M3 7h18v4c-3 .4-5.4 2.8-6 6.5H9C8.4 13.8 6 11.4 3 11z', 'M7 7v3M17 7v3'],
  bathroom: ['M5 3h5v8H5z', 'M5 11h15c0 3-1.6 5.3-4 6.5V21h-6v-3.1A7 7 0 0 1 5.5 11'],
};

interface HygieneIconProps {
  kind: HygieneKind;
  size: number;
  color: string;
}

export function HygieneIcon({ kind, size, color }: HygieneIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={HYGIENE_ICON_STROKE} strokeLinecap="round" strokeLinejoin="round">
      {PATHS[kind].map((path) => (
        <Path key={path} d={path} />
      ))}
    </Svg>
  );
}
