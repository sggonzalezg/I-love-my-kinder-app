import { StyleSheet, View } from 'react-native';

import { Switch } from '@/components/switch';
import { Text } from '@/components/text';
import { CHILD_AUTHORIZATIONS } from '@/legal/texts';
import { authorizationChangeLine, type AuthorizationKey, type AuthorizationState } from '@/lib/authorizations';
import { radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import { AUTHORIZATION_PURPOSE } from './authorization-copy';

interface AuthorizationRowProps {
  authorizationKey: AuthorizationKey;
  childName: string;
  state: AuthorizationState;
  saving: boolean;
  failed: boolean;
  errorMessage: string;
  onChange: (granted: boolean) => void;
  onOpenText: () => void;
}

export function AuthorizationRow({ authorizationKey, childName, state, saving, failed, errorMessage, onChange, onOpenText }: AuthorizationRowProps) {
  const c = useColors();
  const { title } = CHILD_AUTHORIZATIONS[authorizationKey];
  const changeLine = authorizationChangeLine(state);

  return (
    <View style={[styles.row, { backgroundColor: c.surface }]}>
      <View style={styles.text}>
        <Text variant="bodyStrong">{title}</Text>
        <Text variant="small" color="muted">
          {AUTHORIZATION_PURPOSE[authorizationKey](childName)}
        </Text>
        {changeLine && (
          <Text variant="caption" color="muted" numeric>
            {changeLine}
          </Text>
        )}
        <Text variant="smallStrong" color="blue" accessibilityRole="link" onPress={onOpenText} suppressHighlighting>
          Ver texto completo
        </Text>
        {failed && (
          <Text variant="small" color="red" accessibilityLiveRegion="polite">
            {errorMessage}
          </Text>
        )}
      </View>
      <Switch value={state.granted} onChange={onChange} label={title} saving={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: space.s3, padding: space.s4, borderRadius: radius.lg },
  text: { flex: 1, gap: space.s1 },
});
