import { cubicBezier, Easing } from 'react-native-reanimated';

export const duration = { fast: 120, base: 220, slow: 320, exitBase: 150, beat: 900 } as const;

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeIn = Easing.bezier(0.4, 0, 1, 1);
export const easeInOut = Easing.bezier(0.77, 0, 0.175, 1);
export const cssEaseOut = cubicBezier(0.22, 1, 0.36, 1);

export const pressSpring = { damping: 18, stiffness: 220 } as const;

export const signedRecord = { enter: 320, checkDraw: 420, checkDelay: 160, startScale: 0.96 } as const;

export const listStagger = 40;
export const listRise = 12;
