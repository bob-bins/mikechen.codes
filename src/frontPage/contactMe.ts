import { a, div, h1, i } from "@hyperapp/html"
import { text } from "hyperapp"

export const contactMeId = "Contact"
export const contactMe = () =>
  div({ class: "jumbotron p-5 bg-dark", id: contactMeId }, [
    div({ class: "container text-center text-white" }, [h1({}, text("Contact"))]),
    div({ class: "container p-3 px-5 d-flex justify-content-around" }, [
      div({}, gitlabButton()),
      div({}, emailButton()),
      div({}, linkedInButton()),
    ]),
  ])

const emailButton = () =>
  a({ class: "nav-link link-primary text-center", href: "mailto:mchen300@gmail.com" }, [
    i({ class: "fa fa-envelope me-2", "aria-hidden": true }),
    text("mchen300@gmail.com"),
  ])

const linkedInButton = () =>
  a(
    {
      class: "nav-link link-primary text-center",
      href: "https://www.linkedin.com/in/mike-chen-96a75110/",
      target: "_blank",
    },
    [i({ class: "fa fa-linkedin-square me-2", "aria-hidden": true }), text("LinkedIn")]
  )

const gitlabButton = () =>
  a({ class: "nav-link link-primary text-center", href: "https://github.com/bob-bins", target: "_blank" }, [
    i({ class: "fa fa-github me-2", "aria-hidden": true }),
    text("GitHub"),
  ])
