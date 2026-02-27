import { ref } from 'vue'
import { useElementsStore } from '@/stores/elements/elements'
import { calculateSnapResult } from '@/utils/snapUtils'
import { SNAP_THRESHOLD } from '@/types/snapping'
import type { SnapLine } from '@/types/snapping'

/**
 * Handles element drag operations with snap-to-element support.
 * Manages snap lines state and multi-selection movement.
 */
export function useElementDrag() {
  const elementsStore = useElementsStore()
  const activeSnapLines = ref<SnapLine[]>([])

  const handleDrag = (
    id: string,
    deltaX: number,
    deltaY: number,
    e?: MouseEvent
  ) => {
    const draggedElement = elementsStore.elements.find((el) => el.id === id)
    if (!draggedElement) return

    const newX = draggedElement.x + deltaX
    const newY = draggedElement.y + deltaY
    const hypotheticalElement = { ...draggedElement, x: newX, y: newY }

    const isShiftHeld = e?.shiftKey ?? false

    // Snap only for single-element drag without Shift
    if (elementsStore.selectedElementIds.length === 1 && !isShiftHeld) {
      const snapResult = calculateSnapResult(
        hypotheticalElement,
        elementsStore.topLevelElements,
        SNAP_THRESHOLD
      )

      activeSnapLines.value = snapResult.snapLines

      const adjustedDeltaX = snapResult.x - draggedElement.x
      const adjustedDeltaY = snapResult.y - draggedElement.y
      elementsStore.updateElementPosition(id, adjustedDeltaX, adjustedDeltaY)
    } else {
      // Multi-select or shift: move without snapping
      activeSnapLines.value = []
      if (elementsStore.selectedElementIds.includes(id)) {
        elementsStore.selectedElementIds.forEach((selectedId) => {
          elementsStore.updateElementPosition(selectedId, deltaX, deltaY)
        })
      } else {
        elementsStore.updateElementPosition(id, deltaX, deltaY)
      }
    }
  }

  const handleDragEnd = () => {
    activeSnapLines.value = []
    elementsStore.endDrag()
  }

  return { handleDrag, handleDragEnd, activeSnapLines }
}
