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
import { defineComponent } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { testData, testPosts } from './testData'
import PostList from '../components/PostList.vue'
export default defineComponent({
  name: 'ColumnDetail',
  components: {
    PostList
  },
  setup () {
    const route: RouteLocationNormalizedLoaded = useRoute()
    const id = Number(route.params.id)
    const column = testData.find(item => { return item.id === id })
    const list = testPosts.filter(item => {
      return item.columnId === id
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
