import memoize from "micro-memoize"
import { CellState, dead, boardNumOfCols, boardNumOfRows } from "./globalSettings"

export const parseConwayBoard = memoize((stringifiedState: string): Array<Array<CellState>> => {
  const rows = stringifiedState
    .split("\n")
    .slice(0, boardNumOfRows) // todo: remove if letting users upload a larger board
    .filter(row => row[0] != "!")
    .map(row => row.replaceAll(/[^O.]/g, "."))
  return [
    ...rows.map(row =>
      row
        .padEnd(boardNumOfCols, dead)
        .split("")
        .slice(0, boardNumOfCols) // todo: remove if letting users upload a larger board
        .map(c => c as CellState)
    ),
    ...Array(boardNumOfRows - rows.length)
      .fill(undefined)
      .map(_ =>
        ""
          .padEnd(boardNumOfCols, dead)
          .split("")
          .map(c => c as CellState)
      ),
  ]
})
