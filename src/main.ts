import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'

axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use((config) => {
  store.commit('setLoading', true)
  config.params = {
    ...config.params,
    icode: '8D22E4B7CADF31AE'
  }
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', '8D22E4B7CADF31AE')
  } else {
  // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: '8D22E4B7CADF31AE' }
  }
  store.commit('setError', {
    status: false,
    message: ''
  })
  return config
})
axios.interceptors.response.use((config) => {
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 2000)
  return config
}, (error) => {
  console.log(error.response)
  store.commit('setError', {
    status: true,
    message: error.response.data.error
  })
  store.commit('setLoading', false)
  return Promise.reject(error.response)
})

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
