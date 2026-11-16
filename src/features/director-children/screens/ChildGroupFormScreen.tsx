import { Stack } from 'expo-router';
import { X } from 'lucide-react-native';
import { View } from 'react-native';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { FormActionBar } from '@/components/FormActionBar/FormActionBar';
import { Screen } from '@/components/screen';
import { SegmentedControl } from '@/components/segmented-control';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { RoomChoiceChips } from '@/features/director-children/components/RoomChoiceChips/RoomChoiceChips';
import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';
import { useGroupForm } from '@/features/director-children/use-group-form';

import { SKELETON_HEIGHTS, styles } from './ChildGroupFormScreen.styles';

const SCREEN_OPTIONS = { presentation: 'fullScreenModal' } as const;

interface ChildGroupFormScreenProps {
  childId: string;
  enrollmentId: string | null;
}

export function ChildGroupFormScreen({ childId, enrollmentId }: ChildGroupFormScreenProps) {
  const form = useGroupForm(childId, enrollmentId);
  const editable = !form.saving;
  const mode = enrollmentId ? 'change' : 'enroll';
  const ready = !form.loading && !form.failed && !form.notFound;

  function body() {
    if (form.failed) {
      return (
        <View style={styles.error}>
          <Text tone="red">{DIRECTOR_CHILDREN_COPY.choicesLoadError}</Text>
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
          <Text tone="muted">{DIRECTOR_CHILDREN_COPY.enrollmentNotFound}</Text>
        </View>
      );
    }
    const shiftError = form.fieldError('shiftId');
    return (
      <View style={styles.form}>
        <RoomChoiceChips
          label={DIRECTOR_CHILDREN_COPY.room}
          choices={form.choices.rooms}
          value={form.values.roomId}
          error={form.fieldError('roomId')}
          disabled={!editable}
          onChange={(roomId) => form.change('roomId', roomId)}
        />
        <View style={styles.shift}>
          <Text variant="label">{DIRECTOR_CHILDREN_COPY.shift}</Text>
          <SegmentedControl options={form.choices.shifts} value={form.values.shiftId ?? ''} onChange={(shiftId) => editable && form.change('shiftId', shiftId)} />
          {shiftError ? (
            <Text variant="small" tone="red">
              {shiftError}
            </Text>
          ) : null}
        </View>
        {form.saveError ? <Banner kind="error" text={form.saveError} /> : null}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <Screen header={<TopBar title={DIRECTOR_CHILDREN_COPY.groupFormTitles[mode]} backLabel={DIRECTOR_CHILDREN_COPY.closeForm} backIcon={X} />}>{body()}</Screen>
      {ready ? <FormActionBar label={DIRECTOR_CHILDREN_COPY.groupFormActions[mode]} disabled={false} loading={form.saving} onPress={form.save} /> : null}
    </View>
  );
}
