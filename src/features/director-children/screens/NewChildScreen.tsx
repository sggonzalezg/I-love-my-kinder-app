import { Stack } from 'expo-router';
import { X } from 'lucide-react-native';
import { KeyboardAvoidingView, View } from 'react-native';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { FormActionBar } from '@/components/FormActionBar/FormActionBar';
import { FormTextField } from '@/components/FormTextField/FormTextField';
import { Screen } from '@/components/screen';
import { SegmentedControl } from '@/components/segmented-control';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { RoomChoiceChips } from '@/features/director-children/components/RoomChoiceChips/RoomChoiceChips';
import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';
import { useNewChildForm } from '@/features/director-children/use-new-child-form';
import { BIRTH_DATE_MAX_LENGTH, CHILD_NAME_MAX_LENGTH, NATIONAL_ID_MAX_LENGTH } from '@/lib/new-child-form';

import { KEYBOARD_BEHAVIOR, SKELETON_HEIGHT, styles } from './NewChildScreen.styles';

const SCREEN_OPTIONS = { presentation: 'fullScreenModal' } as const;

export function NewChildScreen() {
  const form = useNewChildForm();
  const editable = !form.saving;

  function groupFields() {
    if (form.choicesFailed) {
      return (
        <View style={styles.error}>
          <Text tone="red">{DIRECTOR_CHILDREN_COPY.choicesLoadError}</Text>
          <Button label={DIRECTOR_CHILDREN_COPY.retry} variant="soft" onPress={form.reloadChoices} />
        </View>
      );
    }
    if (form.choicesLoading) return <Skeleton height={SKELETON_HEIGHT} />;
    if (!form.rooms.length) return <Banner kind="info" text={DIRECTOR_CHILDREN_COPY.noRooms} />;
    const shiftError = form.fieldError('shiftId');
    return (
      <>
        <RoomChoiceChips
          label={DIRECTOR_CHILDREN_COPY.group}
          choices={form.rooms}
          value={form.values.roomId}
          error={form.fieldError('roomId')}
          disabled={!editable}
          onChange={(roomId) => form.change('roomId', roomId)}
        />
        <View style={styles.shift} accessibilityLabel={DIRECTOR_CHILDREN_COPY.shift}>
          <SegmentedControl options={form.shifts} value={form.values.shiftId ?? ''} onChange={(shiftId) => editable && form.change('shiftId', shiftId)} />
          {shiftError ? (
            <Text variant="small" tone="red">
              {shiftError}
            </Text>
          ) : null}
        </View>
      </>
    );
  }

  return (
    <View style={styles.root}>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <KeyboardAvoidingView behavior={KEYBOARD_BEHAVIOR} style={styles.root}>
        <Screen header={<TopBar title={DIRECTOR_CHILDREN_COPY.newChild} backLabel={DIRECTOR_CHILDREN_COPY.backToChildren} backIcon={X} />}>
          <View style={styles.form}>
            <FormTextField
              label={DIRECTOR_CHILDREN_COPY.firstNames}
              value={form.values.firstName}
              error={form.fieldError('firstName')}
              editable={editable}
              maxLength={CHILD_NAME_MAX_LENGTH}
              onChange={(value) => form.change('firstName', value)}
            />
            <FormTextField
              label={DIRECTOR_CHILDREN_COPY.lastNames}
              value={form.values.lastName}
              error={form.fieldError('lastName')}
              editable={editable}
              maxLength={CHILD_NAME_MAX_LENGTH}
              onChange={(value) => form.change('lastName', value)}
            />
            <FormTextField
              label={DIRECTOR_CHILDREN_COPY.birthDate}
              help={DIRECTOR_CHILDREN_COPY.birthDateHelp}
              value={form.values.birthDate}
              error={form.fieldError('birthDate')}
              keyboardType="numbers-and-punctuation"
              editable={editable}
              maxLength={BIRTH_DATE_MAX_LENGTH}
              onChange={(value) => form.change('birthDate', value)}
            />
            <FormTextField
              label={DIRECTOR_CHILDREN_COPY.nationalId}
              help={DIRECTOR_CHILDREN_COPY.nationalIdHelp}
              value={form.values.nationalId}
              error={form.fieldError('nationalId')}
              keyboardType="numbers-and-punctuation"
              editable={editable}
              maxLength={NATIONAL_ID_MAX_LENGTH}
              onChange={(value) => form.change('nationalId', value)}
            />
            {groupFields()}
            <Text variant="small" tone="muted">
              {DIRECTOR_CHILDREN_COPY.dataHelp}
            </Text>
            {form.formError ? <Banner kind="error" text={form.formError} /> : null}
          </View>
        </Screen>
        <FormActionBar label={DIRECTOR_CHILDREN_COPY.createChild} disabled={!form.rooms.length} loading={form.saving} onPress={form.save} />
      </KeyboardAvoidingView>
    </View>
  );
}
