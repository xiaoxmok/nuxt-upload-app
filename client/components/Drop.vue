<template>
  <div class="con">
    <div :class="['box', {drag: isDarg }]" ref="drop">
      <p v-show="!postFiles.length">文件拖拽到这里</p>
      <p v-for="(item, index) in postFiles" :key="index">{{ item.name }}</p>
    </div>
    <button @click="uploadFile">上 传</button>
  </div>
</template>

<script>
import { on, off } from '~/utils/dom.js'
export default {
  data () {
    return {
      $drop: null,
      isDarg: false,
      postFiles: ''
    }
  },
  mounted () {
    this.$drop = this.$refs.drop
    this.bindEvents()
  },
  beforeDestroy() {
    this.unbindEvents()
  },
  methods: {
    bindEvents () {
      on(this.$drop, 'drop', this.handleDrop)
      on(this.$drop, 'dragover', this.handleDragOver)
      on(this.$drop, 'dragleave', this.handleDragLeave)
    },
    unbindEvents () {
      off(this.$drop, 'drop', this.handleDrop)
      off(this.$drop, 'dragover', this.handleDragOver)
      off(this.$drop, 'dragleave', this.handleDragLeave)
    },
    handleDrop (e) {
      e.preventDefault()

      let files = e.dataTransfer.files
      this.postFiles = Array.prototype.slice.call(files)
      console.log('object', files, this.postFiles)
    },
    handleDragOver (e) {
      this.isDarg = true
      e.preventDefault()
    },
    handleDragLeave (e) {
      this.isDarg = false
      e.preventDefault()
    },
    uploadFile () {
      if (!this.postFiles.length) return
      this.postFiles.forEach(item => {
        this.upload(item)
      })
      this.isDarg = false
    },
    async upload (file) {
      const formData = new FormData()
      formData.append('file', file)

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
      this.imgSrc = data.data
      this.$Message.success('成功')
    }
  }
}
</script>

<style>
.box{
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column-reverse;
  border: 1px dashed #999;
  margin-bottom: 20px;
}
.drag{
 background: #e0dede;
}
</style>
