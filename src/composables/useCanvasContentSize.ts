import { computed } from 'vue'
import { useElementsStore } from '@/stores/elements/elements'

const CANVAS_PADDING = 50

/**
 * Computes the canvas content size based on element positions.
 * Returns the bounding box of all elements plus padding.
 */
export function useCanvasContentSize() {
  const elementsStore = useElementsStore()

  const canvasContentSize = computed(() => {
    if (elementsStore.elements.length === 0) {
      return { width: 0, height: 0 }
    }

    const maxX = Math.max(
      ...elementsStore.elements.map((el) => el.x + el.width)
    )
    const maxY = Math.max(
      ...elementsStore.elements.map((el) => el.y + el.height)
    )

    return {
      width: Math.max(0, maxX + CANVAS_PADDING),
      height: Math.max(0, maxY + CANVAS_PADDING),
    }
  })

  return { canvasContentSize }
}
