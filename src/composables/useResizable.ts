import { ref, onUnmounted } from 'vue'
import type { ResizeEvents } from '@/types/ResizeEvents'

export function useResizable(emit: ResizeEvents) {
  const isResizing = ref(false)
  let resizeHandle = ''
  let lastMouseX = 0
  let lastMouseY = 0

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing.value) return

    const deltaX = e.clientX - lastMouseX
    const deltaY = e.clientY - lastMouseY

    lastMouseX = e.clientX
    lastMouseY = e.clientY

    emit('resize', resizeHandle, deltaX, deltaY)
  }

  const handleResizeEnd = () => {
    if (isResizing.value) {
      isResizing.value = false
      emit('resize-end')
    }
    document.removeEventListener('mousemove', handleResizeMove)
    document.removeEventListener('mouseup', handleResizeEnd)
  }

  const startResize = (position: string, event: MouseEvent) => {
    isResizing.value = true
    resizeHandle = position
    lastMouseX = event.clientX
    lastMouseY = event.clientY

    emit('resize-start', position, event)

    document.addEventListener('mousemove', handleResizeMove)
    document.addEventListener('mouseup', handleResizeEnd)
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleResizeMove)
    document.removeEventListener('mouseup', handleResizeEnd)
  })

  return {
    isResizing,
    startResize,
  }
}
