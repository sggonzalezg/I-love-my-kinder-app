import { FadeInDown, ReduceMotion } from 'react-native-reanimated';

import { duration, easeOut, messageRise } from '@/theme/motion';

export const NUMBER_ROLL = FadeInDown.duration(duration.base)
  .easing(easeOut)
  .withInitialValues({ transform: [{ translateY: messageRise }] })
  .reduceMotion(ReduceMotion.System);
