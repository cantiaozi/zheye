<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link class="navbar-brand" to="/">者也专栏</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item">
        <router-link class="btn btn-outline-light my-2" to="/login">登陆</router-link>
      </li>
      <li class="list-inline-item">
        <router-link class="btn btn-outline-light my-2" to="/login">注册</router-link>
      </li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <dropdown :title="`你好 ${user.name}`">
        <dropdown-item><a href="#" class="dropdown-item">新建文章</a></dropdown-item>
         <dropdown-item disabled><a href="#" class="dropdown-item">编辑资料</a></dropdown-item>
         <dropdown-item><a href="#" class="dropdown-item">退出登陆</a></dropdown-item>
      </dropdown>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'

export interface UserProps {
  isLogin: boolean,
  id?: number,
  name?: string
}

export default defineComponent({
  name: 'GlobalHeader',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  components: {
    Dropdown,
    DropdownItem
  }
  // setup() {

  // }
})
</script>

<style>

</style>
