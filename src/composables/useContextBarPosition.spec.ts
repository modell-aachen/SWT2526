/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useContextBarPosition } from './useContextBarPosition'
import { useElementsStore } from '@/stores/elements/elements'
import { useZoomStore } from '@/stores/zoom/zoom'

describe('useContextBarPosition', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('positions context bar on top and accounts for zoom level in positioning', () => {
    const elementsStore = useElementsStore()
    const zoomStore = useZoomStore()

    elementsStore.addShape('rectangle', 100, 200)
    elementsStore.selectElement(elementsStore.elements[0]!.id)

    const { contextBarStyle: style1x } = useContextBarPosition()
    const pos1x = style1x.value as Record<string, string>

    zoomStore.setZoom(2)
    const { contextBarStyle: style2x } = useContextBarPosition()
    const pos2x = style2x.value as Record<string, string>

    // At 2x zoom, the left position should be doubled
    const left1 = parseFloat(pos1x.left!)
    const left2 = parseFloat(pos2x.left!)
    expect(left2).toBe(left1 * 2)
  })

  it('flips to bottom when near top edge', () => {
    const elementsStore = useElementsStore()

    // Place element very near the top
    elementsStore.addShape('rectangle', 100, 0)
    elementsStore.selectElement(elementsStore.elements[0]!.id)

    const { contextBarStyle } = useContextBarPosition()
    const style = contextBarStyle.value as Record<string, string>

    // Should flip — top should be positive (below the element)
    const topValue = parseFloat(style.top!)
    expect(topValue).toBeGreaterThan(0)
  })
})
