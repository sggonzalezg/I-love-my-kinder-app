export type MediaTileStatus = 'loading' | 'failed';

export interface MediaTileState {
  status: MediaTileStatus;
  attempt: number;
}

export const MEDIA_TILE_ACTIONS = {
  FAILED: 'failed',
  RETRIED: 'retried',
} as const;

export type MediaTileAction = { type: typeof MEDIA_TILE_ACTIONS.FAILED } | { type: typeof MEDIA_TILE_ACTIONS.RETRIED };

export function initialMediaTileState(url: string | null): MediaTileState {
  return { status: url ? 'loading' : 'failed', attempt: 0 };
}

export function mediaTileReducer(state: MediaTileState, action: MediaTileAction): MediaTileState {
  switch (action.type) {
    case MEDIA_TILE_ACTIONS.FAILED:
      return { ...state, status: 'failed' };
    case MEDIA_TILE_ACTIONS.RETRIED:
      return { status: 'loading', attempt: state.attempt + 1 };
  }
}
