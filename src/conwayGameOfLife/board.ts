import { range } from "../utils/range"
import { isBetweenInclusive } from "../utils/isBetweenInclusive"
import { Integer } from "../utils/Integer"

export const live = "O"
export const dead = "."
type CellState = typeof live | typeof dead
type CellStateFn = (x: Integer, y: Integer) => CellState

const initialCellStateFn: CellStateFn = () => (Math.random() > 0.5 ? live : dead)

type UniverseDimensions = {
  minRow: Integer
  maxRow: Integer
  minCol: Integer
  maxCol: Integer
}

const cellState = (
  time: Integer,
  row: Integer,
  col: Integer,
  { minRow, maxRow, minCol, maxCol }: UniverseDimensions
): CellState => {
  row =
    row < minRow
      ? maxRow + 1 - ((minRow - row) % (maxRow - minRow))
      : row > maxRow
      ? minRow - 1 + ((row - maxRow) % (maxRow - minRow))
      : row
  col =
    col < minCol
      ? maxCol + 1 - ((minCol - col) % (maxCol - minCol))
      : col > maxCol
      ? minCol - 1 + ((col - maxCol) % (maxCol - minCol))
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
    (p, [x, y]) => p + (getCellState(time - 1, x, y, { minRow, maxRow, minCol, maxCol }) == live ? 1 : 0),
    0
  )
  return getCellState(time - 1, row, col, { minRow, maxRow, minCol, maxCol }) == live
    ? isBetweenInclusive(2, 3)(adjacentLiveCount)
      ? live
      : dead
    : adjacentLiveCount == 3
    ? live
    : dead
}

// export const _cellStateCache:{[key:number]:{[key:string]:CellState}} = {}
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
  { minRow, maxRow, minCol, maxCol }: UniverseDimensions
): CellState => {
  row =
    row < minRow
      ? maxRow + 1 - ((minRow - row) % (maxRow - minRow))
      : row > maxRow
      ? minRow - 1 + ((row - maxRow) % (maxRow - minRow))
      : row
  col =
    col < minCol
      ? maxCol + 1 - ((minCol - col) % (maxCol - minCol))
      : col > maxCol
      ? minCol - 1 + ((col - maxCol) % (maxCol - minCol))
      : col
  return (
    _cellStateCache[time]?.[row]?.[col] ??
    (time == 0
      ? setCellState(0, row, col, initialCellStateFn(row, col))
      : setCellState(time, row, col, cellState(time, row, col, { minRow, maxRow, minCol, maxCol })))
  )
}

const drawGridForDebuggingPurposes = (
  time: Integer,
  minRow: Integer,
  minCol: Integer,
  maxRow: Integer,
  maxCol: Integer
) => {
  range(minRow, maxRow)
    .map(rowIndex => range(minCol, maxCol).map(colIndex => [rowIndex, colIndex]))
    .forEach(row =>
      console.log(
        row
          .map(([rowIndex, colIndex]) =>
            getCellState(time, rowIndex, colIndex, { minRow, maxRow, minCol, maxCol })
          )
          .join(" ")
      )
    )
  console.log("")
  console.log("")
}
