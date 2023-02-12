import { div, h1, h4, i, p } from "@hyperapp/html"
import { text } from "hyperapp"

const practicesCard = (icon, title: string, description: string) =>
  div({ class: "card noBorder p-3 col-md-4 practicesCard" }, [
    h4({ class: "card-header noBorder" }, [div({}, icon), text(title)]),
    div({ class: "card-body practicesCardBorder" }, [p({ class: "card-text" }, text(description))]),
  ])

export const practicesId = "Practices"
export const myPractices = () =>
  div({ class: "jumbotron bg-white", id: practicesId }, [
    div({ class: "container text-center" }, [h1({}, text("Practices"))]),
    div({ class: "container-fluid d-flex flex-row flex-wrap justify-content-center" }, [
      practicesCard(
        i({ class: "fa-solid fa-shapes mr-1" }, []),
        "Purpose-driven decision-making",
        `My decisions are rooted in core principles that make sense to both the team and the business.
        Decisions are never made without proper context, and always void of ad-hoc reasoning.`
      ),
      practicesCard(
        i({ class: "fa-solid fa-brain mr-1" }, []),
        "Challenge the status quo",
        `The idea behind "If it ain't broke, don't fix it" is often rooted in fear of change, and thus
        often in opposition to innovation.`
      ),
      practicesCard(
        i({ class: "fa-solid fa-book-open" }, []),
        "Lifelong student and teacher",
        `To stop learning is to stop growing.
        And one of the most fulfilling ways to use knowledge is to share it!`
      ),
      practicesCard(
        i({ class: "fa-solid fa-hand-holding-heart mr-1" }, []),
        "Understanding through empathy",
        `Empathy is a must for understanding others' perspectives, which is a prerequisite to 
        building both a product the user loves and a team that loves to build it.`
      ),
      practicesCard(
        i({ class: "fa-solid fa-cubes-stacked mr-1" }, []),
        "Build for maintenance",
        `Bad code must still be read many times throughout its lifetime, becoming a significant source of hidden costs.
        I always strive for intuitive and self-discoverable implementations.`
      ),
    ]),
  ])
