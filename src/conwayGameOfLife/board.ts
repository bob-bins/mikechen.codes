import { range } from "../utils/range"
import { isBetweenInclusive } from "../utils/isBetweenInclusive"
import { Integer } from "../utils/Integer"

export const live = "O"
export const dead = "."
export type CellState = typeof live | typeof dead
type CellStateFn = (x: Integer, y: Integer) => CellState

const initialCellStateFn: CellStateFn = () => (Math.random() > 0.5 ? live : dead)

type UniverseDimensions = {
  maxRow: Integer
  maxCol: Integer
}

const cellState = (
  time: Integer,
  row: Integer,
  col: Integer,
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
  ].reduce(
    (p, [x, y]) => p + (getCellState(time - 1, x, y, { maxRow, maxCol }) == live ? 1 : 0),
    0
  )
  return getCellState(time - 1, row, col, { maxRow, maxCol }) == live
    ? isBetweenInclusive(2, 3)(adjacentLiveCount)
      ? live
      : dead
    : adjacentLiveCount == 3
    ? live
    : dead
}

export const _cellStateCache: {
  [time: Integer]: {
    [row: Integer]: {
      [col: Integer]: CellState
    }
  }
} = {}

const setCellState = (time: Integer, row: Integer, col: Integer, state: CellState) => {
  if (_cellStateCache[time] == undefined) _cellStateCache[time] = {}
  if (_cellStateCache[time][row] == undefined) _cellStateCache[time][row] = {}
  return (_cellStateCache[time][row][col] = state)
}

export const getCellState = (
  time: Integer,
  row: Integer,
  col: Integer,
  { maxRow, maxCol }: UniverseDimensions // Cells outside the Universe bounds are "wrapped"
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

const drawGridForDebuggingPurposes = (
  time: Integer,
  maxRow: Integer,
  maxCol: Integer
) => {
  range(0, maxRow)
    .map(rowIndex => range(0, maxCol).map(colIndex => [rowIndex, colIndex]))
    .forEach(row =>
      console.log(
        row
          .map(([rowIndex, colIndex]) =>
            getCellState(time, rowIndex, colIndex, { maxRow, maxCol })
          )
          .join(" ")
      )
    )
  console.log("")
  console.log("")
}
