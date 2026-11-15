import { KeyboardAvoidingView, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { FormActionBar } from '@/components/FormActionBar/FormActionBar';
import { FormTextField } from '@/components/FormTextField/FormTextField';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { FilePartChips } from '@/features/director-children/components/FilePartChips/FilePartChips';
import { HealthLockedCard } from '@/features/director-children/components/HealthLockedCard/HealthLockedCard';
import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';
import { useDirectorChildFile } from '@/features/director-children/use-director-child-file';
import { ALLERGIES_MAX_LENGTH, CHILD_FILE_PARTS, type ChildFileValues, type DirectorChildFile } from '@/lib/director-child-file';
import { initials } from '@/lib/format';
import { BIRTH_DATE_MAX_LENGTH, CHILD_NAME_MAX_LENGTH, NEW_CHILD_MESSAGES } from '@/lib/new-child-form';

import { KEYBOARD_BEHAVIOR, SKELETON_HEIGHTS, styles } from './DirectorChildFileScreen.styles';

const SHOWN_PARTS = [CHILD_FILE_PARTS.data, CHILD_FILE_PARTS.health] as const;

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
        <View style={styles.photo}>
          <Avatar photoPath={shownChild.photoPath} initials={initials(shownChild.firstName, shownChild.lastName ?? '')} size="xl" />
        </View>
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
        {file.part === CHILD_FILE_PARTS.data ? dataFields(file.values, child) : healthFields(file.values, child)}
        {file.saveFailed ? <Banner kind="error" text={NEW_CHILD_MESSAGES.saveFailed} /> : null}
      </View>
    );
  }

  const canSave = child !== null && (file.part === CHILD_FILE_PARTS.data || child.healthGranted);

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView behavior={KEYBOARD_BEHAVIOR} style={styles.root}>
        <Screen header={<TopBar title={title} backLabel={DIRECTOR_CHILDREN_COPY.backToChildren} />}>{body()}</Screen>
        {canSave ? <FormActionBar label={DIRECTOR_CHILDREN_COPY.save} disabled={false} loading={file.saving} onPress={file.save} /> : null}
      </KeyboardAvoidingView>
    </View>
  );
}
