import axios from 'axios'
import { Commit, createStore } from 'vuex'

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
  isLoading: boolean
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const response = await axios.get(url)
  commit(mutationName, response.data.data)
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
    posts: [],
    isLoading: false
  },
  mutations: {
    login (state) {
      state.user.isLogin = true
    },
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      state.columns = rawData.list
    },
    fetchColumn (state, rawData) {
      state.columns = [rawData]
    },
    fetchPosts (state, rawData) {
      state.posts = rawData.list
    },
    setLoading (state, status) {
      state.isLoading = status
    }
  },
  actions: {
    fetchColumns ({ commit }) {
      getAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) {
      getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ commit }, cid) {
      getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
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
