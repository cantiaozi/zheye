import axios, { AxiosRequestConfig } from 'axios'
import { Commit, createStore } from 'vuex'
import { arrToObj, objToArray } from './helpers'

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

interface listProps<T> {
  [id: string]: T
}
export interface GlobalDataProps {
  user: UserProps
  columns: listProps<ColumnProps>
  posts: listProps<PostProps>
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
  return response.data
}

const store = createStore<GlobalDataProps>({
  state: {
    user: {
      isLogin: false,
      nickName: 'liuyong',
      _id: '',
      column: ''
    },
    columns: {},
    posts: {},
    isLoading: false,
    token: localStorage.getItem('token') || '',
    error: {
      status: false
    }
  },
  mutations: {
    createPost (state, newPost) {
      state.posts[newPost._id] = newPost
    },
    updatePost (state, newPost) {
      state.posts[newPost.data._id] = newPost
    },
    deletePost (state, rawData) {
      delete state.posts[rawData.data._id]
    },
    fetchColumns (state, rawData) {
      state.columns = arrToObj(rawData.list)
    },
    fetchColumn (state, rawData) {
      state.columns[rawData._id] = rawData
    },
    fetchPosts (state, rawData) {
      state.posts = arrToObj<Required<PostProps>>(rawData.list)
    },
    fetchPost (state, rawData) {
      state.posts[rawData._id] = rawData
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
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, {
        method: 'delete'
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
        return state.columns[id]
      }
    },
    getPostsByCId (state) {
      return (cid: string) : PostProps[] => {
        return objToArray(state.posts).filter(item => {
          return item.column === cid
        })
      }
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts[id]
    },
    getColumnArray: (state) => {
      return objToArray(state.columns)
    }
  }
})
export default store
