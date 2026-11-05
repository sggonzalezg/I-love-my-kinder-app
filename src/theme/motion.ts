// Motion tokens from design.md section 7. Only transform and opacity animate.
import { cubicBezier, Easing } from 'react-native-reanimated';

export const duration = { fast: 120, base: 220, slow: 320, exitBase: 150, beat: 900 } as const;

// design.md: out = cubic-bezier(.22,1,.36,1) for entering, in = cubic-bezier(.4,0,1,1) for leaving.
export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeIn = Easing.bezier(0.4, 0, 1, 1);
export const easeInOut = Easing.bezier(0.77, 0, 0.175, 1);
export const cssEaseOut = cubicBezier(0.22, 1, 0.36, 1);

// design.md: springs on mobile damping 18, stiffness 220 for press and sheets.
export const pressSpring = { damping: 18, stiffness: 220 } as const;

export const listStagger = 40;
export const listRise = 12;
