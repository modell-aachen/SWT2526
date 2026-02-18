import { computed } from 'vue'
import { useElementsStore } from '@/stores/elements/elements'
import { useZoomStore } from '@/stores/zoom/zoom'
import { getVisualBoundingBox } from '@/utils/elementTransforms'

/**
 * Computes the CSS position for the element context bar.
 * Places the bar above the selected element, flipping below
 * if it would go off the top edge of the canvas.
 */
export function useContextBarPosition() {
  const elementsStore = useElementsStore()
  const zoomStore = useZoomStore()

  const contextBarStyle = computed(() => {
    const el = elementsStore.selectedElement
    const zoom = zoomStore.zoom
    if (!el) return {}

    const vb = getVisualBoundingBox(el)
    const centerX = vb.x + vb.width / 2
    const leftPos = centerX * zoom

    let topPos = vb.y * zoom - 64 // Default: 64px above

    // Flip to bottom if near top edge
    if (topPos < 10) {
      topPos = (vb.y + vb.height) * zoom + 20
    }

    return {
      left: `${leftPos}px`,
      top: `${topPos}px`,
      transform: 'translateX(-50%)',
    }
  })

  return { contextBarStyle }
}
