import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type Mock,
} from 'vitest'
import { useDraggable } from './useDraggable'
import type { DraggableEvents } from '@/types/DraggableEvents'
import { setActivePinia, createPinia } from 'pinia'

const DRAG_THRESHOLD = 3 // Must match the threshold in useDraggable.ts

describe('useDraggable', () => {
  let emit: DraggableEvents
  let dragStartSpy: Mock
  let dragSpy: Mock
  let dragEndSpy: Mock
  let clickSpy: Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    // Initialize mocks
    dragStartSpy = vi.fn()
    dragSpy = vi.fn()
    dragEndSpy = vi.fn()
    clickSpy = vi.fn()

    emit = ((event: string, ...args: any[]) => {
      switch (event) {
        case 'dragStart':
          dragStartSpy(...args)
          break
        case 'drag':
          dragSpy(...args)
          break
        case 'dragEnd':
          dragEndSpy()
          break
        case 'click':
          clickSpy(...args)
          break
      }
    }) as DraggableEvents
  })

  afterEach(() => {
    document.dispatchEvent(new MouseEvent('mouseup'))
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should return isDragging ref and startDrag function', () => {
      const { isDragging, startDrag } = useDraggable(emit)

      expect(isDragging).toBeDefined()
      expect(isDragging.value).toBe(false)
      expect(startDrag).toBeTypeOf('function')
    })

    it('should initialize isDragging as false', () => {
      const { isDragging } = useDraggable(emit)
      expect(isDragging.value).toBe(false)
    })
  })

  describe('startDrag', () => {
    it('should emit click event immediately but not dragStart', () => {
      const { startDrag } = useDraggable(emit)
      const mockEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
      })

      startDrag(mockEvent)

      expect(clickSpy).toHaveBeenCalledTimes(1)
      expect(clickSpy).toHaveBeenCalledWith(mockEvent)
      // dragStart should NOT be emitted until threshold is exceeded
      expect(dragStartSpy).not.toHaveBeenCalled()
    })

    it('should emit dragStart after exceeding threshold', () => {
      const { startDrag } = useDraggable(emit)
      const mockEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
      })

      startDrag(mockEvent)

      // Move past threshold
      document.dispatchEvent(
        new MouseEvent('mousemove', {
          clientX: 100 + DRAG_THRESHOLD,
          clientY: 100,
        })
      )

      expect(dragStartSpy).toHaveBeenCalledTimes(1)
    })

    it('should capture initial mouse position and emit drag after threshold', () => {
      const { startDrag } = useDraggable(emit)
      const mockEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 200,
      })

      startDrag(mockEvent)

      // First move past threshold
      const moveEvent = new MouseEvent('mousemove', {
        clientX: 160,
        clientY: 210,
      })
      document.dispatchEvent(moveEvent)

      expect(dragStartSpy).toHaveBeenCalledTimes(1)

      // Second move should emit drag delta from threshold point
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 170, clientY: 220 })
      )
      expect(dragSpy).toHaveBeenCalledWith(10, 10)
    })
  })

  describe('drag movement', () => {
    it('should emit multiple drag events with correct deltas', () => {
      const { startDrag } = useDraggable(emit)
      const startEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
      })

      startDrag(startEvent)

      // First move - exceeds threshold, triggers dragStart
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 110, clientY: 120 })
      )
      expect(dragStartSpy).toHaveBeenCalledTimes(1)

      // Second move - emits drag event
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 120, clientY: 130 })
      )
      expect(dragSpy).toHaveBeenNthCalledWith(1, 10, 10)

      // Third move - emits another drag event
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 125, clientY: 135 })
      )
      expect(dragSpy).toHaveBeenNthCalledWith(2, 5, 5)

      expect(dragSpy).toHaveBeenCalledTimes(2)
    })

    it('should handle negative deltas', () => {
      const { startDrag } = useDraggable(emit)
      const startEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
      })

      startDrag(startEvent)

      // Move past threshold in negative direction
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 80, clientY: 90 })
      )
      expect(dragStartSpy).toHaveBeenCalledTimes(1)

      // Continue moving negative
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 60, clientY: 80 })
      )
      expect(dragSpy).toHaveBeenCalledWith(-20, -10)
    })

    it('should not emit drag events when not dragging', () => {
      useDraggable(emit)

      const moveEvent = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 100,
      })
      document.dispatchEvent(moveEvent)

      expect(dragSpy).not.toHaveBeenCalled()
    })

    it('should not emit drag events when movement is below threshold', () => {
      const { startDrag } = useDraggable(emit)
      startDrag(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))

      // Move less than threshold
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 101, clientY: 101 })
      )

      expect(dragStartSpy).not.toHaveBeenCalled()
      expect(dragSpy).not.toHaveBeenCalled()
    })
  })

  describe('drag end', () => {
    it('should emit dragEnd when mouse is released after drag started', () => {
      const { startDrag } = useDraggable(emit)
      const startEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
      })

      startDrag(startEvent)

      // Move past threshold to start drag
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 110, clientY: 110 })
      )

      const upEvent = new MouseEvent('mouseup')
      document.dispatchEvent(upEvent)

      expect(dragEndSpy).toHaveBeenCalledTimes(1)
    })

    it('should NOT emit dragEnd when mouse is released before drag started', () => {
      const { startDrag } = useDraggable(emit)
      const startEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
      })

      startDrag(startEvent)

      // Release without moving past threshold
      document.dispatchEvent(new MouseEvent('mouseup'))

      expect(dragEndSpy).not.toHaveBeenCalled()
    })

    it('should set isDragging to false on mouse release', () => {
      const { isDragging, startDrag } = useDraggable(emit)
      const startEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
      })

      startDrag(startEvent)
      expect(isDragging.value).toBe(true)

      // Move past threshold
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 110, clientY: 110 })
      )

      document.dispatchEvent(new MouseEvent('mouseup'))
      expect(isDragging.value).toBe(false)
      expect(dragEndSpy).toHaveBeenCalledTimes(1)
    })

    it('should stop tracking mouse movement after drag ends', () => {
      const { startDrag } = useDraggable(emit)
      const startEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
      })

      startDrag(startEvent)
      document.dispatchEvent(new MouseEvent('mouseup'))

      dragSpy.mockClear()

      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 200, clientY: 200 })
      )

      expect(dragSpy).not.toHaveBeenCalled()
    })
  })

  describe('event listener cleanup', () => {
    it('should remove event listeners on unmount', () => {
      vi.spyOn(document, 'removeEventListener')
      const { startDrag } = useDraggable(emit)

      const startEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
      })
      startDrag(startEvent)

      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      startDrag(startEvent)

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      )
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mouseup',
        expect.any(Function)
      )
    })

    it('should remove listeners when drag ends', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
      const { startDrag } = useDraggable(emit)

      const startEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
      })
      startDrag(startEvent)

      removeEventListenerSpy.mockClear()

      document.dispatchEvent(new MouseEvent('mouseup'))

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      )
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mouseup',
        expect.any(Function)
      )
    })
  })

  describe('edge cases', () => {
    it('should handle rapid start-stop sequences with actual drags', () => {
      const { startDrag } = useDraggable(emit)

      // First drag
      startDrag(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 110, clientY: 110 })
      )
      document.dispatchEvent(new MouseEvent('mouseup'))

      // Second drag
      startDrag(new MouseEvent('mousedown', { clientX: 200, clientY: 200 }))
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 210, clientY: 210 })
      )
      document.dispatchEvent(new MouseEvent('mouseup'))

      expect(dragStartSpy).toHaveBeenCalledTimes(2)
      expect(dragEndSpy).toHaveBeenCalledTimes(2)
    })

    it('should handle click without drag (below threshold)', () => {
      const { startDrag } = useDraggable(emit)

      startDrag(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
      // Small movement below threshold
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 101, clientY: 101 })
      )
      document.dispatchEvent(new MouseEvent('mouseup'))

      expect(clickSpy).toHaveBeenCalledTimes(1)
      expect(dragStartSpy).not.toHaveBeenCalled()
      expect(dragSpy).not.toHaveBeenCalled()
      expect(dragEndSpy).not.toHaveBeenCalled()
    })
  })
})
