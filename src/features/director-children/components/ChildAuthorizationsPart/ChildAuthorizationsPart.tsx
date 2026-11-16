import { Check, Clock, X, type LucideIcon } from 'lucide-react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Chip, type ChipVariant } from '@/components/chip';
import { PeopleSection } from '@/components/PeopleSection/PeopleSection';
import { PersonRow } from '@/components/PersonRow/PersonRow';
import { FilePartLoadState } from '@/features/director-children/components/FilePartLoadState/FilePartLoadState';
import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';
import type { AuthorizationAnswer, SignedAuthorization } from '@/lib/child-authorizations';
import { listEntering } from '@/theme/motion';

import { styles } from './ChildAuthorizationsPart.styles';

const ANSWER_CHIPS: Record<AuthorizationAnswer, { variant: ChipVariant; icon: LucideIcon }> = {
  granted: { variant: 'ok', icon: Check },
  denied: { variant: 'grey', icon: X },
  unanswered: { variant: 'wait', icon: Clock },
};

interface ChildAuthorizationsPartProps {
  authorizations: SignedAuthorization[] | null;
  failed: boolean;
  onReload: () => void;
}

/** Read only: each family gives or withdraws them in the app (F3). */
export function ChildAuthorizationsPart({ authorizations, failed, onReload }: ChildAuthorizationsPartProps) {
  const reduced = useReducedMotion();
  if (!authorizations) return <FilePartLoadState failed={failed} errorText={DIRECTOR_CHILDREN_COPY.authorizationsLoadError} onReload={onReload} />;

  return (
    <Animated.View entering={listEntering(0, reduced)} style={styles.part}>
      <PeopleSection>
        {authorizations.map(({ key, state, detail }) => (
          <PersonRow
            key={key}
            name={DIRECTOR_CHILDREN_COPY.authorizationTitles[key]}
            detail={detail}
            action={<Chip label={DIRECTOR_CHILDREN_COPY.authorizationAnswers[state]} icon={ANSWER_CHIPS[state].icon} variant={ANSWER_CHIPS[state].variant} />}
          />
        ))}
      </PeopleSection>
    </Animated.View>
  );
}
