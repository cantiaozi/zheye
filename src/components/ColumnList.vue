<template>
  <ul v-for="item in list" :key="item.id">
    <li>
      <img :src="item.avatar" />
      <h5>{{item.title}}</h5>
      <p>{{item.description}}</p>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export interface ListData {
  id: number
  title: string
  avatar: string
  description: string
}

export default defineComponent({
  name: 'ColumnList',
  props: {
    list: {
      type: Array as PropType<ListData[]>,
      required: true
    }
  }
})
</script>

<style></style>
