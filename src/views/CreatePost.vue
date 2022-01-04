<template>
  <div class="create-post-page">
    <h4>{{isEditMode ? '编辑文章' : '新建文章'}}</h4>
    <uploader
      action="/upload"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
      :beforeUpload="beforeUpload"
      :uploaded="uploadData"
      @file-uploaded="onFileUploaded"
    >
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url">
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules" v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          tag="textarea"
          type="password"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">{{isEditMode ? '编辑' : '发布'}}</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import ValidateInput, { InputRule } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import Uploader from '../components/Uploader.vue'
import createMessage from '../components/createMessage'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store'
import beforeUploadCheck, { CheckCondition } from '../helpers'

export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup () {
    const route = useRoute()
    const isEditMode = !!route.query.id
    const uploadData = ref()
    let imageId = ''
    const titleVal = ref('')
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    const titleRules: InputRule[] = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: InputRule[] = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            // createdAt: new Date().toString(),
            column: column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }
          const methodName = isEditMode ? 'updatePost' : 'createPost'
          const updatePost = {
            payload: newPost,
            id: route.query.id
          }
          store.dispatch(methodName, isEditMode ? updatePost : newPost).then(() => {
            createMessage('发表成功，2秒后跳转到文章', 'success', 2000)
            router.push(`/column/${column}`)
          })
        }
      }
    }
    const beforeUpload = (file: File): boolean => {
      const checkCondition: CheckCondition = {
        fileType: ['image/png'],
        size: 0.1
      }
      const { passed, error } = beforeUploadCheck(file, checkCondition)
      if (error === 'fileType') {
        createMessage('上传图片只能是PNG格式', 'error')
      } else if (error === 'size') {
        createMessage('上传图片不能超过1M', 'error')
      }
      return passed
    }
    const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
      imageId = rawData.data._id!
      createMessage(`上传图片ID ${imageId}`, 'success')
    }
    if (isEditMode) {
      store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
        const currentPost = rawData.data
        if (currentPost.image) {
          uploadData.value = {
            data: currentPost.image
          }
        }
        titleVal.value = currentPost.title
        contentVal.value = currentPost.content
      })
    }
    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      onFormSubmit,
      beforeUpload,
      onFileUploaded,
      uploadData,
      isEditMode
    }
  }
})
</script>
<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
