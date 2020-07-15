import Koa from "koa"
import Router from "koa-router"
import serve from "koa-static"
import mount from "koa-mount"
import Logger from "koa-logger"
import { port } from "./port"
import { conwayPath } from "../ui/conwayGameOfLife/conwayPath"
import { rootPath } from "../ui/frontPage/rootPath"

const static_pages = new Koa().use(serve("./dist/ui"))
const router = new Router().get("/api/hi", async (ctx, next) => {
  ctx.status = 200
  ctx.body = "oh hello!!"
  await next()
})

new Koa()
  .use(mount(rootPath, static_pages))
  .use(mount(conwayPath, static_pages)) //todo: is it possible to serve static_pages on a regex route match?
  .use(router.routes()).use(router.allowedMethods())
  .use(Logger())
  .listen(port, () => console.log(`http://localhost:${port}`))
