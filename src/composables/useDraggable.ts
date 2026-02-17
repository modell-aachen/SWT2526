import type { DraggableEvents } from '@/types/DraggableEvents'
import { ref, onUnmounted } from 'vue'
import { useZoomStore } from '@/stores/zoom/zoom'

const DRAG_THRESHOLD = 3 // pixels before drag is considered started

export function useDraggable(emit: DraggableEvents) {
  const zoomStore = useZoomStore()
  const isDragging = ref(false)
  let hasDragStarted = false
  let initialMouseX = 0
  let initialMouseY = 0
  let lastMouseX = 0
  let lastMouseY = 0

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return

    // Check if we've exceeded the drag threshold
    if (!hasDragStarted) {
      const distanceX = Math.abs(e.clientX - initialMouseX)
      const distanceY = Math.abs(e.clientY - initialMouseY)

      if (distanceX >= DRAG_THRESHOLD || distanceY >= DRAG_THRESHOLD) {
        hasDragStarted = true
        emit('drag-start', e)
        lastMouseX = e.clientX
        lastMouseY = e.clientY
      }
      return
    }

    const deltaX = e.clientX - lastMouseX
    const deltaY = e.clientY - lastMouseY

    lastMouseX = e.clientX
    lastMouseY = e.clientY

    emit('drag', deltaX / zoomStore.zoom, deltaY / zoomStore.zoom, e)
  }

  const handleMouseUp = () => {
    if (isDragging.value) {
      isDragging.value = false
      if (hasDragStarted) {
        emit('drag-end')
      }
    }
    hasDragStarted = false
    // Reset cursor and user-select (Firefox fix)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const startDrag = (event: MouseEvent) => {
    emit('click', event)

    isDragging.value = true
    hasDragStarted = false
    initialMouseX = event.clientX
    initialMouseY = event.clientY
    lastMouseX = event.clientX
    lastMouseY = event.clientY

    // Prevent text selection during drag (Firefox fix)
    document.body.style.userSelect = 'none'

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
