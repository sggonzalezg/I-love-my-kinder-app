import { MEDIA_TILE_ACTIONS, initialMediaTileState, mediaTileReducer } from '../media-tile-reducer';

describe('mediaTileReducer', () => {
  it('starts loading when the tile has a URL', () => {
    expect(initialMediaTileState('https://example.test/a.jpg')).toEqual({ status: 'loading', attempt: 0 });
  });

  it('starts failed when the tile has no URL', () => {
    expect(initialMediaTileState(null)).toEqual({ status: 'failed', attempt: 0 });
  });

  it('shows the retry tile when the image fails', () => {
    const state = mediaTileReducer({ status: 'loading', attempt: 0 }, { type: MEDIA_TILE_ACTIONS.FAILED });

    expect(state.status).toBe('failed');
  });

  it('loads again with a new attempt on retry', () => {
    const state = mediaTileReducer({ status: 'failed', attempt: 1 }, { type: MEDIA_TILE_ACTIONS.RETRIED });

    expect(state).toEqual({ status: 'loading', attempt: 2 });
  });
});
