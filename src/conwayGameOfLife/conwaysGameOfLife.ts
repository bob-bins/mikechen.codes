import { canvas, div, input, span, button } from "@hyperapp/html"
import { text } from "hyperapp"
import { range } from "../utils/range"
import { AppState } from "../index"
import { clearCellStateCache, getCellState } from "./engine"
import { isMobileDevice } from "../utils/isMobileDevice"
import { uploadTextFromBrowser } from "../utils/uploadTextFromBrowser"
import { boardNumOfRows, boardNumOfCols, live } from "./globalSettings"
import { parseConwayBoard } from "./parseConwayBoard"

export const conwaysGameOfLife = (state: AppState) => {
  const conwayElementId = "conway"
  const htmlCanvas = <HTMLCanvasElement>document.getElementById(conwayElementId)
  if (htmlCanvas) {
    htmlCanvas.onwheel = e => e.preventDefault()
    htmlCanvas.width = window.innerWidth
    htmlCanvas.height = window.innerHeight

    const cellWidth = Math.ceil(state.conway.cellWidthPx)

    const minDisplayedColNum = state.conway.centerX - Math.ceil(state.conway.draggedX / cellWidth)
    const minDisplayedRowNum = state.conway.centerY - Math.ceil(state.conway.draggedY / cellWidth)

    const displayedConwayState = range(minDisplayedRowNum, minDisplayedRowNum + boardNumOfRows - 1).map(
      rowIndex =>
        range(minDisplayedColNum, minDisplayedColNum + boardNumOfCols - 1).map(colIndex =>
          getCellState(
            state.conway.time,
            rowIndex,
            colIndex,
            {
              maxRow: boardNumOfRows - 1,
              maxCol: boardNumOfCols - 1,
            },
            state.conway.initialBoardFn
          )
        )
    )

    const ctx = htmlCanvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    displayedConwayState.forEach((row, rowIndex) =>
      row.forEach((state, colIndex) => {
        if (state == live) {
          ctx.fillStyle = "rgb(255, 255, 255)"
          ctx.fillRect(cellWidth * colIndex, rowIndex * cellWidth, cellWidth, cellWidth)
        }
      })
    )
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
            draggedX: 0,
            draggedY: 0,
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
Maximum board size is ${boardNumOfRows}x${boardNumOfCols}. Extra cells are truncated.`,
                    onclick: state => [state, uploadConwayState],
                  },
                  []
                ),
                button(
                  {
                    class: `btn btn-primary fas fa-download`,
                    title: `Download Conway Board state as a multiline string. "." represents "dead" and "O" represents "alive"`,
                    onclick: downloadConwayState,
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

const downloadConwayState = (state: AppState) => {
  const stringifiedConwayBoard = range(0, boardNumOfRows)
    .map(row =>
      range(0, boardNumOfCols).map(col =>
        getCellState(state.conway.time, row, col, {
          maxRow: boardNumOfRows - 1,
          maxCol: boardNumOfCols - 1,
        })
      )
    )
    .map(row => row.join(""))
    .join("\n")
  const a = document.createElement("a")
  a.setAttribute("href", URL.createObjectURL(new Blob([stringifiedConwayBoard])))
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

const zoomConwayGrid = (state: AppState, event): AppState => ({
  ...state,
  conway: {
    ...state.conway,
    cellWidthPx: Math.max(Math.min(state.conway.cellWidthPx - event.deltaY / 30, 13), 3),
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
