/**
 * @vitest-environment node
 */
import { setActivePinia, createPinia } from 'pinia'
import { useElementsStore } from './elements'
import { describe, it, expect, beforeEach } from 'vitest'
import type { TextElement } from '@/types/Element'

describe('Elements Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default state', () => {
    const store = useElementsStore()
    expect(store.elements).toHaveLength(0)
    expect(store.selectedElementId).toBeNull()
  })

  it('adds a shape element', () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    expect(store.elements).toHaveLength(1)
    expect(store.elements[0]!.type).toBe('shape')
    expect(store.selectedElementId).toBe(store.elements[0]!.id)
  })

  it('adds a text element', () => {
    const store = useElementsStore()
    store.addText()
    const element = store.elements[0] as TextElement
    expect(element).toBeDefined()
    expect(element.type).toBe('text')
    expect(element.content).toBe('Double click to edit')
  })

  it('updates an element', () => {
    const store = useElementsStore()
    store.addShape('triangle')
    const id = store.elements[0]!.id

    store.updateElement(id, { x: 200, rotation: 45 })

    expect(store.elements[0]!.x).toBe(200)
    expect(store.elements[0]!.rotation).toBe(45)
  })

  it('deletes an element', () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    const id = store.elements[0]!.id

    store.deleteElement(id)
    expect(store.elements).toHaveLength(0)
    expect(store.selectedElementId).toBeNull()
  })

  it('manages undo/redo history', () => {
    const store = useElementsStore()
    store.addShape('rectangle') // History 1
    const id = store.elements[0]!.id
    store.updateElementPosition(id, 10, 10)
    store.endDrag() // History 2 (Snapshot saved)

    expect(store.canUndo).toBe(true)

    store.undo()
    expect(store.historyIndex).toBe(1)

    store.redo()
    expect(store.historyIndex).toBe(2)
  })
  it('updates shape outline color', () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    const id = store.elements[0]!.id

    store.updateShapeOutlineColor(id, '#FF0000')
    // @ts-ignore
    expect(store.elements[0]!.outline).toBe('#FF0000')

    // Should trigger snapshot
    expect(store.canUndo).toBe(true)
  })

  it('updates shape fill color', () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    const id = store.elements[0]!.id

    store.updateShapeFillColor(id, '#00FF00')
    // @ts-ignore
    expect(store.elements[0]!.fill).toBe('#00FF00')

    // Should trigger snapshot
    expect(store.canUndo).toBe(true)
  })

  it('updates shape stroke weight', () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    const id = store.elements[0]!.id

    store.updateShapeStrokeWeight(id, 5)
    // @ts-ignore
    expect(store.elements[0]!.strokeWeight).toBe(5)

    // Should trigger snapshot
    expect(store.canUndo).toBe(true)
  })

  it('updates element position with snapshot', () => {
    const store = useElementsStore()
    store.addShape('rectangle', 100, 100)
    const id = store.elements[0]!.id

    // @ts-ignore
    store.setElementPosition(id, 200, 300)

    expect(store.elements[0]!.x).toBe(200)
    expect(store.elements[0]!.y).toBe(300)
    expect(store.canUndo).toBe(true)
  })
})
