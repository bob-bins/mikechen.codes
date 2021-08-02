import Koa from "koa"
import Logger from "koa-logger"
import mount from "koa-mount"
import Router from "koa-router"
import sslify, { xForwardedProtoResolver, httpsResolver } from "koa-sslify"
import serve from "koa-static"
import { nextTick } from "process"
import { conwayPath } from "../ui/conwayGameOfLife/conwayPath"
import { rootPath } from "../ui/frontPage/rootPath"
import { port } from "./port"

const static_pages = new Koa().use(serve("./dist/ui"))
const router = new Router().get("/api/hi", async (ctx, next) => {
  ctx.status = 200
  ctx.body = "oh hello!!"
  await next()
})

new Koa()
  .use(
    sslify({
      resolver: ctx =>
        ctx.hostname == "localhost" ? false : xForwardedProtoResolver(ctx) || httpsResolver(ctx),
    })
  )
  .use(mount(rootPath, static_pages))
  .use(mount(conwayPath, static_pages)) //todo: is it possible to serve static_pages on a regex route match?
  .use(router.routes())
  .use(router.allowedMethods())
  .use(Logger())
  .listen(port, () => console.log(`http://localhost:${port}`))
