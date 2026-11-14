import { Bus, Calendar, CalendarX, Footprints, Palette, PartyPopper, Users, type LucideIcon } from 'lucide-react-native';

import type { IconChipOption } from '@/features/calendar/components/IconChips/IconChips';
import { eventTypeLabel, type EventType } from '@/lib/calendar';
import { FORM_EVENT_TYPES } from '@/lib/event-form';
import { OUTING_TRANSPORT_CHOICES, TRANSPORT_LABELS, type TransportChoice } from '@/lib/outing-fields';

const EVENT_TYPE_ICONS: Record<EventType, LucideIcon> = {
  workshop: Palette,
  meeting: Users,
  outing: Bus,
  celebration: PartyPopper,
  no_classes: CalendarX,
  other: Calendar,
};

const TRANSPORT_ICONS: Record<TransportChoice, LucideIcon> = {
  walking: Footprints,
  hiredBus: Bus,
  other: Calendar,
};

export const EVENT_TYPE_OPTIONS: IconChipOption<EventType>[] = FORM_EVENT_TYPES.map((type) => ({
  value: type,
  label: eventTypeLabel(type),
  icon: EVENT_TYPE_ICONS[type],
}));

export const TRANSPORT_OPTIONS: IconChipOption<TransportChoice>[] = OUTING_TRANSPORT_CHOICES.map((choice) => ({
  value: choice,
  label: TRANSPORT_LABELS[choice],
  icon: TRANSPORT_ICONS[choice],
}));
