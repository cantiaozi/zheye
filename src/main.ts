import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory, Router } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ColumnDetail from './views/ColumnDetail.vue'

const history = createWebHistory()
const router: Router = createRouter({
  history,
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'column',
      path: '/column/:id',
      component: ColumnDetail
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
