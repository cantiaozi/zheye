import axios from 'axios'
import { createStore } from 'vuex'
import { testPosts } from './views/testData'

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
}
export interface PostProps {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  columnId: number;
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
    posts: testPosts
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
    }
  },
  actions: {
    fetchColumns (context) {
      axios.get('/columns?currentPage=1&pageSize=5').then(response => {
        context.commit('fetchColumns', response.data.data.list)
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
      return (cid: number) : PostProps[] => {
        return state.posts.filter(item => {
          return item.columnId === cid
        })
      }
    }
  }
})
export default store
