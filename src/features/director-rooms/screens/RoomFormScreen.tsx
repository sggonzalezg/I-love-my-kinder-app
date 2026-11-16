import { Stack } from 'expo-router';
import { X } from 'lucide-react-native';
import { KeyboardAvoidingView, View } from 'react-native';

import { Banner } from '@/components/banner';
import { FormActionBar } from '@/components/FormActionBar/FormActionBar';
import { FormTextField } from '@/components/FormTextField/FormTextField';
import { Screen } from '@/components/screen';
import { TopBar } from '@/components/top-bar';
import { DIRECTOR_ROOMS_COPY } from '@/features/director-rooms/director-rooms-copy';
import { useRoomForm } from '@/features/director-rooms/use-room-form';
import { ROOM_AGE_MAX_LENGTH, ROOM_NAME_MAX_LENGTH, type RoomFormValues } from '@/lib/room-form';

import { KEYBOARD_BEHAVIOR, styles } from './RoomFormScreen.styles';

const SCREEN_OPTIONS = { presentation: 'fullScreenModal' } as const;

interface RoomFormScreenProps {
  roomId: string | null;
  initialValues: RoomFormValues;
}

export function RoomFormScreen({ roomId, initialValues }: RoomFormScreenProps) {
  const { state, canSave, change, save } = useRoomForm(roomId, initialValues);
  const saving = state.status === 'saving';
  const isEdit = roomId !== null;

  return (
    <View style={styles.root}>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <KeyboardAvoidingView behavior={KEYBOARD_BEHAVIOR} style={styles.root}>
        <Screen
          header={
            <TopBar
              title={isEdit ? DIRECTOR_ROOMS_COPY.editRoomTitle(initialValues.name) : DIRECTOR_ROOMS_COPY.newRoom}
              backLabel={DIRECTOR_ROOMS_COPY.back}
              backIcon={X}
            />
          }
        >
          <View style={styles.form}>
            <FormTextField
              label={DIRECTOR_ROOMS_COPY.roomName}
              value={state.values.name}
              editable={!saving}
              maxLength={ROOM_NAME_MAX_LENGTH}
              onChange={(value) => change('name', value)}
            />
            <FormTextField
              label={DIRECTOR_ROOMS_COPY.roomAge}
              labelAside={DIRECTOR_ROOMS_COPY.optional}
              value={state.values.age}
              editable={!saving}
              maxLength={ROOM_AGE_MAX_LENGTH}
              onChange={(value) => change('age', value)}
            />
            {state.status === 'failed' ? <Banner kind="error" text={DIRECTOR_ROOMS_COPY.saveRoomError} /> : null}
          </View>
        </Screen>
        <FormActionBar
          label={isEdit ? DIRECTOR_ROOMS_COPY.saveRoom : DIRECTOR_ROOMS_COPY.createRoom}
          disabled={!canSave}
          loading={saving}
          onPress={save}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
