<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
      <slot name="loading" v-if="fileStatus === 'loading'">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <slot name="uploaded" v-else-if="fileStatus === 'success'" :uploadedData="uploadedData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <!-- <button class="btn btn-primary" @click.prevent="triggerUpload">
      <span v-if="fileStatus === 'loading'">正在上传...</span>
      <span v-else-if="fileStatus === 'success'">上传成功</span>
      <span v-else>点击上传</span>
    </button> -->
    <input
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    >
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref, watch } from 'vue'
import axios from 'axios'
export type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type BeforeUploadFunction = (file: File) => boolean
export default defineComponent({
  name: 'Uploader',
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<BeforeUploadFunction>
    },
    uploaded: {
      type: Object
    }
  },
  inheritAttrs: false,
  emits: ['file-uploaded', 'file-uploaded-error'],
  setup (props, context) {
    const uploadedData = ref(props.uploaded)
    const fileInput = ref<null | HTMLInputElement>(null)
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready')
    watch(() => props.uploaded, (newVal) => {
      if (newVal) {
        fileStatus.value = 'success'
        uploadedData.value = newVal
      }
    })
    const handleFileChange = () => {
      const target = fileInput.value as HTMLInputElement
      if (target.files) {
        if (props.beforeUpload) {
          const result = props.beforeUpload(target.files[0])
          if (!result) {
            return
          }
        }
        fileStatus.value = 'loading'
        const formData = new FormData()
        formData.append('file', target.files[0])
        axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          context.emit('file-uploaded', res.data)
          uploadedData.value = res.data
          fileStatus.value = 'success'
        }).catch((error) => {
          context.emit('file-uploaded-error', error)
          fileStatus.value = 'error'
        })
      }
    }
    return {
      fileInput,
      handleFileChange,
      triggerUpload,
      fileStatus,
      uploadedData
    }
  }
})
</script>

<style>

</style>
