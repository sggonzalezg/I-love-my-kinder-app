import { useFocusEffect } from 'expo-router';
import { Eye, EyeOff, Phone } from 'lucide-react-native';
import { useCallback, useReducer } from 'react';
import { Linking, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { fetchChildFile, type PickupPerson } from '@/data/child-file';
import { useAsync } from '@/data/use-async';
import { CHILD_FILE_ACTIONS, childFileReducer, INITIAL_CHILD_FILE_STATE } from '@/features/child-file/child-file-reducer';
import { CHILD_FILE_COPY } from '@/features/child-file/child-file-copy';
import { AllergyCard } from '@/features/child-file/components/AllergyCard/AllergyCard';
import { ChildHeader } from '@/features/child-file/components/ChildHeader/ChildHeader';
import { CircleActionButton } from '@/features/child-file/components/CircleActionButton/CircleActionButton';
import { PeopleSection } from '@/features/child-file/components/PeopleSection/PeopleSection';
import { PersonRow } from '@/features/child-file/components/PersonRow/PersonRow';
import { allergyState, childFileSubtitle, detailLine, formatNationalId, maskNationalId } from '@/lib/child-file';
import { relationshipLabel } from '@/lib/format';
import { formatUyPhone } from '@/lib/phone';
import { listEntering } from '@/theme/motion';

import { SKELETON_CARD_HEIGHT, SKELETON_HEADER_HEIGHT, SKELETON_LIST_HEIGHT, styles } from './ChildFileScreen.styles';

function nationalIdText(person: PickupPerson, revealed: boolean): string | null {
  if (!person.national_id) return null;
  const shown = revealed ? formatNationalId(person.national_id) : maskNationalId(person.national_id);
  return `${CHILD_FILE_COPY.nationalIdPrefix} ${shown}`;
}

export function ChildFileScreen({ childId }: { childId: string }) {
  const reduced = useReducedMotion();
  const [{ revealedIds }, dispatch] = useReducer(childFileReducer, INITIAL_CHILD_FILE_STATE);
  const { data: file, loading, failed, reload } = useAsync(() => fetchChildFile(childId), childId);

  useFocusEffect(useCallback(() => () => dispatch({ type: CHILD_FILE_ACTIONS.NATIONAL_IDS_HIDDEN }), []));

  const header = <TopBar backLabel={CHILD_FILE_COPY.back} />;

  if (failed) {
    return (
      <Screen header={header}>
        <View style={styles.error}>
          <Text tone="red">{CHILD_FILE_COPY.loadError}</Text>
          <Button label={CHILD_FILE_COPY.retry} variant="soft" onPress={reload} />
        </View>
      </Screen>
    );
  }

  if (loading || !file) {
    return (
      <Screen header={header}>
        <View style={styles.skeleton}>
          <Skeleton height={SKELETON_HEADER_HEIGHT} />
          <Skeleton height={SKELETON_CARD_HEIGHT} />
          <Skeleton height={SKELETON_LIST_HEIGHT} />
        </View>
      </Screen>
    );
  }

  const relationship = (value: string | null) => (value ? relationshipLabel(value) : null);

  return (
    <Screen header={header}>
      <Animated.View entering={listEntering(0, reduced)}>
        <ChildHeader
          firstName={file.firstName}
          lastName={file.lastName}
          photoPath={file.photoPath}
          subtitle={childFileSubtitle(file.groupLabels, file.birthDate, new Date())}
        />
        <AllergyCard state={allergyState(file.allergies)} allergies={file.allergies} />
      </Animated.View>
      {file.emergencyContacts.length ? (
        <Animated.View entering={listEntering(1, reduced)}>
          <PeopleSection title={CHILD_FILE_COPY.emergencyContacts}>
            {file.emergencyContacts.map((contact) => (
              <PersonRow
                key={contact.id}
                name={contact.name}
                detail={detailLine([relationship(contact.relationship), formatUyPhone(contact.phone)])}
                action={<CircleActionButton icon={Phone} label={CHILD_FILE_COPY.call(contact.name)} onPress={() => Linking.openURL(`tel:${contact.phone}`)} />}
              />
            ))}
          </PeopleSection>
        </Animated.View>
      ) : null}
      <Animated.View entering={listEntering(2, reduced)}>
        <PeopleSection title={CHILD_FILE_COPY.pickupPeople} whenEmpty={<Banner kind="warning" text={CHILD_FILE_COPY.noPickupPeople} />}>
          {file.pickupPeople.map((person) => {
            const revealed = revealedIds.includes(person.id);
            const toggleLabel = revealed ? CHILD_FILE_COPY.hideNationalId(person.name) : CHILD_FILE_COPY.showNationalId(person.name);
            return (
              <PersonRow
                key={person.id}
                name={person.name}
                detail={detailLine([relationship(person.relationship), nationalIdText(person, revealed)])}
                action={
                  person.national_id ? (
                    <CircleActionButton
                      icon={revealed ? EyeOff : Eye}
                      label={toggleLabel}
                      onPress={() => dispatch({ type: CHILD_FILE_ACTIONS.NATIONAL_ID_TOGGLED, personId: person.id })}
                    />
                  ) : null
                }
              />
            );
          })}
        </PeopleSection>
      </Animated.View>
      <View style={styles.bottomSpace} />
    </Screen>
  );
}
