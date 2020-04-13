<template>
  <div class="con">
    <h4>基础文件上传功能</h4>
    <div class="upload">
      选择文件:
      <input type="file" ref="input" @change="handleChange"/>
      <button @click="uploadFile">上 传</button>
    </div>
    <div>
      <h5>预览：</h5></h5></h5>
      <img :src="imgSrc" width="300" height="200" alt="">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      postFiles: null,
      multiple: false,
      imgSrc: ''
    }
  },
  methods: {
    handleChange(e) {
      const files = e.target.files

      if (!files) {
        return
      }
      // this.uploadFiles(files)
      this.postFiles = Array.prototype.slice.call(files)
      // this.postFiles = this.postFiles.slice(0, 1)
      // this.$refs.input.value = null
    },
    async uploadFile() {
      const formData = new FormData()
      formData.append('file', this.postFiles[0])

      const { data } = await this.$axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          // 进度条
          if (e.lengthComputable) {
            const process = Math.round((e.loaded / e.total) * 100)
            console.log('process', process)
          }
        }
       })
      console.log('data', data)
      this.imgSrc = data.data
      this.$Message.success('成功')
    }
  }
}
</script>

<style scoped>
.upload{
  margin: 20px 0;
}

</style>
