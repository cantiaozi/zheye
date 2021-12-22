import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory, Router } from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'

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
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost
    }
  ]
})
router.beforeEach((to, from, next) => {
  console.log('to from', to, from)
  if (to.path !== '/login' && !store.state.user.isLogin) {
    next('/login')
  } else {
    next()
  }
})

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
