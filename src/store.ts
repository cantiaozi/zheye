import { createStore } from 'vuex'
import { ColumnProps, PostProps, testData, testPosts } from './views/testData'

export interface UserProps {
  isLogin: boolean,
  id?: number,
  name?: string,
  columnId?: number
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
    columns: testData,
    posts: testPosts
  },
  mutations: {
    login (state) {
      state.user.isLogin = true
    },
    createPost (state, newPost) {
      state.posts.push(newPost)
    }
  },
  getters: {
    getColumnById (state) {
      return (id: number) : ColumnProps | undefined => {
        return state.columns.find(item => {
          return item.id === id
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
