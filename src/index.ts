import { main } from "@hyperapp/html"
import { every } from "@hyperapp/time"
import { app } from "hyperapp"
import { conwayHash } from "./conwayGameOfLife/conwayHash"
import { conwaysGameOfLife, incrementConwayTime } from "./conwayGameOfLife/conwaysGameOfLife"
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
    cellWidthPx: number
    centerX: number
    centerY: number
    draggable: boolean
    draggedX: number
    draggedY: number
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
    time: 1,
    maxTimeReached: 1,
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
    window.location.hash == conwayHash && every(100, incrementConwayTime),
    window.location.pathname == "/" && every(2000, updatePhrase),
  ],
  view: (state: AppState) =>
    main(
      {},
      router([
        {
          hash: conwayHash,
          view: [navbar(state), conwaysGameOfLife(state)],
        },
        {
          path: rootPath,
          view: [navbar(state), aboutMe(state), myPractices(), technologies(), contactMe()],
        },
      ])
    ),
  node: document.getElementById("app"),
})
