<template>
  <pre>{{route}}</pre>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
export default defineComponent({
  name: 'ColumnDetail',
  setup () {
    const route: RouteLocationNormalizedLoaded = useRoute()
    return {
      route
    }
  }
})
</script>

<style>

</style>
