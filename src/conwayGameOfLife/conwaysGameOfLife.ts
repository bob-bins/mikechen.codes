import { canvas, div, input, span, button } from "@hyperapp/html"
import { text } from "hyperapp"
import { range } from "../utils/range"
import { AppState } from "../index"
import { CellState, clearCellStateCache, clearCellStateCacheAtTime, dead, getCellState, live } from "./board"
import { isMobileDevice } from "../utils/isMobileDevice"
import { uploadTextFromBrowser } from "../utils/uploadTextFromBrowser"
import memoize from "micro-memoize"

export const numOfCols = 500
export const numOfRows = 500

const stringifyConwayBoard = (state: Array<Array<CellState>>) => state.map(row => row.join("")).join("\n")

const parseConwayBoard = memoize((stringifiedState: string): Array<Array<CellState>> => {
  const rows = stringifiedState
    .split("\n")
    .slice(0, numOfRows) // todo: remove if letting users upload a larger board
    .filter(row => row[0] != "!")
    .map(row => row.replaceAll(/[^O.]/g, "."))
  return [
    ...rows.map(row =>
      row
        .padEnd(numOfCols, dead)
        .split("")
        .slice(0, numOfCols) // todo: remove if letting users upload a larger board
        .map(c => c as CellState)
    ),
    ...Array(numOfRows - rows.length)
      .fill(undefined)
      .map(_ =>
        ""
          .padEnd(numOfCols, dead)
          .split("")
          .map(c => c as CellState)
      ),
  ]
})

export const conwaysGameOfLife = (state: AppState) => {
  const conwayElementId = "conway"
  const htmlCanvas = <HTMLCanvasElement>document.getElementById(conwayElementId)
  let stringifiedConwayBoard: string
  if (htmlCanvas) {
    htmlCanvas.onwheel = e => e.preventDefault()
    htmlCanvas.width = window.innerWidth
    htmlCanvas.height = window.innerHeight

    const cellWidth = Math.ceil(state.conway.cellWidthPx)

    const minDisplayedColNum = state.conway.centerX - Math.ceil(state.conway.draggedX / cellWidth)
    const minDisplayedRowNum = state.conway.centerY - Math.ceil(state.conway.draggedY / cellWidth)

    const conwayState = range(minDisplayedRowNum, minDisplayedRowNum + numOfRows - 1).map(rowIndex =>
      range(minDisplayedColNum, minDisplayedColNum + numOfCols - 1).map(colIndex =>
        getCellState(
          state.conway.time,
          rowIndex,
          colIndex,
          {
            maxRow: numOfRows - 1,
            maxCol: numOfCols - 1,
          },
          state.conway.initialBoardFn
        )
      )
    )

    const ctx = htmlCanvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    conwayState.forEach((row, rowIndex) =>
      row.forEach((state, colIndex) => {
        if (state == live) {
          ctx.fillStyle = "rgb(255, 255, 255)"
          ctx.fillRect(cellWidth * colIndex, rowIndex * cellWidth, cellWidth, cellWidth)
        }
      })
    )

    stringifiedConwayBoard = stringifyConwayBoard(conwayState)
  }

  const uploadConwayState = async (dispatch, payload) => {
    const uploadedText = await uploadTextFromBrowser()
    requestAnimationFrame(() => {
      dispatch((state: AppState): AppState => {
        clearCellStateCache()
        return {
          ...state,
          conway: {
            ...state.conway,
            initialBoardFn: (row: number, col: number) => parseConwayBoard(uploadedText)[row][col],
            time: 0,
            maxTimeReached: 0,
            minTime: 0,
          },
        }
      })
    })
  }

  return div({}, [
    div({ class: "py-2 conwayControls" }, [
      div({ class: "d-flex col-12", style: { "white-space": "nowrap", "line-height": "26px" } }, [
        ...(!isMobileDevice(navigator)
          ? [
              span({ class: "mr-2" }, [
                button(
                  {
                    class: `btn btn-primary fas fa-upload`,
                    title: `Upload Conway Board state. Takes a multiline text file with two valid characters: "." represents "dead" and "O" represents "alive"\n
Maximum board size is 500x500. Extra cells are truncated.`,
                    onclick: state => [state, uploadConwayState],
                  },
                  []
                ),
                button(
                  {
                    class: `btn btn-primary fas fa-download`,
                    title: `Download Conway Board state as a multiline string. "." represents "dead" and "O" represents "alive"`,
                    onclick: downloadConwayState(stringifiedConwayBoard),
                  },
                  []
                ),
              ]),
            ]
          : []),
        span({ class: "mr-2" }, [
          button(
            {
              class: `btn btn-primary fas ${state.conway.paused ? "fa-play" : "fa-pause"}`,
              onclick: togglePausePlay,
            },
            []
          ),
        ]),
        span(
          {
            class:
              "d-inline-flex align-items-center font-weight-bold text-primary mr-2 valueSpan2 text-monospace",
          },
          [text("Time")]
        ),
        input(
          {
            type: "range",
            class: "custom-range pt-2",
            style: { flex: 1 },
            min: state.conway.minTime,
            max: state.conway.maxTimeReached,
            value: state.conway.time,
            oninput: setConwayTime,
            onmousedown: pauseDueToTimerDrag,
            onmouseup: unpauseDueToTimerDrag,
            onfocusout: unpauseDueToTimerDrag,
          },
          []
        ),
        span(
          {
            class:
              "d-inline-flex align-items-center font-weight-bold text-primary ml-2 valueSpan2 text-monospace",
            style: { "user-select": "none" },
          },
          [text(state.conway.time)]
        ),
      ]),
    ]),
    canvas({
      id: conwayElementId,
      class: "conwayGame",
      onwheel: zoomConwayGrid,
      onmousedown: setDraggableTrue,
      onmouseup: setDraggableFalse,
      onmousemove: dragConwayGrid,
      onmouseleave: setDraggableFalse,
      ontouchend: setMobileDraggableFalse,
      ontouchstart: setDraggableTrue,
      ontouchmove: dragConwayGridMobile,
    }),
  ])
}

