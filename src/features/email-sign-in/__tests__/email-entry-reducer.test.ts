import { EMAIL_ENTRY_ACTIONS, PROVIDER_NOTICES, emailEntryReducer, initialEmailEntryState } from '@/features/email-sign-in/email-entry-reducer';
import { EMAIL_PROBLEMS, SIGN_IN_FAILURES } from '@/lib/email-sign-in';
import { SOCIAL_PROVIDERS } from '@/lib/social-sign-in';

describe('emailEntryReducer', () => {
  it('keeps what the person types', () => {
    const state = emailEntryReducer(initialEmailEntryState, { type: EMAIL_ENTRY_ACTIONS.EMAIL_CHANGED, email: 'ana@gmail.com' });
    expect(state.email).toBe('ana@gmail.com');
  });

  it('shows the email problem after the tap', () => {
    const state = emailEntryReducer(initialEmailEntryState, { type: EMAIL_ENTRY_ACTIONS.SEND_REFUSED, problem: EMAIL_PROBLEMS.MISSING_END });
    expect(state.problem).toBe(EMAIL_PROBLEMS.MISSING_END);
  });

  it('clears the problem when the person edits the email', () => {
    const refused = { ...initialEmailEntryState, problem: EMAIL_PROBLEMS.MISSING_END };
    const state = emailEntryReducer(refused, { type: EMAIL_ENTRY_ACTIONS.EMAIL_CHANGED, email: 'ana@gmail.c' });
    expect(state.problem).toBeNull();
  });

  it('clears an earlier failure when sending again', () => {
    const failed = { ...initialEmailEntryState, failure: SIGN_IN_FAILURES.NETWORK };
    const state = emailEntryReducer(failed, { type: EMAIL_ENTRY_ACTIONS.SEND_STARTED });
    expect(state).toMatchObject({ sending: true, failure: null });
  });

  it('does not change the email while the code is being sent', () => {
    const sending = { ...initialEmailEntryState, email: 'ana@gmail.com', sending: true };
    const state = emailEntryReducer(sending, { type: EMAIL_ENTRY_ACTIONS.EMAIL_CHANGED, email: 'otra@gmail.com' });
    expect(state.email).toBe('ana@gmail.com');
  });

  it('keeps the failure and turns the button back on when the send fails', () => {
    const sending = { ...initialEmailEntryState, sending: true };
    const state = emailEntryReducer(sending, { type: EMAIL_ENTRY_ACTIONS.SEND_FAILED, failure: SIGN_IN_FAILURES.NETWORK });
    expect(state).toMatchObject({ sending: false, failure: SIGN_IN_FAILURES.NETWORK });
  });

  it('keeps the email when the send finishes, so going back shows it', () => {
    const sending = { ...initialEmailEntryState, email: 'ana@gmail.com', sending: true };
    const state = emailEntryReducer(sending, { type: EMAIL_ENTRY_ACTIONS.SEND_FINISHED });
    expect(state).toMatchObject({ sending: false, email: 'ana@gmail.com' });
  });
});

