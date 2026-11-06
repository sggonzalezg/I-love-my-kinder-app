import { Pressable } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/theme/use-theme';
import { Link } from 'expo-router';

interface ChatIconProps {
  onPress?: () => void;
  href?: string;
}

export function ChatIcon({ onPress, href = '/chat' }: ChatIconProps) {
  const { colors } = useTheme();

  const icon = <MessageSquare size={24} color={colors.onSurface} />;

  if (onPress) {
    return (
      <Pressable onPress={onPress} hitSlop={8}>
        {icon}
      </Pressable>
    );
  }

  return (
    <Link href={href as any} asChild>
      <Pressable hitSlop={8}>
        {icon}
      </Pressable>
    </Link>
  );
}
