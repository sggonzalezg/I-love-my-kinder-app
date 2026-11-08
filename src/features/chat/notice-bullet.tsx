import { router, type Href } from 'expo-router';

import { Text } from '@/components/text';
import { richSegments } from '@/lib/rich-text';

import { NOTICE_LINKS } from './chat-copy';

export function NoticeBullet({ text }: { text: string }) {
  return (
    <Text variant="small">
      {richSegments(text, NOTICE_LINKS).map((segment, index) => {
        const link = segment.link;
        if (link) {
          return (
            <Text key={index} variant="smallStrong" color="blue" accessibilityRole="link" onPress={() => router.push(`/legal/${link}` as Href)}>
              {segment.text}
            </Text>
          );
        }
        return (
          <Text key={index} variant={segment.bold ? 'smallStrong' : 'small'}>
            {segment.text}
          </Text>
        );
      })}
    </Text>
  );
}
