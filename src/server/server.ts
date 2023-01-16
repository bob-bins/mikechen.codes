import Koa from "koa"
import Logger from "koa-logger"
import mount from "koa-mount"
import Router from "koa-router"
import sslify, { httpsResolver, xForwardedProtoResolver } from "koa-sslify"
import serve from "koa-static"
import path from "path"
import { conwayPath } from "../ui/conwayGameOfLife/conwayPath"
import { rootPath } from "../ui/frontPage/rootPath"
import { port } from "./port"

const static_pages = new Koa().use(serve(path.join(__dirname, "../ui")))
const router = new Router().get("/api/hi", async (ctx, next) => {
  ctx.status = 200
  ctx.body = "oh hello!!"
  await next()
})

new Koa()
  .use(async (ctx, next) => {
    if (ctx.hostname == "127.0.0.1" || ctx.hostname == "localhost") {
      await next()
    }
    else {
      sslify({
        resolver: ctx => xForwardedProtoResolver(ctx) || httpsResolver(ctx),
      })(ctx, next)
    }
  })
  .use(mount(rootPath, static_pages))
  .use(mount(conwayPath, static_pages)) //todo: is it possible to serve static_pages on a regex route match?
  .use(router.routes())
  .use(router.allowedMethods())
  .use(Logger())
  .listen(port, () => console.log(`http://127.0.0.1:${port}`))
