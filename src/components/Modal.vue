<template>
  <teleport to="#modal">
    <div class="modal d-block" tabindex="-1" v-if="visible">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{title}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" @click="onClose">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal"  @click="onClose">取消</button>
            <button type="button" class="btn btn-primary"  @click="onConfirm">确定</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { defineComponent } from 'vue'
import useCreateDom from '../hooks/useCreateDom'
export default defineComponent({
  name: 'Modal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String
  },
  emits: ['modal-on-cancel', 'modal-on-confirm'],
  setup (props, context) {
    useCreateDom('modal')
    const onClose = () => {
      context.emit('modal-on-cancel')
    }
    const onConfirm = () => {
      context.emit('modal-on-confirm')
    }
    return {
      onClose,
      onConfirm
    }
  }
})
</script>

<style>

</style>
