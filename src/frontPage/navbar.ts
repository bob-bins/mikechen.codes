import { a, button, div, li, nav, ul } from "@hyperapp/html"
import { text } from "hyperapp"
import { conwayHash } from "../conwayGameOfLife/globalSettings"
import { contactMeId } from "./contactMe"
import { practicesId } from "./myPractices"
import { rootPath } from "./rootPath"
import { technologiesId } from "./technologies"

const navbarId = "navbarNavDropdown"
export const navbar = () =>
  nav({ class: "navbar p-0 navbar-expand-sm navbar-dark bg-black sticky-top" }, [
    div({ class: "container-fluid p-0" }, [
      button(
        {
          class: "navbar-toggler",
          type: "button",
          "data-bs-toggle": "collapse",
          "data-bs-target": `#${navbarId}`,
          "aria-controls": "navbarId",
        },
        div({ class: "nav-item p-1" }, text("☰"))
      ),
      div(
        { class: "collapse navbar-collapse", id: navbarId },
        ul({ class: "navbar-nav" }, [
          li(
            { class: "nav-item" },
            a({ class: "nav-link font-monospace", href: `${rootPath}#` }, text(rootPath))
          ),
          li(
            { class: "nav-item" },
            a({ class: "nav-link", href: `${rootPath}#${practicesId}` }, text("Practices"))
          ),
          li(
            { class: "nav-item" },
            a({ class: "nav-link", href: `${rootPath}#${technologiesId}` }, text("Technologies"))
          ),
          li(
            { class: "nav-item" },
            a({ class: "nav-link", href: `${rootPath}#${contactMeId}` }, text("Contact"))
          ),
          li({ class: "nav-item dropdown" }, [
            a(
              {
                class: "nav-link dropdown-toggle",
                role: "button",
                "data-bs-toggle": "dropdown",
              },
              text("Misc Stuff")
            ),
            ul({ class: "dropdown-menu dropdown-menu-dark bg-black p-0 m-0 border-0" }, [
              li({}, a({ class: "dropdown-item", href: conwayHash }, text("Conway's Game of Life"))),
              li(
                {},
                a(
                  {
                    class: "dropdown-item",
                    href: "https://github.com/bob-bins/mikechen.codes",
                    target: "_blank",
                  },
                  text("Site Source Code")
                )
              ),
            ]),
          ]),
        ])
      ),
    ]),
  ])
