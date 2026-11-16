import { Clock } from 'lucide-react-native';
import { View } from 'react-native';

import { Banner } from '@/components/banner';
import { unansweredBannerText } from '@/lib/child-authorization-status';

interface UnansweredBannerProps {
  unansweredCount: number;
}

export function UnansweredBanner({ unansweredCount }: UnansweredBannerProps) {
  if (unansweredCount === 0) return null;
  return (
    <View accessibilityLiveRegion="polite">
      <Banner kind="warning" icon={Clock} text={unansweredBannerText(unansweredCount)} />
    </View>
  );
}
