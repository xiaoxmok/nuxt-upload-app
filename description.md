[TOC]


## 一、文件上传方式

前端网页文件上传一般使用 `<input type="file" />`来实现。

### 1、属性

属性 | 描述
---|---
accept | 用于规定文件上传控件中期望的文件类型
multiple | 布尔值。 是否允许多个值
files |	FileList 列出了已选择的文件
capture | 文件上传控件中媒体拍摄的方式

#### files: 获取已选择文件的信息

每个file包含以下信息：
```json
{
    lastModified: 1581580706142
    lastModifiedDate: Thu Feb 13 2020 15:58:26 GMT+0800 (中国标准时间)
    name: "WX20200213-155823@2x.png"
    size: 662137
    type: "image/png"
    webkitRelativePath: ""
}
```
- name: 文件名
- lastModified：文件最后一次修改的时间的时间戳
- lastModifiedDate：文件最后一次修改的日期和时间的Date对象。
- size: 以字节数为单位的文件大小
- type: 文件[MIME类型](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types)


#### accept: 限制可接受的文件类型
- 字符串 audio/*， 表示“任何音频文件”。
- 字符串 video/*，表示 “任何视频文件”。
- 字符串 image/*，表示 “任何图片文件”。
- accept="image/png" 或 accept=".png" — 接受 PNG 文件。
- accept="image/png, image/jpeg" 或 accept=".png, .jpg, .jpeg" — 接受 PNG 或 JPEG 文件。
- accept="image/*" — 接受带有一个 image/* MIME 类型的任何文件。（许多移动设备也允许用户在使用它时用摄像头拍照。）
- accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" — 接受 MS Word 文档之类的任何文件。

```
<input type="file" accept="image/*,.pdf">
```


#### multiple：允许多选

#### capture: 文件上传控件中媒体拍摄的方式
`capture` 属性是一个字符串，如果 `accept` 属性指出了 `input` 是图片或者视频类型，则它指定了使用哪个摄像头去这些数据。值 user 表示应该使用前置摄像头和/或麦克风。值 environment 表示应该使用后置摄像头和/或麦克风。如果缺少此属性，则 user agent 可以自由决定做什么。如果请求的前置模式不可用，则用户代理可能退回到其首选的默认模式。


### 2、http请求消息

**multipart/form-data**

`multipart/form-data` 可用于HTML表单从浏览器发送信息给服务器。作为多部分文档格式，它由边界线（一个由'--'开始的字符串）划分出的不同部分组成。每一部分有自己的实体，以及自己的 HTTP 请求头，`Content-Disposition`和 `Content-Type` 用于文件上传领域。

请求头：

```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundarySER7d8AAHzzdTdCz
```
请求体：

```
------WebKitFormBoundarySER7d8AAHzzdTdCz
Content-Disposition: form-data; name="file"; filename="29_Letter A-F.mp3"
Content-Type: audio/mpeg


------WebKitFormBoundarySER7d8AAHzzdTdCz--
```
Content-Disposition: form-data 为固定值，表示一个表单元素，name 表示表单元素的名称，filename 为文件名。

Content-Type：表示当前的内容的 MIME 类型，是图片还是文本还是二进制数据。

### 3、样式美化
- 方法一：把input按钮的透明度opacity设置为0，然后外层用div包裹，然后美化外层div；
- 方法二：隐藏input标签，通过点击外层已美化的div来调用input的click方法；
- 方法三：通过label的方式，label的for属性和input的id一致，则点击label会触发input的click，只要美化label，隐藏input即可。


## 二、经典form上传方式

```html
<form action="/upload" method="POST" enctype="multipart/form-data">
    <input type="file" name="testfile">
    <input type="submit" value="提交">
</form>
```


## 三、formData方式 

1. 监听input(type='file')的onchange事件，或者直接通过DOM操作，获取files属性数据；
1. new FormData()；
1. 将file append进FormData中；
1. xhr实现上传；

```vue
<template>
  <div class="container">
    <div>
      选择文件:<input type="file" ref="input" @change="handleChange"/>
        <button @click="uploadFile">上 传</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      postFiles: null
    }
  },
  methods: {
    handleChange(e) {
      const files = e.target.files

      if (!files) {
        return
      }
      this.postFiles = Array.prototype.slice.call(files)
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
          }
        }
       })
      this.$Message.success('成功')
    }
  }
}
</script>


```



## 四、拖拽上传
>原理：通过设置拖拽投放区，设置监听拖拽事件，然后通过`e.dataTransfer.files`获取拖拽的文件，再进行文件上传。

**拖拽事件**

投放区：
1. dragenter:拖动目标且鼠标进入投放区时触发
1. dragover：拖动目标且鼠标移动在投放区时触发（执行多次）
1. dragleave：拖动对象且离开投放区时触发
1. drop：拖动对象且在投放区放开鼠标时触发，要先在dragover上设置禁止默认事件，才会有触发

**获取拖拽数据**
dataTransfer的常用属性：

1. effectAllowed：设置拖拽时应带有的样式类型
1. dropEffect：设置拖拽元素被放下时的样式
1. files：内含一系列文件信息，常用于将文件从桌面拖向浏览器






## 五、剪贴板上传
- dom开启`contenteditable`
- 监听`paste`事件，从`event.clipboardData || window.clipboardData`获得数据
- 将数据转换为文件`getAsFile()`
- 上传文件

**clipboardData介绍**
属性 | 类型 | 说明
---|---|---
dropEffect | String | 默认是 none
effectAllowed|	String|	默认是 uninitialized
files|	FileList|	粘贴操作为空List
items|	DataTransferItemList|	剪切板中的各项数据
types|	Array|	剪切板中的数据类型 该属性在Safari下比较混乱

**items介绍**

items的DataTransferItem有两个属性kind和type
属性 | 说明
---|---
kind | 一般为`string`或者`file`
type | 具体的数据类型，例如具体是哪种类型字符串或者哪种类型的文件，即MIME-Type

方法|	参数|	说明
---|---|---
getAsFile|	空|	如果kind是file，可以用该方法获取到文件
getAsString|	回调函数|	如果kind是string，可以用该方法获取到字符串，字符串需要用回调函数得到，回调函数的第一个参数就是剪切板中的字符串

缺点：mac中多文件时，只会把最后一个复制最后一个文件；

## 六、大文件分片上传
**原理**：
需要客户端和服务端的配合

- 客户端将文件进行分段切片，按规定的标识，传给服务端；
- 服务端分别保存各段分片；
- 当客户端所有的分片都上传完毕后，再发一个合并文件的请求；
- 服务端根据文件标识，对各段分片进行顺序合并；
- 删除已合并的分片；

![](https://raw.githubusercontent.com/xiaoxmok/PicGo/master/img/%E6%96%87%E4%BB%B6%E5%88%87%E7%89%87.png)

客户端切片：由于file文件继承了`Blob`的功能，`Blob`是二进制大数据对象，则可以通过`slice`对数据进行截取；

node端的合并文件可以用`stream.pipe`实现；

[七牛分片上传文档](https://developer.qiniu.com/kodo/manual/1650/chunked-upload)


**问题**：如果全部同时发起100个(甚至更多)上传请求，chrome浏览器表现还不错，但其它浏览器会挂掉。

解决：需要通过并发控制，例如每次只发起10个上传请求，每当有上传成功的，再发起新的请求，直接全部上传成功为止。

具体实现参照声创批量上传功能


## 七、大文件断点续传
**原理：**
在分片上传的基础上，检测哪些分片是已上传成功过的，从而不再重新上传。

记录分片信息：
1. 可以存在本址localstorage;
2. 或者通过服务端从服务端获取已上传的分片信息；

![](https://raw.githubusercontent.com/xiaoxmok/PicGo/master/img/%E6%96%AD%E7%82%B9%E7%BB%AD%E4%BC%A0.png)


