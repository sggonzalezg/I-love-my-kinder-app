import { ScrollView, View } from 'react-native';

import { Button } from '@/components/button';
import { CheckRow } from '@/components/CheckRow/CheckRow';
import { Sheet } from '@/components/sheet';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { DIRECTOR_ROOMS_COPY } from '@/features/director-rooms/director-rooms-copy';
import type { GroupTeachersSheetControl } from '@/features/director-rooms/use-group-teachers-sheet';
import { isChoiceChecked } from '@/lib/group-teachers';

import { SKELETON_ROW_HEIGHT, SKELETON_ROWS, styles } from './GroupTeachersSheet.styles';

export function GroupTeachersSheet({ control }: { control: GroupTeachersSheetControl }) {
  const { state, choices, loadFailed, reloadChoices, close, toggle, save } = control;
  const isSaving = state.status === 'saving';

  return (
    <Sheet visible={state.group !== null} onClose={isSaving ? () => undefined : close} sheetStyle={styles.sheet} scrollableContent>
      <View style={styles.content}>
        <Text variant="title" accessibilityRole="header">
          {state.group ? DIRECTOR_ROOMS_COPY.teachersSheetTitle(state.group.label) : ''}
        </Text>
        {loadFailed ? (
          <View style={styles.error}>
            <Text tone="red">{DIRECTOR_ROOMS_COPY.teachersLoadError}</Text>
            <Button label={DIRECTOR_ROOMS_COPY.retry} variant="soft" onPress={reloadChoices} />
          </View>
        ) : null}
        {!loadFailed && choices === null ? (
          <View style={styles.skeleton}>
            {Array.from({ length: SKELETON_ROWS }, (_, index) => (
              <Skeleton key={index} height={SKELETON_ROW_HEIGHT} />
            ))}
          </View>
        ) : null}
        {choices && !choices.length ? <Text tone="muted">{DIRECTOR_ROOMS_COPY.noActiveTeachers}</Text> : null}
        {choices?.length ? (
          <ScrollView style={styles.list}>
            {choices.map((choice, index) => (
              <CheckRow
                key={choice.teacherId}
                label={choice.fullName}
                detail={choice.otherGroupsLine}
                checked={isChoiceChecked(choice, state.toggledIds)}
                separated={index > 0}
                disabled={isSaving}
                onToggle={() => toggle(choice.teacherId)}
              />
            ))}
          </ScrollView>
        ) : null}
        {state.status === 'failed' ? <Text tone="red">{DIRECTOR_ROOMS_COPY.saveTeachersError}</Text> : null}
        <View style={styles.actions}>
          <Button label={DIRECTOR_ROOMS_COPY.saveTeachers} block loading={isSaving} disabled={!choices} onPress={save} />
          {isSaving ? null : <Button label={DIRECTOR_ROOMS_COPY.cancel} variant="plain" block onPress={close} />}
        </View>
      </View>
    </Sheet>
  );
}
