import { View } from 'react-native';

import { Button } from '@/components/button';
import type { AnswerIntent } from './outing-permission-reducer';
import { PERMISSION_COPY } from './outing-permission-copy';
import { styles } from './permission-answers.styles';

interface PermissionAnswersProps {
  saving: boolean;
  onAnswer: (intent: AnswerIntent) => void;
}

export function PermissionAnswers({ saving, onAnswer }: PermissionAnswersProps) {
  return (
    <View style={styles.answers}>
      <Button label={PERMISSION_COPY.decline} variant="plain" disabled={saving} style={styles.answer} onPress={() => onAnswer('decline')} />
      <Button label={PERMISSION_COPY.authorize} variant="primary" loading={saving} style={styles.answer} onPress={() => onAnswer('authorize')} />
    </View>
  );
}
