import { Search } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

import { useColors } from '@/theme/use-theme';

import { SEARCH_ICON_SIZE, styles, useSearchFieldColorStyles } from './ChildSearchField.styles';

interface ChildSearchFieldProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export function ChildSearchField({ value, placeholder, onChange }: ChildSearchFieldProps) {
  const colors = useColors();
  const colorStyles = useSearchFieldColorStyles();
  return (
    <View style={[styles.field, colorStyles.field]}>
      <Search size={SEARCH_ICON_SIZE} color={colors.muted} strokeWidth={1.8} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        accessibilityLabel={placeholder}
        autoCorrect={false}
        returnKeyType="search"
        style={[styles.input, colorStyles.input]}
      />
    </View>
  );
}
