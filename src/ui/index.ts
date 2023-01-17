import { main } from "@hyperapp/html"
import { app } from "hyperapp"
import { timer } from "rxjs"
import { conwayHash } from "./conwayGameOfLife/conwayPath"
import { conwaysGameOfLife, incrementConwayTime } from "./conwayGameOfLife/conwaysGameOfLife"
import { aboutMe, phrasesThatDescribeMe, phraseUpdateIntervalSub, updatePhrase } from "./frontPage/aboutMe"
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
  phraseDescribingMe: string
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
  phraseDescribingMe: phrasesThatDescribeMe[0],
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

const intervalCounterSub = (dispatch, props) => {
  const sub = timer(props.intervalMs, props.intervalMs).subscribe(i => dispatch(props.action, i))
  return () => sub.unsubscribe()
}

app({
  init: initialState,
  subscriptions: (state: AppState) => [
    ...(window.location.pathname == "/" && window.location.hash != conwayHash
      ? [
          [
            phraseUpdateIntervalSub,
            {
              intervalMs: 2000,
              action: updatePhrase,
            },
          ],
        ]
      : []),
    ...(window.location.hash == conwayHash
      ? [
          [
            intervalCounterSub,
            {
              intervalMs: 100,
              action: incrementConwayTime,
            },
          ],
        ]
      : []),
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
