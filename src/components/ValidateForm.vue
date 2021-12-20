<template>
  <div class="dropdown" ref="dropdownRef">
    <form class="validate-form-container">
      <slot name="default"></slot>
      <div class="submit-area" @click.prevent="submitForm">
        <slot name="submit">
          <button type="submit" class="btn btn-primary">提交</button>
        </slot>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt, { Emitter } from 'mitt'

type ValidateFunc = () => boolean;
type Events = {
  'form-item-created': ValidateFunc;
};
export const emitter: Emitter<Events> = mitt<Events>()
export default defineComponent({
  name: 'ValidateForm',
  emits: ['form-submit'],
  setup (props, context) {
    const funcArr: ValidateFunc[] = []
    const submitForm = () => {
      const validateResult = funcArr.map(validateFunc => {
        return validateFunc()
      }).every(result => {
        return result
      })
      context.emit('form-submit', validateResult)
    }
    const callback = (validateFunc: ValidateFunc): void => {
      funcArr.push(validateFunc)
    }
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      emitter.off('form-item-created')
    })
    return {
      submitForm
    }
  }
})
</script>

<style></style>
