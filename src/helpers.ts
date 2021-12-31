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
