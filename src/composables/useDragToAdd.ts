import { ref, onUnmounted } from 'vue'
import type { ShapeType } from '@/types/ShapeType'
import type { DragContext } from '@/types/DragContext'
import { useShapesStore } from '@/stores/shapes/shapes'

const SHAPE_SIZE = 100

export function useDragToAdd(): DragContext {
  const shapesStore = useShapesStore()

  const isDragging = ref(false)
  const draggedShapeType = ref<ShapeType | null>(null)
  const ghostPosition = ref({ x: 0, y: 0 })

  let canvasElement: HTMLElement | null = null

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging.value) return

    // Center ghost on cursor
    ghostPosition.value = {
      x: event.clientX - SHAPE_SIZE / 2,
      y: event.clientY - SHAPE_SIZE / 2,
    }
  }

  const handleMouseUp = (event: MouseEvent) => {
    if (!isDragging.value || !draggedShapeType.value) {
      cleanup()
      return
    }

    // Check if drop is over canvas
    if (canvasElement) {
      const canvasRect = canvasElement.getBoundingClientRect()
      const mouseX = event.clientX
      const mouseY = event.clientY

      const isOverCanvas =
        mouseX >= canvasRect.left &&
        mouseX <= canvasRect.right &&
        mouseY >= canvasRect.top &&
        mouseY <= canvasRect.bottom

      if (isOverCanvas) {
        // Calculate position relative to canvas (centered on cursor)
        const x =
          mouseX - canvasRect.left - SHAPE_SIZE / 2 + canvasElement.scrollLeft
        const y =
          mouseY - canvasRect.top - SHAPE_SIZE / 2 + canvasElement.scrollTop

        shapesStore.addShape(draggedShapeType.value, x, y)
      }
    }

    cleanup()
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isDragging.value) {
      cancelDrag()
    }
  }

  const cleanup = () => {
    isDragging.value = false
    draggedShapeType.value = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('keydown', handleKeyDown)
  }

  const startDrag = (type: ShapeType, event: MouseEvent) => {
    isDragging.value = true
    draggedShapeType.value = type

    // Center ghost on initial cursor position
    ghostPosition.value = {
      x: event.clientX - SHAPE_SIZE / 2,
      y: event.clientY - SHAPE_SIZE / 2,
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('keydown', handleKeyDown)
  }

  const endDrag = (event: MouseEvent, canvas: HTMLElement) => {
    canvasElement = canvas
    handleMouseUp(event)
  }

  const cancelDrag = () => {
    cleanup()
  }

  const setCanvasElement = (element: HTMLElement | null) => {
    canvasElement = element
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    isDragging,
    draggedShapeType,
    ghostPosition,
    startDrag,
    endDrag,
    cancelDrag,
    setCanvasElement,
  }
}
