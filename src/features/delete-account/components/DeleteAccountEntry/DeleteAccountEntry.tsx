import { router } from 'expo-router';
import { useEffect, useReducer } from 'react';

import { Sheet } from '@/components/sheet';
import { DELETE_ACCOUNT_ROUTE } from '@/constants/routes';
import { isOnlyDirector } from '@/data/account-deletion';
import { fetchFamilyChildren } from '@/data/family-room';
import type { FunctionError } from '@/data/supabase';
import { useAsync } from '@/data/use-async';
import { DeleteAccountRow } from '@/features/delete-account/components/DeleteAccountRow/DeleteAccountRow';
import { DeletionSummary } from '@/features/delete-account/components/DeletionSummary/DeletionSummary';
import { OnlyDirectorNotice } from '@/features/delete-account/components/OnlyDirectorNotice/OnlyDirectorNotice';
import {
  DELETE_ACCOUNT_START_ACTIONS,
  deleteAccountStartReducer,
  initialDeleteAccountStartState,
} from '@/features/delete-account/delete-account-start-reducer';
import { deletionErrorMessage } from '@/lib/account-deletion';
import type { Role } from '@/lib/role';

import { styles } from './DeleteAccountEntry.styles';

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
    isOnlyDirector()
      .then((onlyDirector) => isMounted && dispatch({ type: DELETE_ACCOUNT_START_ACTIONS.CHECK_SUCCEEDED, onlyDirector }))
      .catch((error: FunctionError) => {
        if (isMounted) dispatch({ type: DELETE_ACCOUNT_START_ACTIONS.CHECK_FAILED, message: deletionErrorMessage(error.code) });
      });
    return () => {
      isMounted = false;
    };
  }, [state.checking]);

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
      <DeleteAccountRow onPress={() => dispatch({ type: DELETE_ACCOUNT_START_ACTIONS.OPENED, needsCheck: role === 'director' })} />
      <Sheet visible={state.open} onClose={close} sheetStyle={styles.sheet}>
        {state.onlyDirector ? (
          <OnlyDirectorNotice nurseryName={nurseryName} onClose={close} />
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
