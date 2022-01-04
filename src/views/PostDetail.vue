<template>
  <div class="post-detail-page">
    <Modal
      title="确认删除？"
      :visible="modalVisible"
      @modal-on-cancel="modalVisible = false"
      @modal-on-confirm="hideAndDelete"
    >
      <p>您确认要删除该文章吗？</p>
    </Modal>
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
      <img :src="currentImageUrl" alt="currentPost.title" class="rounded-lg img-fluid my-4" v-if="currentImageUrl">
      <h2 class="mb-4">{{currentPost.title}}</h2>
      <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
        <div class="col">
          <user-profile :user="currentPost.author" v-if="typeof currentPost.author === 'object'"></user-profile>
        </div>
        <span class="text-muted col text-right font-italic">发表于：{{currentPost.createdAt}}</span>
      </div>
      <div v-html="currentHTML"></div>
      <div v-if="showEditArea" class="btn-group mt-5">
        <router-link
          type="button"
          class="btn btn-success"
          :to="{name: 'create', query: { id: currentPost._id}}"
        >
          编辑
        </router-link>
        <button type="button" class="btn btn-danger" @click="modalVisible = true">删除</button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { GlobalDataProps, PostProps, ImageProps, UserProps, ResponseType } from '../store'
import UserProfile from '../components/UserProfile.vue'
import Modal from '../components/Modal.vue'
import createMessage from '@/components/createMessage'

export default defineComponent({
  name: 'post-detail',
  components: {
    UserProfile,
    Modal
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const router = useRouter()
    const currentId = route.params.id
    const md = new MarkdownIt()
    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })
    const currentPost = computed<PostProps>(() => store.getters.getCurrentPost(currentId))
    const currentHTML = computed(() => {
      if (currentPost.value && currentPost.value.content) {
        return md.render(currentPost.value.content)
      } else {
        return ''
      }
    })
    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })
    const showEditArea = computed(() => {
      const { user } = store.state
      if (currentPost.value.author && user.isLogin) {
        const postUser = currentPost.value.author as UserProps
        return user._id === postUser._id
      } else {
        return false
      }
    })
    const modalVisible = ref<boolean>(false)
    const hideAndDelete = () => {
      modalVisible.value = false
      store.dispatch('deletePost', currentId).then((rawData: ResponseType<PostProps>) => {
        createMessage('文章删除成功，2s后跳转', 'success', 2000)
        setTimeout(() => {
          router.push(`/column/${rawData.data.column}`)
        }, 2000)
      })
    }
    return {
      currentPost,
      currentImageUrl,
      currentHTML,
      showEditArea,
      modalVisible,
      hideAndDelete
    }
  }
})
</script>
