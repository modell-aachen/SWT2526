/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCanvasContentSize } from './useCanvasContentSize'
import { useElementsStore } from '@/stores/elements/elements'

describe('useCanvasContentSize', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('returns zero dimensions when canvas is empty', () => {
    const { canvasContentSize } = useCanvasContentSize()
    expect(canvasContentSize.value).toEqual({ width: 0, height: 0 })
  })

  it('computes size from element positions plus padding', () => {
    const store = useElementsStore()
    store.addShape('rectangle', 100, 200)
    // Default shape is 100x100, so max extent = (200, 300)

    const { canvasContentSize } = useCanvasContentSize()

    expect(canvasContentSize.value.width).toBe(200 + 50) // maxX + padding
    expect(canvasContentSize.value.height).toBe(300 + 50) // maxY + padding
  })
})
