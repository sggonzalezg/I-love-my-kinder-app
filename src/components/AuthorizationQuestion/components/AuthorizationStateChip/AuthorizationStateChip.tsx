import { Check, Clock, X, type LucideIcon } from 'lucide-react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import { Chip, type ChipVariant } from '@/components/chip';
import { AUTHORIZATION_STATES, type AuthorizationAnswer } from '@/lib/child-authorizations';
import { duration, easeOut } from '@/theme/motion';

const STATE_CHIPS: Record<AuthorizationAnswer, { label: string; variant: ChipVariant; icon: LucideIcon }> = {
  [AUTHORIZATION_STATES.unanswered]: { label: 'Falta responder', variant: 'wait', icon: Clock },
  [AUTHORIZATION_STATES.granted]: { label: 'Autorizado', variant: 'ok', icon: Check },
  [AUTHORIZATION_STATES.denied]: { label: 'No autorizado', variant: 'grey', icon: X },
};

interface AuthorizationStateChipProps {
  state: AuthorizationAnswer;
}

export function AuthorizationStateChip({ state }: AuthorizationStateChipProps) {
  const reduced = useReducedMotion();
  const { label, variant, icon } = STATE_CHIPS[state];

  return (
    <Animated.View key={state} entering={reduced ? undefined : FadeIn.duration(duration.base).easing(easeOut)}>
      <Chip label={label} variant={variant} icon={icon} />
    </Animated.View>
  );
}
