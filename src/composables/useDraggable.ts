import type { DraggableEvents } from '@/types/DraggableEvents'
import { ref, onUnmounted } from 'vue'

export function useDraggable(emit: DraggableEvents) {
  const isDragging = ref(false)
  let lastMouseX = 0
  let lastMouseY = 0

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return

    const deltaX = e.clientX - lastMouseX
    const deltaY = e.clientY - lastMouseY

    lastMouseX = e.clientX
    lastMouseY = e.clientY

    emit('drag', deltaX, deltaY)
  }

  const handleMouseUp = () => {
    if (isDragging.value) {
      isDragging.value = false
      emit('dragEnd')
    }
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const startDrag = (event: MouseEvent) => {
    emit('click', event)

    isDragging.value = true
    lastMouseX = event.clientX
    lastMouseY = event.clientY

    emit('dragStart', event)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return {
    isDragging,
    startDrag,
  }
}
