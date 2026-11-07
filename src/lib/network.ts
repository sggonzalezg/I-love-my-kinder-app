const NETWORK_FAILURE_MESSAGES = ['Network request failed', 'Failed to send a request', 'Failed to fetch'];

export function isNetworkFailure(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if ((error as Error & { status?: number }).status) return false;
  return NETWORK_FAILURE_MESSAGES.some((message) => error.message.includes(message));
}