const pauseDueToTimerDrag = (state: AppState) => ({
  ...state,
  conway: {
    ...state.conway,
    pausedDueToTimerDrag: true,
  },
})

const downloadConwayState = (content: string) => (state: AppState) => {
  const a = document.createElement("a")
  a.setAttribute("href", URL.createObjectURL(new Blob([content])))
  a.setAttribute("download", "conwayState.cells")
  a.click()
  return state
}

const togglePausePlay = (state: AppState) => ({
  ...state,
  conway: {
    ...state.conway,
    paused: !state.conway.paused,
  },
})

const unpauseDueToTimerDrag = (state: AppState) => ({
  ...state,
  conway: {
    ...state.conway,
    pausedDueToTimerDrag: false,
  },
})

const setConwayTime = (state: AppState, event): AppState => ({
  ...state,
  conway: {
    ...state.conway,
    time: event.target.valueAsNumber,
  },
})

export const maxCachedTimeRange = 500

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

const zoomConwayGrid = (state: AppState, event): AppState => ({
  ...state,
  conway: {
    ...state.conway,
    cellWidthPx: Math.max(Math.min(state.conway.cellWidthPx - event.deltaY / 30, 10), 4),
  },
})

const setDraggableTrue = (state: AppState, event): AppState => ({
  ...state,
  conway: {
    ...state.conway,
    draggable: true,
  },
})

const setDraggableFalse = (state: AppState): AppState => ({
  ...state,
  conway: {
    ...state.conway,
    draggable: false,
  },
})

const setMobileDraggableFalse = (state: AppState): AppState => ({
  ...state,
  conway: {
    ...state.conway,
    draggable: false,
    mobile: {
      startDragX: undefined,
      startDragY: undefined,
    },
  },
})

const dragConwayGrid = (state: AppState, event: MouseEvent): AppState =>
  state.conway.draggable
    ? {
        ...state,
        conway: {
          ...state.conway,
          draggedX: state.conway.draggedX + event.movementX,
          draggedY: state.conway.draggedY + event.movementY,
        },
      }
    : state

const dragConwayGridMobile = (state: AppState, event: TouchEvent): AppState =>
  state.conway.draggable
    ? {
        ...state,
        conway: {
          ...state.conway,
          draggedX:
            state.conway.draggedX +
            (state.conway.mobile.startDragX ? event.touches[0].clientX - state.conway.mobile.startDragX : 0),
          draggedY:
            state.conway.draggedY +
            (state.conway.mobile.startDragY ? event.touches[0].clientY - state.conway.mobile.startDragY : 0),
          mobile: {
            ...state.conway.mobile,
            startDragX: event.touches[0].clientX,
            startDragY: event.touches[0].clientY,
          },
        },
      }
    : state
