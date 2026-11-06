import { View, Pressable } from 'react-native';
import { Bell as BellIcon } from 'lucide-react-native';
import { Text } from './text';
import { useTheme } from '@/theme/use-theme';
import { Link } from 'expo-router';

interface BellProps {
  count?: number;
  onPress?: () => void;
  href?: string;
}

export function Bell({ count, onPress, href = '/notices' }: BellProps) {
  const { colors, spacing, radius } = useTheme();

  const content = (
    <View style={{ position: 'relative' }}>
      <BellIcon size={24} color={colors.onSurface} />
      {count && count > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            backgroundColor: colors.error,
            borderRadius: radius.full,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.onError }}>
            {count > 9 ? '9+' : count}
          </Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} hitSlop={8}>
        {content}
      </Pressable>
    );
  }

  return (
    <Link href={href as any} asChild>
      <Pressable hitSlop={8}>
        {content}
      </Pressable>
    </Link>
  );
}
