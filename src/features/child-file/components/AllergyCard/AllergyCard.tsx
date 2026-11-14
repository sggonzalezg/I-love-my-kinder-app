import { CircleAlert, Info, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { CHILD_FILE_COPY } from '@/features/child-file/child-file-copy';
import type { AllergyState } from '@/lib/child-file';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import type { ColorName } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { ALLERGY_CARD_ICON_SIZE, styles } from './AllergyCard.styles';

const CARD_LOOKS: Record<AllergyState, { icon: LucideIcon; iconColor: ColorName; background: ColorName; title: string }> = {
  listed: { icon: CircleAlert, iconColor: 'red', background: 'red50', title: CHILD_FILE_COPY.allergiesTitle },
  none: { icon: Info, iconColor: 'muted', background: 'raised', title: CHILD_FILE_COPY.noAllergies },
};

interface AllergyCardProps {
  state: AllergyState;
  allergies: string | null;
}

export function AllergyCard({ state, allergies }: AllergyCardProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const look = CARD_LOOKS[state];
  const Icon = look.icon;
  return (
    <View style={[styles.card, backgroundStyles[look.background]]} accessible>
      <Icon size={ALLERGY_CARD_ICON_SIZE} color={colors[look.iconColor]} strokeWidth={1.8} />
      <View style={styles.text}>
        <Text variant="bodyStrong">{look.title}</Text>
        {state === 'listed' ? <Text>{allergies}</Text> : null}
      </View>
    </View>
  );
}
