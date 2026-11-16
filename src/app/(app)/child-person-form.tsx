import { useLocalSearchParams } from 'expo-router';

import { PersonFormScreen } from '@/features/director-children/screens/PersonFormScreen';
import { PERSON_KINDS, type PersonKind } from '@/lib/child-people';

export default function ChildPersonFormRoute() {
  const { childId, kind, personId } = useLocalSearchParams<{ childId: string; kind: PersonKind; personId?: string }>();
  return <PersonFormScreen childId={childId} kind={kind === PERSON_KINDS.pickup ? PERSON_KINDS.pickup : PERSON_KINDS.contact} personId={personId ?? null} />;
}
