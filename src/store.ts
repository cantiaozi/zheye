import { createStore } from 'vuex'
import { ColumnProps, PostProps, testData, testPosts } from './views/testData'

export interface UserProps {
  isLogin: boolean,
  id?: number,
  name?: string
}

export interface GlobalDataProps {
  user: UserProps
  column: ColumnProps[]
  list: PostProps[]
}

const store = createStore<GlobalDataProps>({
  state: {
    user: {
      isLogin: false,
      name: 'liuyong',
      id: 1
    },
    column: testData,
    list: testPosts
  },
  mutations: {
    login (state) {
      state.user.isLogin = true
    }
  },
  getters: {
    getColumnById (state) {
      return (id: number) : ColumnProps | undefined => {
        return state.column.find(item => {
          return item.id === id
        })
      }
    },
    getPostsByCId (state) {
      return (cid: number) : PostProps[] => {
        return state.list.filter(item => {
          return item.columnId === cid
        })
      }
    }
  }
})
export default store
