import { Bus, Calendar, MapPin, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';
import type { OutingDetails } from '@/data/outing-permission';
import { formatTime } from '@/lib/dates';
import { formatOutingDay } from '@/lib/outing-permission';
import { useColors } from '@/theme/use-theme';
import { useOutingFactsStyles } from './outing-facts.styles';
import { PERMISSION_COPY } from './outing-permission-copy';

const ICON_SIZE = 20;

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

interface FactRowProps {
  icon: LucideIcon;
  title: string;
  detail?: string;
}

function FactRow({ icon: Icon, title, detail }: FactRowProps) {
  const c = useColors();
  const styles = useOutingFactsStyles();
  return (
    <View style={styles.row}>
      <Icon size={ICON_SIZE} color={c.blue} strokeWidth={1.8} />
      <View style={styles.rowText}>
        <Text variant="bodyStrong">{title}</Text>
        {detail ? (
          <Text variant="small" color="muted">
            {detail}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export function OutingFacts({ outing }: { outing: OutingDetails }) {
  const styles = useOutingFactsStyles();
  const times = PERMISSION_COPY.times(formatTime(new Date(outing.startsAt)), formatTime(new Date(outing.endsAt)));
  return (
    <View style={styles.facts}>
      <View style={styles.card}>
        <FactRow icon={Calendar} title={capitalize(formatOutingDay(outing.startsAt))} detail={times} />
        {outing.location ? <FactRow icon={MapPin} title={outing.location} /> : null}
        {outing.transport ? <FactRow icon={Bus} title={outing.transport} /> : null}
      </View>
      {outing.description ? <Text>{outing.description}</Text> : null}
    </View>
  );
}
