import { cubicBezier, Easing, FadeInDown, Keyframe, ReduceMotion } from 'react-native-reanimated';

export const duration = { fast: 120, base: 220, slow: 320, exitBase: 150, beat: 900 } as const;

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeIn = Easing.bezier(0.4, 0, 1, 1);
export const easeInOut = Easing.bezier(0.77, 0, 0.175, 1);
export const cssEaseOut = cubicBezier(0.22, 1, 0.36, 1);

const DAY_BEAT_DELAY_MS = 300;

// Design section 7, "Día firmado": scale .6 → 1.18 → .94 → 1 with opacity 0 → 1, once; static with reduced motion.
export const dayBeat = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.6 }] },
  40: { opacity: 1, transform: [{ scale: 1.18 }], easing: easeOut },
  70: { transform: [{ scale: 0.94 }], easing: easeOut },
  100: { opacity: 1, transform: [{ scale: 1 }], easing: easeOut },
})
  .duration(duration.beat)
  .delay(DAY_BEAT_DELAY_MS)
  .reduceMotion(ReduceMotion.System);

const DOT_POP_DELAY_MS = 200;
const DOT_POP_DURATION_MS = 300;

// Design section 7, "New event dot": scale 0 → 1.4 → 1 once the calendar is back; static with reduced motion.
export const dotPop = new Keyframe({
  0: { transform: [{ scale: 0 }] },
  60: { transform: [{ scale: 1.4 }], easing: easeOut },
  100: { transform: [{ scale: 1 }], easing: easeOut },
})
  .duration(DOT_POP_DURATION_MS)
  .delay(DOT_POP_DELAY_MS)
  .reduceMotion(ReduceMotion.System);

export const pressSpring ={ damping: 18, stiffness: 220 } as const;

export const signedRecord = { enter: 320, checkDraw: 420, checkDelay: 160, startScale: 0.96 } as const;

export const listStagger = 40;
export const listRise = 12;

export const listStaggeredItems = 6;
export const messageRise = 8;

/** List entrance: the first rows rise and fade in with a stagger, once per load; nothing with reduced motion. */
export function listEntering(index: number, reduced: boolean) {
  if (reduced || index >= listStaggeredItems) return undefined;
  return FadeInDown.duration(duration.slow)
    .delay(index * listStagger)
    .easing(easeOut)
    .withInitialValues({ transform: [{ translateY: listRise }] });
}
