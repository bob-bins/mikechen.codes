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
        i({ class: "fas fa-shapes mr-1" }, []),
        "Purpose-driven decision-making",
        `My decisions are rooted in core principles that make sense to both the team and the business.
        Decisions are never made without proper context, and always void of ad-hoc reasoning.`
      ),
      practicesCard(
        i({ class: "fas fa-hand-holding-heart mr-1" }, []),
        "Understanding through empathy",
        `Empathy is a must for understanding others' perspectives, which is a prerequisite to 
        building both a product the user loves and a team that loves to build it.`
      ),
      practicesCard(
        i({ class: "fas fa-book-open mr-1" }, []),
        "Lifelong student and teacher",
        `To stop learning is to stop growing, and one of the best ways to learn is to teach.`
      ),
      practicesCard(
        div({ class: "text-monospace", style: { "font-weight": "bold" } }, text("f(x)")),
        "Declarative and typed code",
        `I embrace functional programming styles with expressive static types. 
        These higher levels of abstraction increase code discoverability, 
        increases readability of existing code, and allows entire classes of errors to be 
        caught as early as possible.`
      ),
      practicesCard(
        i({ class: "fas fa-code mr-1" }, []),
        "Infrastructure as real code",
        `IaC has become a popular process of managing infrastructure, but 
        many tools make use of templating languages that do not allow advanced abstractions.
        I strive for declarative infrastructure using the full power of 
        general-purpose languages whenever possible.`
      ),
    ]),
  ])
