import { isBetweenInclusive } from "../utils/isBetweenInclusive"
import { CellState, CellStateFn, dead, live } from "./globalSettings"
import initialConwayState from "./initialConwayState.cells"
import { parseConwayBoard } from "./parseConwayBoard"

const defaultInitialState: CellStateFn = (row: number, col: number) =>
  parseConwayBoard(initialConwayState)[row][col]

type UniverseDimensions = {
  maxRow: number
  maxCol: number
}

const cellState = (
  time: number,
  row: number,
  col: number,
  { maxRow, maxCol }: UniverseDimensions
): CellState => {
  row =
    row < 0
      ? maxRow + 1 - ((0 - row) % (maxRow - 0))
      : row > maxRow
      ? 0 - 1 + ((row - maxRow) % (maxRow - 0))
      : row
  col =
    col < 0
      ? maxCol + 1 - ((0 - col) % (maxCol - 0))
      : col > maxCol
      ? 0 - 1 + ((col - maxCol) % (maxCol - 0))
      : col
  const adjacentLiveCount = [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
  ].reduce((p, [x, y]) => p + (getCellState(time - 1, x, y, { maxRow, maxCol }) == live ? 1 : 0), 0)
  return getCellState(time - 1, row, col, { maxRow, maxCol }) == live
    ? isBetweenInclusive(2, 3)(adjacentLiveCount)
      ? live
      : dead
    : adjacentLiveCount == 3
    ? live
    : dead
}

let _cellStateCache: {
  [time: number]: {
    [row: number]: {
      [col: number]: CellState
    }
  }
} = {}

export const clearCellStateCache = () => {
  _cellStateCache = {}
}

export const clearCellStateCacheAtTime = (time: number) => {
  delete _cellStateCache[time]
}

const setCellState = (time: number, row: number, col: number, state: CellState) => {
  if (_cellStateCache[time] == undefined) _cellStateCache[time] = {}
  if (_cellStateCache[time][row] == undefined) _cellStateCache[time][row] = {}
  return (_cellStateCache[time][row][col] = state)
}

export const getCellState = (
  time: number,
  row: number,
  col: number,
  { maxRow, maxCol }: UniverseDimensions, // Cells outside the Universe bounds are "wrapped"
  initialCellStateFn: CellStateFn = defaultInitialState
): CellState => {
  row =
    row < 0
      ? maxRow + 1 - ((0 - row) % (maxRow - 0))
      : row > maxRow
      ? 0 - 1 + ((row - maxRow) % (maxRow - 0))
      : row
  col =
    col < 0
      ? maxCol + 1 - ((0 - col) % (maxCol - 0))
      : col > maxCol
      ? 0 - 1 + ((col - maxCol) % (maxCol - 0))
      : col
  return (
    _cellStateCache[time]?.[row]?.[col] ??
    (time == 0
      ? setCellState(0, row, col, initialCellStateFn(row, col))
      : setCellState(time, row, col, cellState(time, row, col, { maxRow, maxCol })))
  )
}
