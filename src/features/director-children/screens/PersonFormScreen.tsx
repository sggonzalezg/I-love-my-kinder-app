import { Stack } from 'expo-router';
import { X } from 'lucide-react-native';
import { KeyboardAvoidingView, View } from 'react-native';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { FormActionBar } from '@/components/FormActionBar/FormActionBar';
import { FormTextField } from '@/components/FormTextField/FormTextField';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';
import { usePersonForm } from '@/features/director-children/use-person-form';
import { PERSON_KINDS, PERSON_NAME_MAX_LENGTH, PHONE_MAX_LENGTH, RELATIONSHIP_MAX_LENGTH, type PersonKind } from '@/lib/child-people';
import { NATIONAL_ID_MAX_LENGTH } from '@/lib/new-child-form';

import { KEYBOARD_BEHAVIOR, SKELETON_HEIGHTS, styles } from './PersonFormScreen.styles';

const SCREEN_OPTIONS = { presentation: 'fullScreenModal' } as const;

interface PersonFormScreenProps {
  childId: string;
  kind: PersonKind;
  personId: string | null;
}

export function PersonFormScreen({ childId, kind, personId }: PersonFormScreenProps) {
  const form = usePersonForm(childId, kind, personId);
  const editable = !form.saving;
  const titles = DIRECTOR_CHILDREN_COPY.personFormTitles[kind];
  const ready = !form.loading && !form.failed && !form.notFound;

  function body() {
    if (form.failed) {
      return (
        <View style={styles.error}>
          <Text tone="red">{DIRECTOR_CHILDREN_COPY.personLoadError}</Text>
          <Button label={DIRECTOR_CHILDREN_COPY.retry} variant="soft" onPress={form.reload} />
        </View>
      );
    }
    if (form.loading) {
      return (
        <View style={styles.form}>
          {SKELETON_HEIGHTS.map((height, index) => (
            <Skeleton key={index} height={height} />
          ))}
        </View>
      );
    }
    if (form.notFound) {
      return (
        <View style={styles.error}>
          <Text tone="muted">{DIRECTOR_CHILDREN_COPY.personNotFound}</Text>
        </View>
      );
    }
    return (
      <View style={styles.form}>
        <FormTextField
          label={DIRECTOR_CHILDREN_COPY.personName}
          value={form.values.name}
          error={form.fieldError('name')}
          editable={editable}
          maxLength={PERSON_NAME_MAX_LENGTH}
          onChange={(value) => form.change('name', value)}
        />
        <FormTextField
          label={DIRECTOR_CHILDREN_COPY.relationship}
          value={form.values.relationship}
          editable={editable}
          maxLength={RELATIONSHIP_MAX_LENGTH}
          onChange={(value) => form.change('relationship', value)}
        />
        <FormTextField
          label={DIRECTOR_CHILDREN_COPY.phone}
          value={form.values.phone}
          error={form.fieldError('phone')}
          keyboardType="phone-pad"
          editable={editable}
          maxLength={PHONE_MAX_LENGTH}
          onChange={(value) => form.change('phone', value)}
        />
        {kind === PERSON_KINDS.pickup ? (
          <FormTextField
            label={DIRECTOR_CHILDREN_COPY.nationalId}
            help={DIRECTOR_CHILDREN_COPY.pickupNationalIdHelp}
            value={form.values.nationalId}
            error={form.fieldError('nationalId')}
            keyboardType="numbers-and-punctuation"
            editable={editable}
            maxLength={NATIONAL_ID_MAX_LENGTH}
            onChange={(value) => form.change('nationalId', value)}
          />
        ) : null}
        {form.saveFailed ? <Banner kind="error" text={DIRECTOR_CHILDREN_COPY.personSaveFailed} /> : null}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <KeyboardAvoidingView behavior={KEYBOARD_BEHAVIOR} style={styles.root}>
        <Screen header={<TopBar title={personId ? titles.edit : titles.add} backLabel={DIRECTOR_CHILDREN_COPY.closeForm} backIcon={X} />}>{body()}</Screen>
        {ready ? <FormActionBar label={DIRECTOR_CHILDREN_COPY.save} disabled={false} loading={form.saving} onPress={form.save} /> : null}
      </KeyboardAvoidingView>
    </View>
  );
}
