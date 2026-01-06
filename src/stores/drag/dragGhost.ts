import { defineStore } from 'pinia'
import type { ShapeType } from '@/types/ShapeType'
import { useShapesStore } from '@/stores/shapes/shapes'

const SHAPE_SIZE = 100

export const useDragStore = defineStore('drag', {
  state: () => ({
    isDragging: false,
    draggedShapeType: null as ShapeType | null,
    ghostPosition: { x: 0, y: 0 },
    canvasElement: null as HTMLElement | null,
  }),

  actions: {
    startDrag(type: ShapeType, event: MouseEvent) {
      this.isDragging = true
      this.draggedShapeType = type

      // Center ghost on initial cursor position
      this.ghostPosition = {
        x: event.clientX - SHAPE_SIZE / 2,
        y: event.clientY - SHAPE_SIZE / 2,
      }

      document.addEventListener('mousemove', this._handleMouseMove)
      document.addEventListener('mouseup', this._handleMouseUp)
      document.addEventListener('keydown', this._handleKeyDown)
    },

    cancelDrag() {
      this._cleanup()
    },

    setCanvasElement(element: HTMLElement | null) {
      this.canvasElement = element
    },

    _handleMouseMove(event: MouseEvent) {
      if (!this.isDragging) return

      this.ghostPosition = {
        x: event.clientX - SHAPE_SIZE / 2,
        y: event.clientY - SHAPE_SIZE / 2,
      }
    },

    _handleMouseUp(event: MouseEvent) {
      if (!this.isDragging || !this.draggedShapeType) {
        this._cleanup()
        return
      }

      // Check if drop is over canvas
      if (this.canvasElement) {
        const canvasRect = this.canvasElement.getBoundingClientRect()
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
            mouseX -
            canvasRect.left -
            SHAPE_SIZE / 2 +
            this.canvasElement.scrollLeft
          const y =
            mouseY -
            canvasRect.top -
            SHAPE_SIZE / 2 +
            this.canvasElement.scrollTop

          const shapesStore = useShapesStore()
          shapesStore.addShape(this.draggedShapeType, x, y)
        }
      }

      this._cleanup()
    },

    _handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && this.isDragging) {
        this.cancelDrag()
      }
    },

    _cleanup() {
      this.isDragging = false
      this.draggedShapeType = null
      document.removeEventListener('mousemove', this._handleMouseMove)
      document.removeEventListener('mouseup', this._handleMouseUp)
      document.removeEventListener('keydown', this._handleKeyDown)
    },
  },
})
