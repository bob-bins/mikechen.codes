import { a, li, nav, ul } from "@hyperapp/html"
import { text } from "hyperapp"
import { AppState } from ".."
import { conwayHash } from "../conwayGameOfLife/conwayHash"
import { contactMeId } from "./contactMe"
import { practicesId } from "./myPractices"
import { rootPath } from "./rootPath"
import { technologiesId } from "./technologies"

export const navbar = (state: AppState) =>
  nav({}, [
    ul(
      {
        onclick: (state: AppState) => ({
          ...state,
          navbarDropdownExpandedInMobile: !state.navbarDropdownExpandedInMobile,
        }),
        onmouseleave: (state: AppState) => ({ ...state, navbarDropdownExpandedInMobile: false }),
        class: `${state.navbarDropdownExpandedInMobile ? "" : "listItemsHidden"}`,
      },
      [
        li({ class: "text-monospace" }, [a({ href: `${rootPath}#` }, text(rootPath))]),
        li({}, [a({ href: `${rootPath}#${practicesId}` }, text("Practices"))]),
        li({}, [a({ href: `${rootPath}#${technologiesId}` }, text("Technologies"))]),
        li({}, [a({ href: `${rootPath}#${contactMeId}` }, text("Contact"))]),
        li({}, [
          a({}, text("Misc Stuff")),
          ul({}, [
            li({}, [a({ href: conwayHash }, text("Conway's Game of Life"))]),
            li({}, [
              a(
                { href: "https://github.com/bob-bins/mikechen.codes", target: "_blank" },
                text("Site Source Code")
              ),
            ]),
          ]),
        ]),
      ]
    ),
  ])
