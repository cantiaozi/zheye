<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar" :alt="column.title" class="rounded-circle border ">
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
import { computed, defineComponent } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { testData, testPosts } from './testData'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import PostList from '../components/PostList.vue'
export default defineComponent({
  name: 'ColumnDetail',
  components: {
    PostList
  },
  setup () {
    const route: RouteLocationNormalizedLoaded = useRoute()
    const store = useStore<GlobalDataProps>()
    const id = Number(route.params.id)
    const column = computed(() => {
      return store.getters.getColumnById(id)
    })
    const list = computed(() => {
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
