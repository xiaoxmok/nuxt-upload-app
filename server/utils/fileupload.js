const path = require('path')
const fs = require('fs')

const fileupload = (ctx) => {
  let remotefilePath = null
  if (ctx.request.files['file']) {
    const reader = fs.createReadStream(ctx.request.files['file']['path'])
    let filePath = `${path.resolve(__dirname, '../static')}/${ctx.request.files['file']['name']}`

    remotefilePath = `/${ctx.request.files['file']['name']}`
    const upStream = fs.createWriteStream(filePath)

    reader.pipe(upStream)
  }
  return remotefilePath
}

const chunkUpload = (ctx) => {
  let remotefilePath = null
  let body = ctx.request.body
  let fileToken = body.token

  if (ctx.request.files['file']) {
    let fileIndex = body.index

    // let d = `${path.resolve(__dirname, '../static')}/${fileToken}`
    // fs.exists(d, (exists) => {
    //   if (!exists) {
    //     fs.mkdir(d, (err) => {
    //       if (err) throw err
    //     })
    //   }
    // })

    const reader = fs.createReadStream(ctx.request.files['file']['path'])
    let filePath = `${path.resolve(__dirname, '../static')}/${fileIndex}-${fileToken}`

    remotefilePath = `/${fileIndex}-${fileToken}`
    // console.log('remotefilePath', remotefilePath, filePath)
    const upStream = fs.createWriteStream(filePath)

    reader.pipe(upStream)
  }
  if (body.type === 'merge') {
    console.log('object', body.type)
    let fileName = body.fileName
    let chunkCount = body.chunkCount
    const folder = path.resolve(__dirname, '../static') + '/'

    let writeStream = fs.createWriteStream(`${folder}${fileName}`)
    let index = 0

    function mergeFile () {
      let fName = `${folder}${index}-${fileToken}`
      console.log('fName', fName)
      let readStream = fs.createReadStream(fName)
      readStream.pipe(writeStream, { end: false })
      readStream.on('end', () => {
        // 删除分片文件
        fs.unlink(fName, (err) => {
          if (err) throw err
        })

        if (index + 1 < chunkCount) {
          index += 1
          mergeFile()
        }
      })
    }
    mergeFile()
    remotefilePath = `/${fileName}`
  }
  return remotefilePath
}

module.exports = {
  fileupload,
  chunkUpload
}
