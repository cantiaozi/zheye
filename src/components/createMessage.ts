import { createApp } from 'vue'
import Message from './Message.vue'

export type MessageType = 'success' | 'error' | 'default'
export default (message: string, type: MessageType, timeout = 2000): void => {
  const MessageInstance = createApp(Message, {
    message,
    type
  })
  const node = document.createElement('div')
  document.body.appendChild(node)
  MessageInstance.mount(node)
  setTimeout(() => {
    MessageInstance.unmount()
    document.body.removeChild(node)
  }, timeout)
}
