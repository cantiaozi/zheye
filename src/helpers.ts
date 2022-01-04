import { ColumnProps, UserProps } from './store'
export interface CheckCondition {
  size?: number,
  fileType?: string[]
}
type FileCheckError = 'fileType' | 'size' | null
export interface FileCheckResult {
  passed: boolean,
  error: FileCheckError
}
export default function beforeUploadCheck (file: File, checkItems: CheckCondition): FileCheckResult {
  const { type, size } = file
  const typeValidate = checkItems.fileType ? checkItems.fileType.includes(type) : true
  const sizeValidate = checkItems.size ? (size / (1024 * 1024) < checkItems.size) : true
  let error:FileCheckError = null
  if (!sizeValidate) {
    error = 'size'
  }
  if (!typeValidate) {
    error = 'fileType'
  }
  return {
    passed: typeValidate && sizeValidate,
    error
  }
}

export function addColumnAvatar (data: ColumnProps | UserProps): void {
  if (!data.avatar) {
    const parseCol = data as ColumnProps
    data.avatar = {
      fitUrl: require(parseCol.title ? '@/assets/column.jpg' : '@/assets/avatar.jpg')
    }
  }
}

interface TestProps {
  _id: string;
  name: string;
}
interface objectMaps<T> {
  [index: string]: T
}
const testData: TestProps[] = [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }]
export const arrToObj = <T extends {_id: string}>(arr: Array<T>) : objectMaps<T> => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as objectMaps<T>)
}
const arr = arrToObj(testData)
console.log('testData', arr)

export const objToArray = <T>(obj: objectMaps<T>): Array<T> => {
  return Object.keys(obj).map(key => {
    return obj[key]
  })
}
const obj = objToArray(arr)
console.log('testData2', obj)
