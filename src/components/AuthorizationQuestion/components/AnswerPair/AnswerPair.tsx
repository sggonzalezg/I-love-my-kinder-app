import { Check, X } from 'lucide-react-native';
import { View } from 'react-native';

import { AUTHORIZATION_STATES, type AuthorizationAnswer } from '@/lib/child-authorizations';

import { AnswerOption } from '@/components/AuthorizationQuestion/components/AnswerOption/AnswerOption';
import { styles } from './AnswerPair.styles';

interface AnswerPairProps {
  title: string;
  answer: AuthorizationAnswer;
  disabled: boolean;
  onYes: () => void;
  onNo: () => void;
}

export function AnswerPair({ title, answer, disabled, onYes, onNo }: AnswerPairProps) {
  return (
    <View style={styles.pair} role="group" accessibilityLabel={title}>
      <AnswerOption
        label="Sí, autorizo"
        icon={Check}
        selected={answer === AUTHORIZATION_STATES.granted}
        selectedFill="yesSelected"
        selectedTone="onBlue"
        disabled={disabled}
        onPress={onYes}
      />
      <AnswerOption
        label="No autorizo"
        icon={X}
        selected={answer === AUTHORIZATION_STATES.denied}
        selectedFill="noSelected"
        selectedTone="ground"
        disabled={disabled}
        onPress={onNo}
      />
    </View>
  );
}