describe('emailEntryReducer with Google and Apple', () => {
  it('shows the providers the device offers', () => {
    const state = emailEntryReducer(initialEmailEntryState, { type: EMAIL_ENTRY_ACTIONS.PROVIDERS_LOADED, providers: [SOCIAL_PROVIDERS.APPLE, SOCIAL_PROVIDERS.GOOGLE] });
    expect(state.providers).toEqual([SOCIAL_PROVIDERS.APPLE, SOCIAL_PROVIDERS.GOOGLE]);
  });

  it('marks the tapped provider as opening and clears earlier notices', () => {
    const noticed = { ...initialEmailEntryState, failure: SIGN_IN_FAILURES.NETWORK, providerNotice: { provider: SOCIAL_PROVIDERS.APPLE, kind: PROVIDER_NOTICES.FAILED } };
    const state = emailEntryReducer(noticed, { type: EMAIL_ENTRY_ACTIONS.PROVIDER_STARTED, provider: SOCIAL_PROVIDERS.GOOGLE });
    expect(state).toMatchObject({ busyProvider: SOCIAL_PROVIDERS.GOOGLE, failure: null, providerNotice: null });
  });

  it('does not open a second provider while one is opening', () => {
    const opening = { ...initialEmailEntryState, busyProvider: SOCIAL_PROVIDERS.GOOGLE };
    const state = emailEntryReducer(opening, { type: EMAIL_ENTRY_ACTIONS.PROVIDER_STARTED, provider: SOCIAL_PROVIDERS.APPLE });
    expect(state.busyProvider).toBe(SOCIAL_PROVIDERS.GOOGLE);
  });

  it('does not send the email code while a provider is opening', () => {
    const opening = { ...initialEmailEntryState, busyProvider: SOCIAL_PROVIDERS.GOOGLE };
    const state = emailEntryReducer(opening, { type: EMAIL_ENTRY_ACTIONS.SEND_STARTED });
    expect(state.sending).toBe(false);
  });

  it('does not change the email while a provider is opening', () => {
    const opening = { ...initialEmailEntryState, email: 'ana@gmail.com', busyProvider: SOCIAL_PROVIDERS.GOOGLE };
    const state = emailEntryReducer(opening, { type: EMAIL_ENTRY_ACTIONS.EMAIL_CHANGED, email: 'otra@gmail.com' });
    expect(state.email).toBe('ana@gmail.com');
  });

  it('shows the cancelled notice for the provider the person closed', () => {
    const opening = { ...initialEmailEntryState, busyProvider: SOCIAL_PROVIDERS.GOOGLE };
    const state = emailEntryReducer(opening, { type: EMAIL_ENTRY_ACTIONS.PROVIDER_CANCELLED });
    expect(state).toMatchObject({ busyProvider: null, providerNotice: { provider: SOCIAL_PROVIDERS.GOOGLE, kind: PROVIDER_NOTICES.CANCELLED } });
  });

  it('shows the provider error when the provider fails', () => {
    const opening = { ...initialEmailEntryState, busyProvider: SOCIAL_PROVIDERS.APPLE };
    const state = emailEntryReducer(opening, { type: EMAIL_ENTRY_ACTIONS.PROVIDER_FAILED, failure: SIGN_IN_FAILURES.OTHER });
    expect(state).toMatchObject({ busyProvider: null, providerNotice: { provider: SOCIAL_PROVIDERS.APPLE, kind: PROVIDER_NOTICES.FAILED } });
  });

  it('shows the offline banner when a provider sign-in has no connection', () => {
    const opening = { ...initialEmailEntryState, busyProvider: SOCIAL_PROVIDERS.APPLE };
    const state = emailEntryReducer(opening, { type: EMAIL_ENTRY_ACTIONS.PROVIDER_FAILED, failure: SIGN_IN_FAILURES.NETWORK });
    expect(state).toMatchObject({ busyProvider: null, providerNotice: null, failure: SIGN_IN_FAILURES.NETWORK });
  });

  it('turns everything back on when the provider sign-in leaves the entry', () => {
    const opening = { ...initialEmailEntryState, busyProvider: SOCIAL_PROVIDERS.GOOGLE };
    const state = emailEntryReducer(opening, { type: EMAIL_ENTRY_ACTIONS.PROVIDER_FINISHED });
    expect(state.busyProvider).toBeNull();
  });

  it('clears a provider notice when the email code is sent', () => {
    const noticed = { ...initialEmailEntryState, providerNotice: { provider: SOCIAL_PROVIDERS.GOOGLE, kind: PROVIDER_NOTICES.CANCELLED } };
    const state = emailEntryReducer(noticed, { type: EMAIL_ENTRY_ACTIONS.SEND_STARTED });
    expect(state.providerNotice).toBeNull();
  });
});
