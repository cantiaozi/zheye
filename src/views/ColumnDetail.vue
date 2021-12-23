<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar && column.avatar.url" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.description}}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps, ColumnProps, PostProps } from '../store'
import PostList from '../components/PostList.vue'
export default defineComponent({
  name: 'ColumnDetail',
  components: {
    PostList
  },
  setup () {
    const route: RouteLocationNormalizedLoaded = useRoute()
    const store = useStore<GlobalDataProps>()
    const id = route.params.id
    const column = computed<ColumnProps>(() => {
      return store.getters.getColumnById(id)
    })
    onMounted(() => {
      store.dispatch('fetchColumn', id)
      store.dispatch('fetchPosts', id)
    })
    const list = computed<PostProps>(() => {
      return store.getters.getPostsByCId(id)
    })
    return {
      column,
      list
    }
  }
})
</script>

<style>

</style>
