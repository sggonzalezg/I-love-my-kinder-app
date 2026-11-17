import { SIGN_IN_FAILURES, type EmailProblem, type SignInFailure } from '@/lib/email-sign-in';
import type { SocialProvider } from '@/lib/social-sign-in';

export const PROVIDER_NOTICES = {
  CANCELLED: 'cancelled',
  FAILED: 'failed',
} as const;

export type ProviderNoticeKind = (typeof PROVIDER_NOTICES)[keyof typeof PROVIDER_NOTICES];

export interface ProviderNotice {
  provider: SocialProvider;
  kind: ProviderNoticeKind;
}

export interface EmailEntryState {
  email: string;
  problem: EmailProblem | null;
  sending: boolean;
  failure: SignInFailure | null;
  providers: SocialProvider[];
  busyProvider: SocialProvider | null;
  providerNotice: ProviderNotice | null;
}

export const EMAIL_ENTRY_ACTIONS = {
  EMAIL_CHANGED: 'emailChanged',
  SEND_REFUSED: 'sendRefused',
  SEND_STARTED: 'sendStarted',
  SEND_FAILED: 'sendFailed',
  SEND_FINISHED: 'sendFinished',
  PROVIDERS_LOADED: 'providersLoaded',
  PROVIDER_STARTED: 'providerStarted',
  PROVIDER_CANCELLED: 'providerCancelled',
  PROVIDER_FAILED: 'providerFailed',
  PROVIDER_FINISHED: 'providerFinished',
} as const;

export type EmailEntryAction =
  | { type: typeof EMAIL_ENTRY_ACTIONS.EMAIL_CHANGED; email: string }
  | { type: typeof EMAIL_ENTRY_ACTIONS.SEND_REFUSED; problem: EmailProblem }
  | { type: typeof EMAIL_ENTRY_ACTIONS.SEND_STARTED }
  | { type: typeof EMAIL_ENTRY_ACTIONS.SEND_FAILED; failure: SignInFailure }
  | { type: typeof EMAIL_ENTRY_ACTIONS.SEND_FINISHED }
  | { type: typeof EMAIL_ENTRY_ACTIONS.PROVIDERS_LOADED; providers: SocialProvider[] }
  | { type: typeof EMAIL_ENTRY_ACTIONS.PROVIDER_STARTED; provider: SocialProvider }
  | { type: typeof EMAIL_ENTRY_ACTIONS.PROVIDER_CANCELLED }
  | { type: typeof EMAIL_ENTRY_ACTIONS.PROVIDER_FAILED; failure: SignInFailure }
  | { type: typeof EMAIL_ENTRY_ACTIONS.PROVIDER_FINISHED };

export const initialEmailEntryState: EmailEntryState = {
  email: '',
  problem: null,
  sending: false,
  failure: null,
  providers: [],
  busyProvider: null,
  providerNotice: null,
};

export function isEntryBusy(state: EmailEntryState): boolean {
  return state.sending || state.busyProvider !== null;
}

function providerNoticeAfter(state: EmailEntryState, kind: ProviderNoticeKind): ProviderNotice | null {
  return state.busyProvider ? { provider: state.busyProvider, kind } : null;
}

export function emailEntryReducer(state: EmailEntryState, action: EmailEntryAction): EmailEntryState {
  switch (action.type) {
    case EMAIL_ENTRY_ACTIONS.EMAIL_CHANGED:
      if (isEntryBusy(state)) return state;
      return { ...state, email: action.email, problem: null };
    case EMAIL_ENTRY_ACTIONS.SEND_REFUSED:
      return { ...state, problem: action.problem };
    case EMAIL_ENTRY_ACTIONS.SEND_STARTED:
      if (isEntryBusy(state)) return state;
      return { ...state, sending: true, problem: null, failure: null, providerNotice: null };
    case EMAIL_ENTRY_ACTIONS.SEND_FAILED:
      return { ...state, sending: false, failure: action.failure };
    case EMAIL_ENTRY_ACTIONS.SEND_FINISHED:
      return { ...state, sending: false };
    case EMAIL_ENTRY_ACTIONS.PROVIDERS_LOADED:
      return { ...state, providers: action.providers };
    case EMAIL_ENTRY_ACTIONS.PROVIDER_STARTED:
      if (isEntryBusy(state)) return state;
      return { ...state, busyProvider: action.provider, problem: null, failure: null, providerNotice: null };
    case EMAIL_ENTRY_ACTIONS.PROVIDER_CANCELLED:
      return { ...state, busyProvider: null, providerNotice: providerNoticeAfter(state, PROVIDER_NOTICES.CANCELLED) };
    case EMAIL_ENTRY_ACTIONS.PROVIDER_FAILED:
      if (action.failure === SIGN_IN_FAILURES.NETWORK) return { ...state, busyProvider: null, failure: action.failure };
      return { ...state, busyProvider: null, providerNotice: providerNoticeAfter(state, PROVIDER_NOTICES.FAILED) };
    case EMAIL_ENTRY_ACTIONS.PROVIDER_FINISHED:
      return { ...state, busyProvider: null };
    default:
      return state;
  }
}
