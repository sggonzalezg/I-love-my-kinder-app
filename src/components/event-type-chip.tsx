import { View } from 'react-native';
import {
  BookOpen,
  Users,
  MapPin,
  Zap,
  Pause,
  HelpCircle,
} from 'lucide-react-native';
import type { EventType } from '@/lib/calendar';
import { eventTypeLabel } from '@/lib/calendar';
import { Chip } from '@/components/chip';
import { space, radius } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

const EVENT_ICONS: Record<EventType, React.FC<any>> = {
  workshop: BookOpen,
  meeting: Users,
  outing: MapPin,
  celebration: Zap,
  no_classes: Pause,
  other: HelpCircle,
};

interface EventTypeChipProps {
  type: EventType;
}

export function EventTypeChip({ type }: EventTypeChipProps) {
  const c = useColors();
  const Icon = EVENT_ICONS[type];

  return (
    <View
      style={{
        backgroundColor: c.blue50,
        borderRadius: radius.md,
        paddingHorizontal: space.s3,
        paddingVertical: space.s2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.s1,
      }}
    >
      <Icon size={16} color={c.blue} strokeWidth={2} />
      <Chip label={eventTypeLabel(type)} />
    </View>
  );
}
