import { KeyboardAvoidingView, View } from 'react-native';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { FormActionBar } from '@/components/FormActionBar/FormActionBar';
import { FormTextField } from '@/components/FormTextField/FormTextField';
import { PhotoSourceSheet } from '@/components/PhotoSourceSheet/PhotoSourceSheet';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { ChildPeoplePart } from '@/features/director-children/components/ChildPeoplePart/ChildPeoplePart';
import { ChildPhotoField } from '@/features/director-children/components/ChildPhotoField/ChildPhotoField';
import { FilePartChips } from '@/features/director-children/components/FilePartChips/FilePartChips';
import { HealthLockedCard } from '@/features/director-children/components/HealthLockedCard/HealthLockedCard';
import { CHILD_PHOTO_SOURCE_COPY, DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';
import { useDirectorChildFile } from '@/features/director-children/use-director-child-file';
import { PERSON_KINDS, type PersonKind } from '@/lib/child-people';
import { ALLERGIES_MAX_LENGTH, CHILD_FILE_PARTS, savesWithActionBar, type ChildFilePart, type ChildFileValues, type DirectorChildFile } from '@/lib/director-child-file';
import { initials } from '@/lib/format';
import { BIRTH_DATE_MAX_LENGTH, CHILD_NAME_MAX_LENGTH, NEW_CHILD_MESSAGES } from '@/lib/new-child-form';

import { KEYBOARD_BEHAVIOR, SKELETON_HEIGHTS, styles } from './DirectorChildFileScreen.styles';

const SHOWN_PARTS = [CHILD_FILE_PARTS.data, CHILD_FILE_PARTS.health, CHILD_FILE_PARTS.contacts, CHILD_FILE_PARTS.pickup] as const;

interface DirectorChildFileScreenProps {
  childId: string;
}

export function DirectorChildFileScreen({ childId }: DirectorChildFileScreenProps) {
  const file = useDirectorChildFile(childId);
  const editable = !file.saving;
  const child = file.child;
  const title = child ? [child.firstName, child.lastName].filter(Boolean).join(' ') : '';

  function dataFields(values: ChildFileValues, shownChild: DirectorChildFile) {
    return (
      <>
        <ChildPhotoField
          photoPath={file.photo.path}
          initials={initials(shownChild.firstName, shownChild.lastName ?? '')}
          uploading={file.photo.uploading}
          failed={file.photo.failed}
          cameraDenied={file.photo.cameraDenied}
          disabled={!editable}
          onChange={file.photo.open}
          onOpenSettings={file.photo.openSettings}
        />
        <FormTextField
          label={DIRECTOR_CHILDREN_COPY.firstNames}
          value={values.firstName}
          error={file.fieldError('firstName')}
          editable={editable}
          maxLength={CHILD_NAME_MAX_LENGTH}
          onChange={(value) => file.change('firstName', value)}
        />
        <FormTextField
          label={DIRECTOR_CHILDREN_COPY.lastNames}
          value={values.lastName}
          error={file.fieldError('lastName')}
          editable={editable}
          maxLength={CHILD_NAME_MAX_LENGTH}
          onChange={(value) => file.change('lastName', value)}
        />
        <FormTextField
          label={DIRECTOR_CHILDREN_COPY.birthDate}
          value={values.birthDate}
          error={file.fieldError('birthDate')}
          keyboardType="numbers-and-punctuation"
          editable={editable}
          maxLength={BIRTH_DATE_MAX_LENGTH}
          onChange={(value) => file.change('birthDate', value)}
        />
        <Text variant="small" tone="muted">
          {DIRECTOR_CHILDREN_COPY.dataHelp}
        </Text>
      </>
    );
  }

  function healthFields(values: ChildFileValues, shownChild: DirectorChildFile) {
    if (!shownChild.healthGranted) return <HealthLockedCard />;
    return (
      <FormTextField
        label={DIRECTOR_CHILDREN_COPY.allergies}
        help={DIRECTOR_CHILDREN_COPY.allergiesHelp(shownChild.firstName)}
        value={values.allergies}
        multiline
        editable={editable}
        maxLength={ALLERGIES_MAX_LENGTH}
        onChange={(value) => file.change('allergies', value)}
      />
    );
  }

  function peoplePart(kind: PersonKind) {
    const lists = file.people.lists;
    return (
      <ChildPeoplePart
        kind={kind}
        people={lists ? (kind === PERSON_KINDS.pickup ? lists.pickupPeople : lists.emergencyContacts) : null}
        failed={file.people.failed}
        revealedIds={file.people.revealedIds}
        onReload={file.people.reload}
        onToggleNationalId={file.people.toggleNationalId}
        onEdit={(personId) => file.people.edit(kind, personId)}
        onAdd={() => file.people.add(kind)}
      />
    );
  }

  function partContent(part: ChildFilePart, values: ChildFileValues, shownChild: DirectorChildFile) {
    switch (part) {
      case CHILD_FILE_PARTS.data:
        return dataFields(values, shownChild);
      case CHILD_FILE_PARTS.health:
        return healthFields(values, shownChild);
      case CHILD_FILE_PARTS.contacts:
        return peoplePart(PERSON_KINDS.contact);
      case CHILD_FILE_PARTS.pickup:
        return peoplePart(PERSON_KINDS.pickup);
    }
  }

  function body() {
    if (file.failed) {
      return (
        <View style={styles.error}>
          <Text tone="red">{DIRECTOR_CHILDREN_COPY.fileLoadError}</Text>
          <Button label={DIRECTOR_CHILDREN_COPY.retry} variant="soft" onPress={file.reload} />
        </View>
      );
    }
    if (file.loading) {
      return (
        <View style={styles.form}>
          {SKELETON_HEIGHTS.map((height, index) => (
            <Skeleton key={index} height={height} />
          ))}
        </View>
      );
    }
    if (!child || !file.values) {
      return (
        <View style={styles.error}>
          <Text tone="muted">{DIRECTOR_CHILDREN_COPY.fileNotFound}</Text>
        </View>
      );
    }
    return (
      <View style={styles.form}>
        <FilePartChips parts={SHOWN_PARTS} value={file.part} disabled={!editable} onChange={file.choosePart} />
        {partContent(file.part, file.values, child)}
        {file.saveFailed ? <Banner kind="error" text={NEW_CHILD_MESSAGES.saveFailed} /> : null}
      </View>
    );
  }

  const canSave = child !== null && savesWithActionBar(file.part, child.healthGranted);

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView behavior={KEYBOARD_BEHAVIOR} style={styles.root}>
        <Screen header={<TopBar title={title} backLabel={DIRECTOR_CHILDREN_COPY.backToChildren} />}>{body()}</Screen>
        {canSave ? <FormActionBar label={DIRECTOR_CHILDREN_COPY.save} disabled={file.photo.uploading} loading={file.saving} onPress={file.save} /> : null}
      </KeyboardAvoidingView>
      <PhotoSourceSheet
        visible={file.photo.sourceOpen}
        copy={CHILD_PHOTO_SOURCE_COPY}
        onChoose={file.photo.choose}
        onClose={file.photo.close}
        onDismiss={file.photo.onSourceSheetDismissed}
      />
    </View>
  );
}
