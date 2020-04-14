<template>
  <div class="con">
    <p>样式一：使用透明度为0</p>
    <a href="javascript:;" class="a-upload">
      <input type="file" name="" id="">上传文件
    </a>

    <p>样式二：使用label标签</p>
    <div>
      <label for="label-input" class="label">label上传文件</label>
      <input type="file" id="label-input" name="file" multiple>
    </div>

    <p>样式三：调用click方法</p>
    <div class="click" @click="handleClick">
      click 上传
      <input type="file" class="click-input" ref="clickInput">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    handleClick () {
      this.$refs.clickInput.click()
    }
  }
}
</script>

<style scoped>
.con p{
  margin-top: 10px;
  margin-bottom: 5px;
}

.a-upload {
  padding: 4px 10px;
  height: 30px;
  line-height: 20px;
  position: relative;
  cursor: pointer;
  color: #888;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  *display: inline;
  *zoom: 1
}

.a-upload  input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  cursor: pointer
}

.a-upload:hover {
  color: #444;
  background: #eee;
  border-color: #ccc;
  text-decoration: none
}


.label, .click{
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  display: inline;
  cursor: pointer;
}
.label:hover, .click:hover{
  color: #444;
  background: #eee;
  border-color: #ccc;
  text-decoration: none
}
#label-input, .click-input{
  display: none;
}


</style>
