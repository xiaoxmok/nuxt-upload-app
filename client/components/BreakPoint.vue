<template>
  <div class="con">
    <h4>断点续传</h4>
    <div class="upload">
      选择文件:
      <input type="file" ref="input" @change="handleChange"/>
    </div>
    <div>
      <p>进度：{{ process }}%</p>
    </div>
    <div>
      <h5>预览：</h5>
      <img :src="imgSrc" width="300" height="200" alt="">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      postFiles: null,
      imgSrc: '',
      process: ''
    }
  },
  methods: {
    handleChange(e) {
      const files = e.target.files

      if (!files) {
        return
      }
      let file = Array.prototype.slice.call(files)[0]
      console.log('file', file)
      let chunkSize = 2*1024*1024 // 2M
      let chunkList = []
      // let token = new Date().getTime()
      let token = file.name
      let name = file.name
      let sendChunkCount = 0

      let fileUploadInfo = this.getStorage(name)
      let fileLoaded = 0

      if (file.size > chunkSize) {
        let start = 0
        let end = 0
        while(true) {
          end += chunkSize
          let blod = file.slice(start, end)
          start += chunkSize

          if (!blod.size) break

          chunkList.push(blod)
        }
      } else {
        chunkList.push(file)
      }

      if (!chunkList.length) return

      let chunkCount = chunkList.length
      // let promises = chunkList.map((item, index) => {
      //   const option = {
      //     token: token,
      //     file: item,
      //     index: index
      //   }
      //   return Promise.resolve(this.uploadFile(option)).then(res => {
      //     console.log('object', res)
      //     if (!res) return
      //     if (res.status === 0) {
      //       console.log('option.file.size', option.file.size, option.index)
      //       this.fileLoaded += option.file.size
      //       this.process = Math.round((fileLoaded / file.size) * 100)
      //       this.setStorage(name, option.index)
      //     }
      //   })
      // })

      // Promise.all(promises).then(res => {
      //   console.log('分片上传完成')
      //   const opt = {
      //     token: token,
      //     fileName: name,
      //     chunkCount: chunkCount,
      //     type: 'merge'
      //   }
      //   this.uploadFile(opt)
      // })

      let sendCount = 0
      for(var i = 0; i < chunkCount; i++) {

        // 判断是否上传过
        if (fileUploadInfo[i]) {
          sendCount += 1
          fileLoaded += chunkList[i].size
          this.process = Math.round((fileLoaded / file.size) * 100)
          continue
        }

        const option = {
          token: token,
          file: chunkList[i],
          index: i
        }
        Promise.resolve(this.uploadFile(option)).then(res => {
          if (!res) return
          if (res.status === 0) {
            console.log('option.file.size', option.file.size, option.index)
            fileLoaded += option.file.size
            this.process = Math.round((fileLoaded / file.size) * 100)
            this.setStorage(name, option.index)
            sendCount += 1
          }

          console.log('object111', sendCount, chunkCount)
          if (sendCount === chunkCount) {
            const opt = {
              token: token,
              fileName: name,
              chunkCount: chunkCount,
              type: 'merge'
            }
            this.uploadFile(opt)
          }
        })
      }
    },
    async uploadFile(option) {
      const formData = new FormData()

      if (option.type) {
        formData.append('type', 'merge')
        formData.append('token', option.token)
        formData.append('chunkCount', option.chunkCount)
        formData.append('fileName',option.fileName)
      } else {
        formData.append('token', option.token)
        formData.append('file', option.file)
        formData.append('index', option.index)
      }

      // 模拟断点
      // if (option.index > 3) return

      const { data } = await this.$axios.post('/chunkUpload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (option.type) {
        this.imgSrc = data.data
      }

      this.$Message.success(data.msg)

      return data
    },
    getStorage(key) {
      return JSON.parse( localStorage.getItem(key) || "{}")
    },
    setStorage(key, index) {
      let obj = this.getStorage(key)
      obj[index] = true
      localStorage.setItem(key, JSON.stringify(obj) )
    }
  }
}
</script>

<style scoped>
.upload{
  margin: 20px 0;
}

</style>
