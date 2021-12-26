<template>
  <teleport to="#message">
    <div class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-2"
      :class="classObject" v-if="isVisible">
      <span>{{message}}</span>
      <button type="button" class="close" aria-label="Close" @click.prevent="hide">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </teleport>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref } from 'vue'
import useCreateDom from '../hooks/useCreateDom'

type typeString = 'success' | 'error' | 'default'
export default defineComponent({
  name: 'Message',
  props: {
    message: String,
    type: {
      type: String as PropType<typeString>,
      default: 'default'
    }
  },
  emits: ['close-message'],
  setup (props, { emit }) {
    useCreateDom('message')
    const isVisible = ref<boolean>(true)
    const classObject = {
      'alert-success': props.type === 'success',
      'alert-danger': props.type === 'error',
      'alert-primary': props.type === 'default'
    }
    const hide = () => {
      isVisible.value = false
      emit('close-message')
    }
    return {
      isVisible,
      classObject,
      hide
    }
  }
})
</script>

<style>

</style>
