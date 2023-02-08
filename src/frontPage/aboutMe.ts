import { br, div, h1, img, p, span } from "@hyperapp/html"
import { text } from "hyperapp"
import { AppState } from ".."
import mike_chen_pic from "./mike_chen_pic.png"

const avatarWithCaption = (phraseDescribingMe: string) =>
  div({ class: "container text-center align-self-center mr-lg-0", style: { width: "450px" } }, [
    img({
      class: "rounded-circle",
      style: { width: "100%", "max-width": "200px", "background-color": "white" },
      src: mike_chen_pic,
    }),
    span({ class: "text-center" }, [
      h1({ class: "text-white mt-3" }, [text(`Hi, I'm Mike Chen! I'm a`)]),
      span(
        { class: "aboutGreetingTitle text-white mt-3 text-monospace", style: { height: "120px" } },
        text(`${phraseDescribingMe}`)
      ),
    ]),
    br({}, []),
  ])

const aboutMeDescription = div(
  { class: "container align-self-center ml-lg-0", style: { "max-width": "580px", flex: `1 1 300px` } },
  [
    p(
      { class: "mt-3 text-white aboutDescription" },
      text(
        `I have proven experience in improving engineering efficiency by enhancing the adoption of DevOps 
        culture. I am hands-on in both designing and implementing these systems with modern technologies.`
      )
    ),
    p({}, []),
    p(
      { class: "mt-3 text-white aboutDescription" },
      text(
        `My wide breadth of experience allows me to find elegant solutions that bring the best from both 
        development and operations.`
      )
    ),
  ]
)

export const aboutMeId = "About"
export const aboutMe = (state: AppState) =>
  div({ class: "jumbotron d-flex flex-wrap flex-shrink bg-dark", id: aboutMeId }, [
    avatarWithCaption(phrasesThatDescribeMe[state.phraseDescribingMeIndex]),
    aboutMeDescription,
  ])

export const phrasesThatDescribeMe = [
  // make sure these aren't too long or you'll have to deal with UI quirkiness
  "full stack dev",
  "infrastructure engineer",
  "DevOps advocate",
  "cat uncle",
  "big nerd",
]

export const updatePhrase = (state: AppState): AppState => ({
  ...state,
  phraseDescribingMeIndex: (state.phraseDescribingMeIndex + 1) % phrasesThatDescribeMe.length,
})
