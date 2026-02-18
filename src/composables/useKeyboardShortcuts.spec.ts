/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'
import { useElementsStore } from '@/stores/elements/elements'

describe('useKeyboardShortcuts', () => {
  let cleanup: () => void

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    if (cleanup) cleanup()
  })

  const setup = (saveToFile = vi.fn()) => {
    const result = useKeyboardShortcuts({ saveToFile })
    cleanup = result.cleanup
    return result
  }

  it('moves selected element with arrow keys', () => {
    const store = useElementsStore()
    store.addShape('rectangle', 100, 100)
    store.selectElement(store.elements[0]!.id)

    setup()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(store.elements[0]!.x).toBe(105)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(store.elements[0]!.y).toBe(105)
  })

  it('moves 20px with Shift held', () => {
    const store = useElementsStore()
    store.addShape('rectangle', 100, 100)
    store.selectElement(store.elements[0]!.id)

    setup()

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true })
    )
    expect(store.elements[0]!.x).toBe(120)
  })

  it('groups with Ctrl+G', () => {
    const store = useElementsStore()
    store.addShape('rectangle', 0, 0)
    store.addShape('rectangle', 100, 0)
    store.selectElement(store.elements[0]!.id)
    store.addToSelection(store.elements[1]!.id)

    setup()

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'g', ctrlKey: true })
    )
    expect(store.elements.some((e) => e.type === 'group')).toBe(true)
  })

  it('ungroups with Ctrl+Shift+G', () => {
    const store = useElementsStore()
    store.addShape('rectangle', 0, 0)
    store.addShape('rectangle', 100, 0)
    store.selectElement(store.elements[0]!.id)
    store.addToSelection(store.elements[1]!.id)
    store.groupSelectedElements()

    setup()

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'G', ctrlKey: true, shiftKey: true })
    )
    expect(store.elements.every((e) => e.type !== 'group')).toBe(true)
  })

  it('calls saveToFile on Ctrl+S', () => {
    const saveFn = vi.fn()
    setup(saveFn)

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 's', ctrlKey: true })
    )
    expect(saveFn).toHaveBeenCalled()
  })

  it('removes listener on cleanup', () => {
    const store = useElementsStore()
    store.addShape('rectangle', 100, 100)
    store.selectElement(store.elements[0]!.id)

    const { cleanup: cleanupFn } = setup()
    cleanupFn()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    // Position should NOT change since listener was removed
    expect(store.elements[0]!.x).toBe(100)
  })
})
