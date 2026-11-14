import { router } from 'expo-router';
import { useEffect, useReducer } from 'react';

import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import { DELETE_ACCOUNT_ROUTE } from '@/constants/routes';
import { findSoleTeacherGroup, isOnlyDirector } from '@/data/account-deletion';
import { fetchFamilyChildren } from '@/data/family-room';
import type { FunctionError } from '@/data/supabase';
import { useAsync } from '@/data/use-async';
import { DeleteAccountRow } from '@/features/delete-account/components/DeleteAccountRow/DeleteAccountRow';
import { DeletionSummary } from '@/features/delete-account/components/DeletionSummary/DeletionSummary';
import { DeletionBlockedNotice } from '@/features/delete-account/components/DeletionBlockedNotice/DeletionBlockedNotice';
import { DELETE_ACCOUNT_COPY } from '@/features/delete-account/delete-account-copy';
import {
  DELETE_ACCOUNT_START_ACTIONS,
  deleteAccountStartReducer,
  initialDeleteAccountStartState,
} from '@/features/delete-account/delete-account-start-reducer';
import { deletionErrorMessage } from '@/lib/account-deletion';
import type { Role } from '@/lib/role';

import { styles } from './DeleteAccountEntry.styles';

async function checkDeletionBlock(role: Role, userId: string) {
  if (role === 'director') return { onlyDirector: await isOnlyDirector(), soleTeacherGroup: null };
  return { onlyDirector: false, soleTeacherGroup: await findSoleTeacherGroup(userId) };
}

export interface DeleteAccountEntryProps {
  userId: string;
  role: Role;
  nurseryName: string;
}

export function DeleteAccountEntry({ userId, role, nurseryName }: DeleteAccountEntryProps) {
  const [state, dispatch] = useReducer(deleteAccountStartReducer, initialDeleteAccountStartState);
  const isFamily = role === 'family';
  const familyChildren = useAsync(() => fetchFamilyChildren(userId), state.open && isFamily ? userId : null);

  useEffect(() => {
    if (!state.checking) return;
    let isMounted = true;
    checkDeletionBlock(role, userId)
      .then((block) => isMounted && dispatch({ type: DELETE_ACCOUNT_START_ACTIONS.CHECK_SUCCEEDED, ...block }))
      .catch((error: FunctionError) => {
        if (isMounted) dispatch({ type: DELETE_ACCOUNT_START_ACTIONS.CHECK_FAILED, message: deletionErrorMessage(error.code) });
      });
    return () => {
      isMounted = false;
    };
  }, [state.checking, role, userId]);

  const close = () => dispatch({ type: DELETE_ACCOUNT_START_ACTIONS.CLOSED });

  function continueToCode() {
    if (state.error) {
      dispatch({ type: DELETE_ACCOUNT_START_ACTIONS.CHECK_RETRIED });
      return;
    }
    close();
    router.push(DELETE_ACCOUNT_ROUTE);
  }

  return (
    <>
      <DeleteAccountRow onPress={() => dispatch({ type: DELETE_ACCOUNT_START_ACTIONS.OPENED, needsCheck: !isFamily })} />
      <Sheet visible={state.open} onClose={close} sheetStyle={styles.sheet}>
        {state.onlyDirector ? (
          <DeletionBlockedNotice
            title={DELETE_ACCOUNT_COPY.onlyDirectorTitle}
            reason={DELETE_ACCOUNT_COPY.onlyDirectorBody(nurseryName)}
            nextStep={DELETE_ACCOUNT_COPY.onlyDirectorAsk}
            onClose={close}
          />
        ) : state.soleTeacherGroup ? (
          <DeletionBlockedNotice
            title={DELETE_ACCOUNT_COPY.onlyTeacherTitle}
            reason={
              <>
                {DELETE_ACCOUNT_COPY.onlyTeacherBodyStart}
                <Text variant="bodyStrong">{state.soleTeacherGroup}</Text>
                {DELETE_ACCOUNT_COPY.onlyTeacherBodyEnd}
              </>
            }
            nextStep={DELETE_ACCOUNT_COPY.onlyTeacherAsk}
            onClose={close}
          />
        ) : (
          <DeletionSummary
            isFamily={isFamily}
            childNames={(familyChildren.data ?? []).map((child) => child.firstName)}
            checking={state.checking}
            error={state.error}
            onContinue={continueToCode}
            onCancel={close}
          />
        )}
      </Sheet>
    </>
  );
}
