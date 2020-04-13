const Router = require('koa-router')
const router = new Router()

const ajax = require('./ajax')()

router.use('/ajax', ajax.routes(), ajax.allowedMethods())

module.exports = router
