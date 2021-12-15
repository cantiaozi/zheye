<template>
  <div class="validate-input-container pb-3">
    <input type="text"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      v-model="inputRef.val"
      @blur="validateInput"
      @input="inputChange"
      v-bind="$attrs"
    >
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, PropType, reactive } from 'vue'
import { emitter } from './ValidateForm.vue'
export interface InputRule {
  type: 'required' | 'email',
  message: string
}
export default defineComponent({
  props: {
    rule: Array as PropType<InputRule[]>,
    modelValue: String
  },
  inheritAttrs: false,
  setup (props, context) {
    const inputChange = (e: KeyboardEvent) => {
      const val = (e.target as HTMLInputElement).value
      context.emit('update:modelValue', val)
    }
    const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    const inputRef = reactive({
      val: props.modelValue || '',
      error: false,
      message: ''
    })
    const validateInput = () => {
      if (props.rule) {
        const rulePassed = props.rule.every((rule) => {
          let passed = true
          switch (rule.type) {
            case 'required':
              if (inputRef.val.trim() === '') {
                passed = false
                inputRef.error = false
                inputRef.message = rule.message
              }
              break
            case 'email':
              if (!emailReg.test(inputRef.val)) {
                passed = false
                inputRef.error = false
                inputRef.message = rule.message
              }
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !rulePassed
        return rulePassed
      } else {
        return true
      }
    }
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
    })
    return {
      inputRef,
      validateInput,
      inputChange
    }
  }
})
</script>

<style>

</style>
