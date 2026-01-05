import type { Ref } from 'vue'
import type { ShapeType } from './ShapeType'

export interface DragContext {
  isDragging: Ref<boolean>
  draggedShapeType: Ref<ShapeType | null>
  ghostPosition: Ref<{ x: number; y: number }>
  startDrag: (type: ShapeType, event: MouseEvent) => void
  endDrag: (event: MouseEvent, canvasElement: HTMLElement) => void
  cancelDrag: () => void
  setCanvasElement: (element: HTMLElement | null) => void
}

export const DRAG_CONTEXT_KEY = Symbol('dragContext')
