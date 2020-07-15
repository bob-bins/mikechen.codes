import { text } from "hyperapp"

export const router = (paths: Array<{ path: string; view }>) =>
  paths.filter(path => path.path == window.location.pathname)[0].view ?? notFound

export const notFound = () => text("404 not found")
