import { View } from 'react-native';
import { Clipboard } from 'lucide-react-native';
import { Text } from '@/components/text';
import { Chip } from '@/components/chip';
import { space, radius } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

interface PermissionCardProps {
  title: string;
  children?: React.ReactNode;
}

export function PermissionCard({ title, children }: PermissionCardProps) {
  const c = useColors();

  return (
    <View
      style={{
        backgroundColor: c.wait50,
        borderRadius: radius.md,
        padding: space.s4,
        marginVertical: space.s4,
        flexDirection: 'row',
        gap: space.s4,
      }}
    >
      <Clipboard size={20} color={c.wait} strokeWidth={2} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: c.ink, marginBottom: space.s1 }}>{title}</Text>
        <Chip label="Falta responder" variant="wait" />
        {children}
      </View>
    </View>
  );
}
