/**
 * @vitest-environment jsdom
 */
import { setActivePinia, createPinia } from 'pinia'
import { useDragStore } from './dragGhost'
import { useElementsStore } from '../elements/elements'
import { describe, it, expect, beforeEach } from 'vitest'
import type { ShapeElement } from '@/types/Element'

describe('Drag Store', () => {
  let store: ReturnType<typeof useDragStore>
  let elementsStore: ReturnType<typeof useElementsStore>

  function createMockEvent(
    type: 'mousedown' | 'mouseup',
    x: number,
    y: number
  ) {
    return new MouseEvent(type, { clientX: x, clientY: y })
  }

  function setupMockCanvas() {
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
    store.setCanvasElement(canvas)
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useDragStore()
    elementsStore = useElementsStore()
  })

  it('starts drag with shape type', () => {
    const event = createMockEvent('mousedown', 100, 100)
    store.startDrag('rectangle', event)

    expect(store.isDragging).toBe(true)
    expect(store.draggedShapeType).toBe('rectangle')
    expect(store.ghostPosition).toEqual({ x: 50, y: 50 })
  })

  it('starts drag with custom points', () => {
    const event = createMockEvent('mousedown', 150, 150)
    const customPoints = '0,0 100,0 50,100'

    store.startDrag('custom', event, customPoints)

    expect(store.isDragging).toBe(true)
    expect(store.draggedShapeType).toBe('custom')
    expect(store.draggedCustomPoints).toBe(customPoints)
    expect(store.ghostPosition).toEqual({ x: 100, y: 100 })
  })

  it('adds shape to elements store on drop over canvas', () => {
    setupMockCanvas()
    const event = createMockEvent('mousedown', 100, 100)
    store.startDrag('rectangle', event)

    const mouseUpEvent = createMockEvent('mouseup', 200, 200)
    store._handleMouseUp(mouseUpEvent)

    expect(elementsStore.elements).toHaveLength(1)
    expect(elementsStore.elements[0]!.type).toBe('shape')
  })

  it('adds custom shape to elements store on drop', () => {
    setupMockCanvas()
    const event = createMockEvent('mousedown', 100, 100)
    const customPoints = '0,0 100,0 50,100'

    store.startDrag('custom', event, customPoints)

    const mouseUpEvent = createMockEvent('mouseup', 200, 200)
    store._handleMouseUp(mouseUpEvent)

    expect(elementsStore.elements).toHaveLength(1)
    const element = elementsStore.elements[0] as ShapeElement
    expect(element.shapeType).toBe('custom')
    expect(element.customPoints).toBe(customPoints)
  })
})
