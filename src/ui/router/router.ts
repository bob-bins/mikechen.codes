import { text } from "hyperapp"

export const router = (paths: Array<{ path?: string; hash?: string, view }>) =>
  paths.filter(path => path.hash == window.location.hash || path.path == window.location.pathname)[0]?.view ?? notFound

export const notFound = () => text("404 not found")
