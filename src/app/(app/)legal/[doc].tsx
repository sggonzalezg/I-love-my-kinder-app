import { useLocalSearchParams } from 'expo-router';
import { LEGAL_DOCUMENTS } from '@/legal/documents.generated';
import MarkdownDoc from '@/components/markdown-doc';

export default function LegalDocScreen() {
  const { doc } = useLocalSearchParams();
  const docId = doc as keyof typeof LEGAL_DOCUMENTS;
  const content = LEGAL_DOCUMENTS[docId]?.body || '';

  return <MarkdownDoc content={content} />;
}
