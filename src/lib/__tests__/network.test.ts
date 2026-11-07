import { isNetworkFailure } from '../network';

describe('isNetworkFailure', () => {
  it('recognizes a request that never reached the server', () => {
    expect(isNetworkFailure(new TypeError('Network request failed'))).toBe(true);
  });

  it('recognizes an edge function call that could not be sent', () => {
    expect(isNetworkFailure(new Error('Failed to send a request to the Edge Function'))).toBe(true);
  });

  it('treats an error the server answered with as a server error', () => {
    const answered = Object.assign(new Error('Esta salida ya comenzó'), { status: 403 });
    expect(isNetworkFailure(answered)).toBe(false);
  });

  it('treats anything that is not an error as a server error', () => {
    expect(isNetworkFailure('boom')).toBe(false);
  });
});
