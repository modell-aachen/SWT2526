/**
 * @vitest-environment node
 */
import { setActivePinia, createPinia } from 'pinia'
import { useElementsStore } from './elements'
import { describe, it, expect, beforeEach } from 'vitest'
import type { TextElement, IconElement } from '@/types/Element'

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

  it('saves custom shape', () => {
    const store = useElementsStore()
    store.saveCustomShape('test', '0,0 100,100')
    expect(store.customShapes).toHaveLength(1)
    expect(store.customShapes[0]!.name).toBe('test')
    expect(store.customShapes[0]!.points).toBe('0,0 100,100')
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

  it('adds an icon element', () => {
    const store = useElementsStore()
    store.addIcon('star')
    const element = store.elements[0] as IconElement
    expect(element).toBeDefined()
    expect(element.type).toBe('icon')
    expect(element.iconType).toBe('star')
  })

  it('updates icon color', () => {
    const store = useElementsStore()
    store.addIcon('star')
    const id = store.elements[0]!.id

    store.updateIconColor(id, '#0000FF')
    // @ts-ignore
    expect(store.elements[0]!.color).toBe('#0000FF')

    // Should trigger snapshot
    expect(store.canUndo).toBe(true)
  })

  it('updates icon stroke weight', () => {
    const store = useElementsStore()
    store.addIcon('star')
    const id = store.elements[0]!.id

    store.updateIconStrokeWeight(id, 4)
    // @ts-ignore
    expect(store.elements[0]!.strokeWeight).toBe(4)

    // Should trigger snapshot
    expect(store.canUndo).toBe(true)
  })

  const addShapes = () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    store.addShape('triangle')
    store.addShape('ellipse')
  }

  describe('z-index management', () => {
    it('bringToFront moves element to highest zIndex', () => {
      const store = useElementsStore()
      addShapes()

      const firstId = store.elements[0]!.id
      store.selectElement(firstId)

      store.bringToFront()

      const allZIndexes = store.elements.map((e) => e.zIndex)
      expect(store.elements[0]!.zIndex).toBe(Math.max(...allZIndexes))
    })

    it('bringToBack moves element to zIndex 0 and shifts others up', () => {
      const store = useElementsStore()
      addShapes()

      const lastId = store.elements[2]!.id
      store.selectElement(lastId)

      store.bringToBack()

      expect(store.elements[2]!.zIndex).toBe(0)
      expect(store.elements[0]!.zIndex).toBe(1)
      expect(store.elements[1]!.zIndex).toBe(2)
    })

    it('bringToFront does nothing if already at front', () => {
      const store = useElementsStore()
      store.addShape('rectangle')
      store.addShape('triangle')

      const historyLengthBefore = store.history.length

      store.bringToFront()

      expect(store.elements[1]!.zIndex).toBe(1)
      expect(store.history.length).toBe(historyLengthBefore)
    })

    it('bringToBack does nothing if already at back', () => {
      const store = useElementsStore()
      addShapes()

      const firstId = store.elements[0]!.id
      store.selectElement(firstId)
      const historyLengthBefore = store.history.length

      store.bringToBack()

      expect(store.elements[0]!.zIndex).toBe(0)
      expect(store.history.length).toBe(historyLengthBefore)
    })
  })
})
