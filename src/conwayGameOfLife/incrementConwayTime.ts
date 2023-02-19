import { AppState } from "../index"
import { clearCellStateCacheAtTime } from "./engine"
import { maxCachedTimeRange } from "./globalSettings"

export const incrementConwayTime = (state: AppState): AppState => {
  if (state.conway.paused || state.conway.pausedDueToTimerDrag) {
    return state
  } else {
    const newState = {
      ...state,
      conway: {
        ...state.conway,
        time: state.conway.time + 1,
        maxTimeReached: Math.max(state.conway.time + 1, state.conway.maxTimeReached),
        minTime: Math.max(0, state.conway.maxTimeReached + 1 - maxCachedTimeRange),
      },
    }
    if (newState.conway.minTime > 0 && newState.conway.minTime > state.conway.minTime) {
      clearCellStateCacheAtTime(newState.conway.minTime - 1)
    }
    return newState
  }
}
