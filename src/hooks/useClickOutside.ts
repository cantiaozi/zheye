import { ref, onMounted, Ref, onUnmounted } from 'vue'
export default (elementRef: Ref<null | HTMLElement>): Ref<boolean> => {
  const isClickOutside = ref(false)
  const clickHandler = (e: MouseEvent) => {
    if (elementRef.value) {
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
    }
  }
  onMounted(() => {
    document.addEventListener('click', clickHandler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', clickHandler)
  })

  return isClickOutside
}
