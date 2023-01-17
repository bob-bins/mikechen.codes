import { a, div, h1, i } from "@hyperapp/html"
import { text } from "hyperapp"

export const contactMeId = "Contact"
export const contactMe = () =>
  div({ class: "jumbotron bg-dark m-0", id: contactMeId }, [
    div({ class: "container text-center text-white" }, [h1({}, text("Contact"))]),
    div({ class: "container d-flex justify-content-around" }, [
      div({}, [gitlabButton()]),
      div({}, [emailButton()]),
      div({}, [linkedInButton()]),
    ]),
  ])

const emailButton = () =>
  a({ class: "nav-link text-center", href: "mailto:mchen300@gmail.com" }, [
    i({ class: "fa fa-envelope mr-2", "aria-hidden": true }),
    text("mchen300@gmail.com"),
  ])

const linkedInButton = () =>
  a(
    {
      class: "nav-link text-center",
      href: "https://www.linkedin.com/in/mike-chen-96a75110/",
      target: "_blank",
    },
    [i({ class: "fa fa-linkedin-square mr-2", "aria-hidden": true }), text("LinkedIn")]
  )

const gitlabButton = () =>
  a({ class: "nav-link text-center", href: "https://github.com/bob-bins", target: "_blank" }, [
    i({ class: "fa fa-github mr-2", "aria-hidden": true }),
    text("GitHub"),
  ])
