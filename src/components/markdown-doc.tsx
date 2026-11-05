import { ScrollView, View } from 'react-native';
import { useColors } from '@/theme/use-theme';
import { space, type as typeScale } from '@/theme/tokens';
import Text from './text';

interface MarkdownDocProps {
  content: string;
}

export default function MarkdownDoc({ content }: MarkdownDocProps) {
  const c = useColors();

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <Text
          key={`h3-${i}`}
          variant="section"
          style={{ marginTop: space.s4, marginBottom: space.s2 }}
        >
          {line.slice(4)}
        </Text>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <Text
          key={`h2-${i}`}
          variant="title"
          style={{ marginTop: space.s5, marginBottom: space.s3 }}
        >
          {line.slice(3)}
        </Text>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <Text
          key={`h1-${i}`}
          variant="display"
          style={{ marginBottom: space.s4 }}
        >
          {line.slice(2)}
        </Text>
      );
    }
    // Bold text (simple pattern)
    else if (line.trim() && !line.startsWith('-')) {
      const parts = line.split(/(\*\*.*?\*\*)/);
      const textElements = parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text key={`bold-${i}-${idx}`} variant="bodyStrong">
              {part.slice(2, -2)}
            </Text>
          );
        }
        return part;
      });

      if (line.trim()) {
        elements.push(
          <Text
            key={`p-${i}`}
            variant="body"
            style={{ marginBottom: space.s2, lineHeight: 24 }}
          >
            {textElements}
          </Text>
        );
      }
    }
    // List items
    else if (line.startsWith('- ')) {
      elements.push(
        <View key={`li-${i}`} style={{ flexDirection: 'row', marginBottom: space.s2 }}>
          <Text variant="body" style={{ marginRight: space.s2 }}>
            •
          </Text>
          <Text variant="body" style={{ flex: 1, lineHeight: 24 }}>
            {line.slice(2)}
          </Text>
        </View>
      );
    }
    // Empty lines
    else if (!line.trim()) {
      elements.push(<View key={`space-${i}`} style={{ height: space.s2 }} />);
    }
  }

  return (
    <ScrollView
      style={{ backgroundColor: c.ground, flex: 1 }}
      contentContainerStyle={{ padding: space.s5 }}
    >
      <View>{elements}</View>
    </ScrollView>
  );
}
