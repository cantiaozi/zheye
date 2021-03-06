<template>
  <div class="validate-input-container pb-3">
    <input type="text"
      v-if="tag === 'input'"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      v-model="inputRef.val"
      @blur="validateInput"
      v-bind="$attrs"
    />
    <textarea type="text"
      v-else
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      v-model="inputRef.val"
      @blur="validateInput"
      v-bind="$attrs"
    />
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted, PropType, reactive } from 'vue'
import { emitter } from './ValidateForm.vue'
export interface InputRule {
  type: 'required' | 'email' | 'custom',
  message: string,
  validator?: () => boolean
}
type tagFlag = 'input' | 'textarea'
export default defineComponent({
  props: {
    rule: Array as PropType<InputRule[]>,
    modelValue: String,
    tag: {
      type: String as PropType<tagFlag>,
      default: 'input'
    }
  },
  inheritAttrs: false,
  setup (props, context) {
    const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    const inputRef = reactive({
      val: computed({
        get: () => {
          return props.modelValue || ''
        },
        set: (val) => {
          context.emit('update:modelValue', val)
        }
      }),
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
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              if (!passed) {
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
      validateInput
    }
  }
})
</script>

<style>

</style>
