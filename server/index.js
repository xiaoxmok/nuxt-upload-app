const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')
const koaStatic = require('koa-static');
const path = require('path')
const routers = require('./routers')

const app = new Koa()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

app.use(koaBody({
  multipart: true,  // 支持表单上传
}))
//开启静态文件访问
app.use(koaStatic(
  path.resolve(__dirname, './static')
));
app.use(bodyParser())
app.use(routers.routes()).use(routers.allowedMethods())

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  await nuxt.ready()
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
