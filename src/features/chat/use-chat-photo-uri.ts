import { fetchChatPhotoUrl } from '@/data/chat-photos';
import { useAsync } from '@/data/use-async';

import type { DisplayedMessage } from './chat-thread-reducer';

/** The phone's own copy while the message is not saved yet; otherwise a signed URL, never asked for a photo the viewer may not see. */
export function useChatPhotoUri(message: Pick<DisplayedMessage, 'imagePath' | 'localImageUri'>, withheld: boolean) {
  const signedPath = message.localImageUri || withheld ? null : message.imagePath;
  const signed = useAsync(() => fetchChatPhotoUrl(signedPath!), signedPath);
  if (message.localImageUri) return { uri: message.localImageUri, failed: false, reload: signed.reload };
  return { uri: signed.data, failed: signed.failed, reload: signed.reload };
}
