<template>
  <div class="container">
    <global-header :user="user" />
    <!-- <Message v-if="error.status" type="error" :message="error.message"></Message> -->
    <Loader text="努力加载中..." v-if="isLoading"/>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2020 者也专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css'
import { computed, defineComponent, onMounted, watch } from 'vue'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from './components/Loader.vue'
import createMessage from './components/createMessage'
import { useStore } from 'vuex'
import { GlobalDataProps } from './store'
import axios from 'axios'

export default defineComponent({
  name: 'App',
  components: {
    // ColumnList,
    GlobalHeader,
    Loader
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const user = computed(() => {
      return store.state.user
    })
    const token = computed(() => {
      return store.state.token
    })
    const error = computed(() => {
      return store.state.error
    })
    onMounted(() => {
      if (token.value && !store.state.user.isLogin) {
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
        store.dispatch('fetchCurrentUser')
      }
    })
    const isLoading = computed(() => {
      return store.state.isLoading
    })
    watch(() => {
      return error.value.status
    }, (newVal) => {
      if (newVal && error.value.message) {
        createMessage(error.value.message, 'error')
      }
    })
    return {
      user,
      isLoading,
      error
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
