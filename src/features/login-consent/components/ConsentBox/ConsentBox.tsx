import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/text';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { CHECK_ICON_SIZE, styles, useConsentBoxColorStyles } from './ConsentBox.styles';

const OPEN_DOCUMENT_ACTION = 'openDocument';

interface ConsentBoxProps {
  checked: boolean;
  missing: boolean;
  disabled: boolean;
  textBefore: string;
  linkText: string;
  textAfter: string;
  onToggle: () => void;
  onOpenDocument: () => void;
}

export function ConsentBox({ checked, missing, disabled, textBefore, linkText, textAfter, onToggle, onOpenDocument }: ConsentBoxProps) {
  const colors = useColors();
  const colorStyles = useConsentBoxColorStyles();
  const boxColors = checked ? colorStyles.checked : missing ? colorStyles.missing : colorStyles.unchecked;

  return (
    <Pressable
      style={styles.row}
      disabled={disabled}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={`${textBefore}${linkText}${textAfter}`}
      accessibilityActions={[{ name: OPEN_DOCUMENT_ACTION, label: linkText }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === OPEN_DOCUMENT_ACTION) onOpenDocument();
      }}>
      <View style={[styles.box, boxColors]}>{checked && <Check size={CHECK_ICON_SIZE} color={colors.onBlue} strokeWidth={iconStroke.bold} />}</View>
      <Text style={styles.label}>
        {textBefore}
        <Text tone="blue" style={styles.link} accessibilityRole="link" onPress={onOpenDocument}>
          {linkText}
        </Text>
        {textAfter}
      </Text>
    </Pressable>
  );
}
