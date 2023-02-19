import { main } from "@hyperapp/html"
import { every } from "@hyperapp/time"
import { app } from "hyperapp"
import { conwaysGameOfLife } from "./conwayGameOfLife/conwaysGameOfLife"
import { incrementConwayTime } from "./conwayGameOfLife/incrementConwayTime"
import { CellStateFn, conwayHash } from "./conwayGameOfLife/globalSettings"
import { aboutMe, updatePhrase } from "./frontPage/aboutMe"
import { contactMe } from "./frontPage/contactMe"
import { myPractices } from "./frontPage/myPractices"
import { navbar } from "./frontPage/navbar"
import { rootPath } from "./frontPage/rootPath"
import { technologies } from "./frontPage/technologies"
import { router } from "./router/router"
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
  subscriptions: () => [
    window.location.hash == conwayHash && every(50, incrementConwayTime),
    window.location.hash != conwayHash && every(2000, updatePhrase),
  ],
  view: (state: AppState) =>
    main(
      {},
      router([
        {
          hash: conwayHash,
          view: [navbar(), conwaysGameOfLife(state)],
        },
        {
          path: rootPath,
          view: [navbar(), aboutMe(state), myPractices(), technologies(), contactMe()],
        },
      ])
    ),
  node: document.getElementById("app"),
})
