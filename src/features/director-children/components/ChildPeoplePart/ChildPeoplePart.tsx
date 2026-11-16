import { Eye, EyeOff, Pencil, Plus } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Button } from '@/components/button';
import { CircleActionButton } from '@/components/CircleActionButton/CircleActionButton';
import { IconButton } from '@/components/icon-button';
import { PeopleSection } from '@/components/PeopleSection/PeopleSection';
import { PersonRow } from '@/components/PersonRow/PersonRow';
import { Text } from '@/components/text';
import { FilePartLoadState } from '@/features/director-children/components/FilePartLoadState/FilePartLoadState';
import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';
import { PERSON_KINDS, personDetailLine, personNationalId, personNationalIdLine, type ChildPerson, type PersonKind } from '@/lib/child-people';
import { listEntering } from '@/theme/motion';

import { styles } from './ChildPeoplePart.styles';

interface ChildPeoplePartProps {
  kind: PersonKind;
  people: ChildPerson[] | null;
  failed: boolean;
  revealedIds: string[];
  onReload: () => void;
  onToggleNationalId: (personId: string) => void;
  onEdit: (personId: string) => void;
  onAdd: () => void;
}

export function ChildPeoplePart({ kind, people, failed, revealedIds, onReload, onToggleNationalId, onEdit, onAdd }: ChildPeoplePartProps) {
  const reduced = useReducedMotion();
  const isPickup = kind === PERSON_KINDS.pickup;

  if (!people) return <FilePartLoadState failed={failed} errorText={DIRECTOR_CHILDREN_COPY.peopleLoadError} onReload={onReload} />;

  function nationalIdButton(person: ChildPerson, nationalId: string | null) {
    if (!nationalId) return null;
    const revealed = revealedIds.includes(person.id);
    return (
      <CircleActionButton
        icon={revealed ? EyeOff : Eye}
        label={revealed ? DIRECTOR_CHILDREN_COPY.hideNationalId(person.name) : DIRECTOR_CHILDREN_COPY.showNationalId(person.name)}
        onPress={() => onToggleNationalId(person.id)}
      />
    );
  }

  return (
    <Animated.View entering={listEntering(0, reduced)} style={styles.part}>
      <PeopleSection
        whenEmpty={
          <Text tone="muted">{isPickup ? DIRECTOR_CHILDREN_COPY.noPickupPeople : DIRECTOR_CHILDREN_COPY.noContacts}</Text>
        }>
        {people.map((person) => {
          const nationalId = personNationalId(person);
          return (
            <PersonRow
              key={person.id}
              name={person.name}
              detail={personDetailLine(person)}
              secondDetail={nationalId ? personNationalIdLine(nationalId, revealedIds.includes(person.id)) : null}
              action={
                <View style={styles.actions}>
                  {nationalIdButton(person, nationalId)}
                  <IconButton icon={Pencil} ghost label={DIRECTOR_CHILDREN_COPY.editPerson(person.name)} onPress={() => onEdit(person.id)} />
                </View>
              }
            />
          );
        })}
      </PeopleSection>
      <Button
        label={isPickup ? DIRECTOR_CHILDREN_COPY.addPickupPerson : DIRECTOR_CHILDREN_COPY.addContact}
        icon={Plus}
        variant="soft"
        block
        onPress={onAdd}
      />
      {isPickup ? (
        <Text variant="small" tone="muted">
          {DIRECTOR_CHILDREN_COPY.pickupHelp}
        </Text>
      ) : null}
    </Animated.View>
  );
}
