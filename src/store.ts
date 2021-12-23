import axios from 'axios'
import { createStore } from 'vuex'

export interface UserProps {
  isLogin: boolean,
  id?: number,
  name?: string,
  columnId?: number
}

export interface ImageProps {
  _id?: string,
  url?: string,
  createdAt?: string
}

export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
  author: string,
  createdAt: string
}
export interface PostProps {
  _id: string;
  title: string;
  excerpt?: string;
  content: string;
  image?: ImageProps;
  createdAt: string;
  column: string;
}
export interface GlobalDataProps {
  user: UserProps
  columns: ColumnProps[]
  posts: PostProps[]
}

const store = createStore<GlobalDataProps>({
  state: {
    user: {
      isLogin: true,
      name: 'liuyong',
      id: 1,
      columnId: 1
    },
    columns: [],
    posts: []
  },
  mutations: {
    login (state) {
      state.user.isLogin = true
    },
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      state.columns = rawData
    },
    fetchColumn (state, rawData) {
      state.columns = [rawData]
    },
    fetchPosts (state, rawData) {
      state.posts = rawData
    }
  },
  actions: {
    fetchColumns (context) {
      axios.get('/columns?currentPage=1&pageSize=5').then(response => {
        context.commit('fetchColumns', response.data.data.list)
      })
    },
    fetchColumn (context, cid) {
      axios.get(`/columns/${cid}`).then(response => {
        context.commit('fetchColumn', response.data.data)
      })
    },
    fetchPosts (context, cid) {
      axios.get(`/columns/${cid}/posts`).then(response => {
        context.commit('fetchPosts', response.data.data.list)
      })
    }
  },
  getters: {
    getColumnById (state) {
      return (id: string) : ColumnProps | undefined => {
        return state.columns.find(item => {
          return item._id === id
        })
      }
    },
    getPostsByCId (state) {
      return (cid: string) : PostProps[] => {
        return state.posts.filter(item => {
          return item.column === cid
        })
      }
    }
  }
})
export default store
