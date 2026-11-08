import type { ReactNode } from 'react';

import { Screen } from '@/components/screen';
import type { AuthSession } from '@/data/types';

import { NOTICE_SCREEN } from './chat-copy';
import { ChatListSkeleton } from './chat-list-skeleton';
import { ChatNotice } from './chat-notice';
import { useChatNotice } from './use-chat-notice';

interface ChatNoticeGateProps {
  session: AuthSession;
  header: ReactNode;
  children: ReactNode;
}

/** Nobody reads or writes a room chat before accepting its first-use notice once (legal 7.2 and 7.3). */
export function ChatNoticeGate({ session, header, children }: ChatNoticeGateProps) {
  const role = session.active_role;
  const { notice, checking, needed, recheck } = useChatNotice(role, session.user_id);

  if (checking) {
    return (
      <Screen header={header}>
        <ChatListSkeleton />
      </Screen>
    );
  }
  if (needed && notice && role !== 'director') {
    return (
      <Screen header={header} bleed>
        <ChatNotice notice={notice} urgentPhone={session.nursery_urgent_phone} screen={NOTICE_SCREEN[role]} onAccepted={recheck} />
      </Screen>
    );
  }
  return children;
}
