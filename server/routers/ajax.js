const Router = require('koa-router')
const upload = require('../utils/fileupload');
const router = new Router()

module.exports = () => {

  router.post('/upload', async (ctx) => {
    let url = await upload.fileupload(ctx)
    // let url = ''
    if (url) {
      ctx.body = {
        status: 0,
        msg: '上传成功',
        data: url
      }
    } else {
      ctx.body = {
        status: 1001,
        msg: '上传失败',
        data: url
      }
    }
  })

  router.post('/chunkUpload', async (ctx) => {
    let url = await upload.chunkUpload(ctx)
    // let url = ''
    if (url) {
      ctx.body = {
        status: 0,
        msg: '上传成功',
        data: url
      }
    } else {
      ctx.body = {
        status: 1001,
        msg: '上传失败',
        data: url
      }
    }
  })

  router.get('/getFile', (ctx) => {
    const params = ctx.request.query
    console.log('params', params)
    ctx.body = params
  })

  return router
}
