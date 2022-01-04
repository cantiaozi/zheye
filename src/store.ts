import axios, { AxiosRequestConfig } from 'axios'
import { Commit, createStore } from 'vuex'

export interface ImageProps {
  _id?: string,
  url?: string,
  createdAt?: string,
  fitUrl?: string
}
export interface UserProps {
  isLogin: boolean,
  _id?: string,
  nickName?: string,
  column?: string,
  email?: string,
  description?: string,
  avatar?: ImageProps
}

export interface ErrorProps {
  status: boolean,
  message?: string,
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
  _id?: string;
  title: string;
  excerpt?: string;
  content: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
}
export interface GlobalDataProps {
  user: UserProps
  columns: ColumnProps[]
  posts: PostProps[]
  isLoading: boolean,
  token: string,
  error: ErrorProps
}
export interface ResponseType<T> {
  code: number,
  msg: string,
  data: T
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const response = await axios.get(url)
  commit(mutationName, response.data.data)
  return response.data
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const response = await axios.post(url, payload)
  commit(mutationName, response.data)
  return response
}
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }) => {
  const response = await axios(url, config)
  commit(mutationName, response.data)
  return response
}

const store = createStore<GlobalDataProps>({
  state: {
    user: {
      isLogin: false,
      nickName: 'liuyong',
      _id: '',
      column: ''
    },
    columns: [],
    posts: [],
    isLoading: false,
    token: localStorage.getItem('token') || '',
    error: {
      status: false
    }
  },
  mutations: {
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    updatePost (state, newPost) {
      state.posts = state.posts.map(post => {
        if (post._id === newPost.data._id) {
          return newPost.data
        } else {
          return post
        }
      })
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
    fetchPost (state, rawData) {
      state.posts = [rawData]
    },
    setLoading (state, status) {
      state.isLoading = status
    },
    login (state, rawData) {
      const { token } = rawData.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      state.token = token
    },
    logout (state) {
      localStorage.removeItem('token')
      state.token = ''
      state.user = {
        isLogin: false
      }
      delete axios.defaults.headers.common.Authorization
    },
    fetchCurrentUser (state, rawData) {
      state.user = {
        isLogin: true,
        ...rawData
      }
    },
    setError (state, rawData: ErrorProps) {
      state.error = rawData
    }
  },
  actions: {
    fetchColumns ({ commit }) {
      return getAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) {
      return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ commit }, cid) {
      return getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    login ({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    },
    createPost ({ commit }, payload) {
      return postAndCommit('/posts', 'createPost', commit, payload)
    },
    updatePost ({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    fetchCurrentUser ({ commit }) {
      return getAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    loginAndFetch ({ dispatch }, payload) {
      return dispatch('login', payload).then(() => {
        return dispatch('fetchCurrentUser')
      })
    },
    fetchPost ({ commit }, id) {
      return getAndCommit(`/posts/${id}`, 'fetchPost', commit)
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
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.find((post) => {
        return post._id === id
      })
    }
  }
})
export default store
