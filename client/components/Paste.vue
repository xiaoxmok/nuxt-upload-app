<template>
  <div class="con">
    <div contenteditable="true" ref="paste" class="box">粘贴</div>
    <p v-for="(item, index) in postFiles" :key="index">{{ item.name }}</p>
    <button @click="uploadFile">上 传</button>
  </div>
</template>

<script>
import { on, off } from '~/utils/dom.js'
export default {
  data () {
    return {
      $paste: null,
      postFiles: []
    }
  },
  mounted () {
    this.$paste = this.$refs.paste
    this.bindEvents()
  },
  beforeDestroy() {
    this.unbindEvents()
  },
  methods: {
    bindEvents () {
      on(this.$paste, 'paste', this.handlePaste)
    },
    unbindEvents() {
      off(this.$paste, 'paste', this.handlePaste)
    },
    handlePaste (e) {
      e.preventDefault()
      let data = e.clipboardData || window.clipboardData
      let items = data.items
      if (items.length) {
        for (var i = 0; i < items.length; i++) {
          let item = items[i].getAsFile()
          if (item) {
            this.postFiles.push(items[i].getAsFile())
          }
        }
      }
      console.log('this.postFiles', this.postFiles)
    },
    uploadFile () {
      if (!this.postFiles.length) return
      this.postFiles.forEach(item => {
        this.upload(item)
      })
    },
    async upload (file) {
      if (!file) return
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await this.$axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          // 进度条
          if (e.lengthComputable) {
            const process = Math.round((e.loaded / e.total) * 100)
          }
        }
       })
      this.imgSrc = data.data
      this.$Message.success(data.msg)
    }
  }
}
</script>

<style scoped>
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
</style>
