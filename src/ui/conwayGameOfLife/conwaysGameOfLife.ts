import { canvas, div, input, span, button } from "@hyperapp/html"
import { text } from "hyperapp"
import { range } from "../../utils/range"
import { AppState } from "../index"
import { getCellState, live } from "./board"

export const conwaysGameOfLife = (state:AppState) => {
  const conwayElementId = "conway"
  const htmlCanvas = (<HTMLCanvasElement>document.getElementById(conwayElementId))
  if (htmlCanvas) {
    htmlCanvas.onwheel = e => e.preventDefault()
    htmlCanvas.width = window.innerWidth
    htmlCanvas.height = window.innerHeight
    
    const cellWidth = Math.ceil(state.conway.cellWidthPx)
    const numOfCols = Math.ceil(htmlCanvas.width / cellWidth)
    const numOfRows = Math.ceil(htmlCanvas.height / cellWidth)
    const minCol = state.conway.centerX - Math.ceil(numOfCols / 2) - Math.ceil(state.conway.draggedX/cellWidth)
    const minRow = state.conway.centerY - Math.ceil(numOfRows / 2) - Math.ceil(state.conway.draggedY/cellWidth)
    
    const conwayData = range(minRow, minRow+numOfRows)
      .map(rowIndex =>
        range(minCol, minCol+numOfCols).map(colIndex => [rowIndex, colIndex])
      )
      .map(
        row =>
        row.map(
          ([rowIndex, colIndex]) =>
          getCellState(state.conway.time, rowIndex, colIndex, {minRow: -100, maxRow:100, minCol:-100, maxCol:100}))
      )
    const ctx = htmlCanvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    conwayData.map((row, rowIndex) =>
      row.forEach((state, colIndex) => {
        if (state == live) {
          ctx.fillStyle = 'rgb(255, 255, 255)'
          ctx.fillRect(cellWidth*colIndex, rowIndex * cellWidth, cellWidth, cellWidth)
        }
      })
    )
  }
  return div({},[
    div({class:"py-2 conwayControls"}, [
      div({class:"d-flex col-12", style:{"white-space":"nowrap", "line-height":"26px"}}, [
        span({class:"mr-2"}, [
          button({
            class:`btn btn-primary fas ${state.conway.paused ? "fa-play" : "fa-pause"}`,
            onclick: togglePausePlay,
            }, []),
        ]),
        span({class:"d-inline-flex align-items-center font-weight-bold text-primary mr-2 valueSpan2 text-monospace"}, [
          text("Time"),
        ]),
        input(
          {
            type:"range",
            class:"custom-range pt-2",
            style:{"flex":1},
            min:0,
            max:state.conway.maxTimeReached,
            value: state.conway.time,
            oninput: setConwayTime,
            onmousedown: pauseDueToTimerDrag,
            onmouseup: unpauseDueToTimerDrag,
          },
          []
        ),
        span({class:"d-inline-flex align-items-center font-weight-bold text-primary ml-2 valueSpan2 text-monospace", style:{"user-select":"none"}}, [
          text(state.conway.time),
        ]),
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
    })
  ])
}

const pauseDueToTimerDrag = (state:AppState) => ({
  ...state,
  conway: {
    ...state.conway,
    pausedDueToTimerDrag: true,
  }
})

const togglePausePlay = (state:AppState) => ({
  ...state,
  conway: {
    ...state.conway,
    paused: !state.conway.paused,
  }
})

const unpauseDueToTimerDrag = (state:AppState) => ({
  ...state,
  conway: {
    ...state.conway,
    pausedDueToTimerDrag: false,
  }
})

const setConwayTime = (state:AppState, event):AppState => ({
  ...state,
  conway: {
    ...state.conway,
    time: event.target.valueAsNumber,
  }
})

export const incrementConwayTime = (state:AppState):AppState =>
  state.conway.paused || state.conway.pausedDueToTimerDrag ?
    state
  : ({
    ...state,
    conway: {
      ...state.conway,
      time: state.conway.time+1,
      maxTimeReached: Math.max(state.conway.time+1, state.conway.maxTimeReached)
    }
  })

const zoomConwayGrid = (state:AppState, event):AppState => ({
  ...state,
  conway: {
    ...state.conway,
    cellWidthPx: Math.max(Math.min(state.conway.cellWidthPx - event.deltaY/30, 10), 4)
  }
})

const setDraggableTrue = (state:AppState, event):AppState => ({
  ...state,
  conway: {
    ...state.conway,
    draggable: true,
  }
})

const setDraggableFalse = (state:AppState):AppState => ({
  ...state,
  conway: {
    ...state.conway,
    draggable: false,
  }
})

const setMobileDraggableFalse = (state:AppState):AppState => ({
  ...state,
  conway: {
    ...state.conway,
    draggable: false,
    mobile: {
      startDragX: undefined,
      startDragY: undefined,
    }
  }
})

const dragConwayGrid = (state:AppState, event:MouseEvent):AppState =>
  state.conway.draggable ?
    ({
      ...state,
      conway: {
        ...state.conway,
          draggedX: state.conway.draggedX + event.movementX,
          draggedY: state.conway.draggedY + event.movementY,
        },
    })
  : state

const dragConwayGridMobile = (state:AppState, event:TouchEvent):AppState =>
  state.conway.draggable ?
    ({
      ...state,
      conway: {
        ...state.conway,
        draggedX: state.conway.draggedX + (state.conway.mobile.startDragX ? event.touches[0].clientX - state.conway.mobile.startDragX : 0),
        draggedY: state.conway.draggedY + (state.conway.mobile.startDragY ? event.touches[0].clientY - state.conway.mobile.startDragY : 0),
        mobile: {
          ...state.conway.mobile,
          startDragX: event.touches[0].clientX,
          startDragY: event.touches[0].clientY,
        }
      }
    })
  : state
