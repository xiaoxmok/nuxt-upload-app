<template>
  <div class="con">
    <h4>文件分片上传</h4>
    <div class="upload">
      选择文件:
      <input type="file" ref="input" @change="handleChange"/>
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
      imgSrc: ''
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
      let token = new Date().getTime()
      let name = file.name
      let sendChunkCount = 0
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

      let chunkCount = chunkList.length
      let promises = chunkList.map((item, index) => {
        const option = {
          token: token,
          file: item,
          index: index
        }
        return Promise.resolve(this.uploadFile(option))
      })

      Promise.all(promises).then(res => {
        console.log('分片上传完成')
        const opt = {
          token: token,
          fileName: name,
          chunkCount: chunkCount,
          type: 'merge'
        }
        this.uploadFile(opt)
      })

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

      const { data } = await this.$axios.post('/chunkUpload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (option.type) {
        this.imgSrc = data.data
      }
      this.$Message.success(data.msg)
    }
  }
}
</script>

<style scoped>
.upload{
  margin: 20px 0;
}

</style>
