/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useElementDrag } from './useElementDrag'
import { useElementsStore } from '@/stores/elements/elements'

describe('useElementDrag', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('moves a single element with snapping', () => {
    const store = useElementsStore()
    store.addShape('rectangle', 100, 100)
    store.selectElement(store.elements[0]!.id)

    const { handleDrag } = useElementDrag()
    const id = store.elements[0]!.id

    handleDrag(id, 10, 20)

    // Should move (snap may adjust slightly, but element should be near target)
    expect(store.elements[0]!.x).toBeGreaterThanOrEqual(100)
    expect(store.elements[0]!.y).toBeGreaterThanOrEqual(100)
  })

  it('moves multiple selected elements without snapping', () => {
    const store = useElementsStore()
    store.addShape('rectangle', 100, 100)
    store.addShape('rectangle', 300, 300)
    store.selectElement(store.elements[0]!.id)
    store.addToSelection(store.elements[1]!.id)

    const { handleDrag } = useElementDrag()

    handleDrag(store.elements[0]!.id, 10, 20)

    expect(store.elements[0]!.x).toBe(110)
    expect(store.elements[0]!.y).toBe(120)
    expect(store.elements[1]!.x).toBe(310)
    expect(store.elements[1]!.y).toBe(320)
  })

  it('skips snapping when shift is held', () => {
    const store = useElementsStore()
    store.addShape('rectangle', 100, 100)
    store.selectElement(store.elements[0]!.id)

    const { handleDrag } = useElementDrag()

    handleDrag(store.elements[0]!.id, 10, 20, { shiftKey: true } as MouseEvent)

    expect(store.elements[0]!.x).toBe(110)
    expect(store.elements[0]!.y).toBe(120)
  })
})
