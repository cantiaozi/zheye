import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'

axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    icode: '8D22E4B7CADF31AE'
  }
  return config
})
axios.get('/columns?currentPage=1&pageSize=5').then(res => {
  console.log(res)
})

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
