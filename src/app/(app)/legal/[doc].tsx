import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LEGAL_DOCUMENTS } from '@/legal/documents.generated';
import MarkdownDoc from '@/components/markdown-doc';
import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { screenMargin, space } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

type DocKey = keyof typeof LEGAL_DOCUMENTS;

export default function LegalDocumentScreen() {
  const router = useRouter();
  const { doc: docParam } = useLocalSearchParams();
  const doc = docParam as DocKey | undefined;
  const insets = useSafeAreaInsets();
  const c = useColors();

  if (!doc || !(doc in LEGAL_DOCUMENTS)) {
    return (
      <View style={[styles.error, { backgroundColor: c.ground, paddingTop: insets.top }]}>
        <Text style={{ color: c.red }}>Documento no encontrado</Text>
      </View>
    );
  }

  const document = LEGAL_DOCUMENTS[doc];

  return (
    <View style={[styles.root, { backgroundColor: c.ground }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Button icon={ArrowLeft} title=" " variant="plain" onPress={() => router.back()} />
        <Text variant="title" style={{ color: c.ink, flex: 1 }}>
          {document.title}
        </Text>
      </View>
      <MarkdownDoc content={document.body} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: screenMargin,
    paddingBottom: space.s3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
