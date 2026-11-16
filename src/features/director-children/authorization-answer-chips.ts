import { Check, Clock, X, type LucideIcon } from 'lucide-react-native';

import type { ChipVariant } from '@/components/chip';
import type { AuthorizationAnswer } from '@/lib/child-authorizations';

export const AUTHORIZATION_ANSWER_CHIPS: Record<AuthorizationAnswer, { variant: ChipVariant; icon: LucideIcon }> = {
  granted: { variant: 'ok', icon: Check },
  denied: { variant: 'grey', icon: X },
  unanswered: { variant: 'wait', icon: Clock },
};
