/**
 * @vitest-environment jsdom
 */
import { setActivePinia, createPinia } from 'pinia'
import { useDragStore } from './dragGhost'
import { useElementsStore } from '../elements/elements'
import { describe, it, expect, beforeEach } from 'vitest'
import type { ShapeElement } from '@/types/Element'

describe('Drag Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts drag with shape type', () => {
    const store = useDragStore()
    const event = new MouseEvent('mousedown', { clientX: 100, clientY: 100 })

    store.startDrag('rectangle', event)

    expect(store.isDragging).toBe(true)
    expect(store.draggedShapeType).toBe('rectangle')
    expect(store.ghostPosition).toEqual({ x: 50, y: 50 })
  })

  it('starts drag with custom points', () => {
    const store = useDragStore()
    const event = new MouseEvent('mousedown', { clientX: 150, clientY: 150 })
    const customPoints = '0,0 100,0 50,100'

    store.startDrag('custom', event, customPoints)

    expect(store.isDragging).toBe(true)
    expect(store.draggedShapeType).toBe('custom')
    expect(store.draggedCustomPoints).toBe(customPoints)
    expect(store.ghostPosition).toEqual({ x: 100, y: 100 })
  })

  it('adds shape to elements store on drop over canvas', () => {
    const dragStore = useDragStore()
    const elementsStore = useElementsStore()
    const event = new MouseEvent('mousedown', { clientX: 100, clientY: 100 })

    const canvas = document.createElement('div')
    canvas.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      right: 500,
      bottom: 500,
      width: 500,
      height: 500,
      x: 0,
      y: 0,
      toJSON: () => {},
    })
    dragStore.setCanvasElement(canvas)

    dragStore.startDrag('rectangle', event)

    const mouseUpEvent = new MouseEvent('mouseup', {
      clientX: 200,
      clientY: 200,
    })
    dragStore._handleMouseUp(mouseUpEvent)

    expect(elementsStore.elements).toHaveLength(1)
    expect(elementsStore.elements[0]!.type).toBe('shape')
  })

  it('adds custom shape to elements store on drop', () => {
    const dragStore = useDragStore()
    const elementsStore = useElementsStore()
    const event = new MouseEvent('mousedown', { clientX: 100, clientY: 100 })
    const customPoints = '0,0 100,0 50,100'

    const canvas = document.createElement('div')
    canvas.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      right: 500,
      bottom: 500,
      width: 500,
      height: 500,
      x: 0,
      y: 0,
      toJSON: () => {},
    })
    dragStore.setCanvasElement(canvas)

    dragStore.startDrag('custom', event, customPoints)

    const mouseUpEvent = new MouseEvent('mouseup', {
      clientX: 200,
      clientY: 200,
    })
    dragStore._handleMouseUp(mouseUpEvent)

    expect(elementsStore.elements).toHaveLength(1)
    const element = elementsStore.elements[0] as ShapeElement
    expect(element.shapeType).toBe('custom')
    expect(element.customPoints).toBe(customPoints)
  })
})
