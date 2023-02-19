import { main } from "@hyperapp/html"
import { every } from "@hyperapp/time"
import { app } from "hyperapp"
import { conwaysGameOfLife } from "./conwayGameOfLife/conwaysGameOfLife"
import { CellStateFn, conwayHash } from "./conwayGameOfLife/globalSettings"
import { incrementConwayTime } from "./conwayGameOfLife/incrementConwayTime"
import { updatePhrase } from "./frontPage/aboutMe"
import { frontPage } from "./frontPage/frontPage"
import { navbar } from "./frontPage/navbar"
import "./style.scss"

export type AppState = {
  mobileNavbarExpanded: boolean
  navbarDropdownExpandedInMobile: boolean
  phraseDescribingMeIndex: number
  conway: {
    paused: boolean
    pausedDueToTimerDrag: boolean
    time: number
    maxTimeReached: number
    minTime: number
    cellWidthPx: number
    centerX: number
    centerY: number
    draggable: boolean
    draggedX: number
    draggedY: number
    initialBoardFn?: CellStateFn
    mobile: {
      startDragX: number | undefined
      startDragY: number | undefined
    }
  }
}

const initialState: AppState = {
  mobileNavbarExpanded: false,
  navbarDropdownExpandedInMobile: false,
  phraseDescribingMeIndex: 0,
  conway: {
    paused: false,
    pausedDueToTimerDrag: false,
    time: 0,
    maxTimeReached: 0,
    minTime: 0,
    cellWidthPx: 5,
    centerX: 0,
    centerY: 0,
    draggable: false,
    draggedX: 0,
    draggedY: 0,
    mobile: {
      startDragX: undefined,
      startDragY: undefined,
    },
  },
}

app({
  init: initialState,
  subscriptions: (state: AppState) => [
    window.location.hash == conwayHash &&
      !state.conway.paused &&
      !state.conway.pausedDueToTimerDrag &&
      every(50, incrementConwayTime),
    window.location.hash != conwayHash && every(2000, updatePhrase),
  ],
  view: (state: AppState) =>
    main({}, [
      navbar(),
      window.location.hash == conwayHash && conwaysGameOfLife(state),
      window.location.hash != conwayHash && frontPage(state),
    ]),
  node: document.getElementById("app"),
})
