import { AppState } from ".."
import { div } from "@hyperapp/html"
import { aboutMe } from "./aboutMe"
import { myPractices } from "./myPractices"
import { contactMe } from "./contactMe"
import { technologies } from "./technologies"

export const frontPage = (state: AppState) =>
  div({}, [aboutMe(state), myPractices(), technologies(), contactMe()])
