import Qs from 'qs'
import { Message } from 'view-design'

export default function ({ $axios, redirect }) {
  $axios.onRequest((config) => {
    if (!config.params) {
      config.params = Object.create(null)
    }
    if (!config.data) {
      config.data = Object.create(null)
    }
    // if (config.method === 'post') {
    //   config.transformRequest = [data => Qs.stringify(data)]
    // }
    return config
  })

  $axios.onResponse((result) => {
    const { status, msg } = result.data || {}
    if (status !== 0) {
      if (status === 1003) {
        redirect('./login')
      }
      if (!process.server) {
        Message.error(`错误: ${msg}`)
      }
    }
    return result
  })

  $axios.onError((error) => {
    const message = (error && error.message) || ''
    if (message.includes('timeout')) {
      Message.error('请求超时')
    }
    if (message === 'Network Error') {
      Message.error('网络异常')
    }
  })
}
