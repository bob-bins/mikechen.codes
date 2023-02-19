export const conwayHash = "#Conway"
export const boardNumOfCols = 500
export const boardNumOfRows = 500
export const live = "O"
export const dead = "."
export const maxCachedTimeRange = 500
export type CellState = typeof live | typeof dead
export type CellStateFn = (row: number, col: number) => CellState
