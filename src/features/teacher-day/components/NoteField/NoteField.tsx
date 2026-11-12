import { TextInput, View } from 'react-native';

import { Text } from '@/components/text';
import { FieldLabel } from '@/features/teacher-day/components/FieldLabel/FieldLabel';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { useColors } from '@/theme/use-theme';

import { styles, useNoteFieldStyles } from './NoteField.styles';

interface NoteFieldProps {
  value: string;
  disabled: boolean;
  onChange: (notes: string) => void;
}

export function NoteField({ value, disabled, onChange }: NoteFieldProps) {
  const colors = useColors();
  const themed = useNoteFieldStyles();
  return (
    <View>
      <FieldLabel title={TEACHER_DAY_COPY.note} aside={TEACHER_DAY_COPY.optional} />
      <TextInput
        value={value}
        onChangeText={onChange}
        editable={!disabled}
        multiline
        placeholder={TEACHER_DAY_COPY.notePlaceholder}
        placeholderTextColor={colors.muted}
        accessibilityLabel={TEACHER_DAY_COPY.note}
        accessibilityHint={TEACHER_DAY_COPY.noteHint}
        style={[styles.input, themed.input]}
      />
      <Text variant="small" tone="muted" style={styles.hint}>
        {TEACHER_DAY_COPY.noteHint}
      </Text>
    </View>
  );
}
