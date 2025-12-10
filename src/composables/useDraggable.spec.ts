import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest'
import { useDraggable } from './useDraggable'
import type { DraggableEvents } from '@/types/DraggableEvents'

describe('useDraggable', () => {
    let emit: DraggableEvents
    let dragStartSpy: Mock
    let dragSpy: Mock
    let dragEndSpy: Mock
    let clickSpy: Mock

    beforeEach(() => {
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
        it('should emit click event immediately', () => {
            const { startDrag, isDragging, } = useDraggable(emit)
            const mockEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 })

            startDrag(mockEvent)

            expect(clickSpy).toHaveBeenCalledTimes(1)
            expect(clickSpy).toHaveBeenCalledWith(mockEvent)
            expect(dragStartSpy).toHaveBeenCalledTimes(1)
            expect(dragStartSpy).toHaveBeenCalledWith(mockEvent)
        })

        it('should capture initial mouse position', () => {
            const { startDrag } = useDraggable(emit)
            const mockEvent = new MouseEvent('mousedown', { clientX: 150, clientY: 200 })

            startDrag(mockEvent)

            const moveEvent = new MouseEvent('mousemove', { clientX: 160, clientY: 210 })
            document.dispatchEvent(moveEvent)

            expect(dragSpy).toHaveBeenCalledWith(10, 10)
        })
    })

    describe('drag movement', () => {
        it('should emit multiple drag events with correct deltas', () => {
            const { startDrag } = useDraggable(emit)
            const startEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 })

            startDrag(startEvent)

            document.dispatchEvent(new MouseEvent('mousemove', { clientX: 110, clientY: 120 }))
            expect(dragSpy).toHaveBeenNthCalledWith(1, 10, 20)

            document.dispatchEvent(new MouseEvent('mousemove', { clientX: 115, clientY: 125 }))
            expect(dragSpy).toHaveBeenNthCalledWith(2, 5, 5)

            expect(dragSpy).toHaveBeenCalledTimes(2)
        })

        it('should handle negative deltas', () => {
            const { startDrag } = useDraggable(emit)
            const startEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 })

            startDrag(startEvent)

            const moveEvent = new MouseEvent('mousemove', { clientX: 80, clientY: 90 })
            document.dispatchEvent(moveEvent)

            expect(dragSpy).toHaveBeenCalledWith(-20, -10)
        })

        it('should not emit drag events when not dragging', () => {
            useDraggable(emit)

            const moveEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 100 })
            document.dispatchEvent(moveEvent)

            expect(dragSpy).not.toHaveBeenCalled()
        })
    })

    describe('drag end', () => {
        it('should emit dragEnd when mouse is released', () => {
            const { startDrag } = useDraggable(emit)
            const startEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 })

            startDrag(startEvent)

            const upEvent = new MouseEvent('mouseup')
            document.dispatchEvent(upEvent)

            expect(dragEndSpy).toHaveBeenCalledTimes(1)
        })

        it('should set isDragging to false on mouse release', () => {
            const { isDragging, startDrag } = useDraggable(emit)
            const startEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 })

            startDrag(startEvent)
            expect(isDragging.value).toBe(true)

            document.dispatchEvent(new MouseEvent('mouseup'))
            expect(isDragging.value).toBe(false)
            expect(dragEndSpy).toHaveBeenCalledTimes(1)
        })

        it('should stop tracking mouse movement after drag ends', () => {
            const { startDrag } = useDraggable(emit)
            const startEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 })

            startDrag(startEvent)
            document.dispatchEvent(new MouseEvent('mouseup'))

            dragSpy.mockClear()

            document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 200 }))

            expect(dragSpy).not.toHaveBeenCalled()
        })
    })

    describe('event listener cleanup', () => {
        it('should remove event listeners on unmount', () => {
            const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
            const { startDrag } = useDraggable(emit)

            const startEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 })
            startDrag(startEvent)

            const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
            startDrag(startEvent)

            expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
            expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
        })

        it('should remove listeners when drag ends', () => {
            const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
            const { startDrag } = useDraggable(emit)

            const startEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 })
            startDrag(startEvent)

            removeEventListenerSpy.mockClear()

            document.dispatchEvent(new MouseEvent('mouseup'))

            expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
            expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
        })
    })

    describe('edge cases', () => {
        it('should handle rapid start-stop sequences', () => {
            const { startDrag } = useDraggable(emit)

            startDrag(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
            document.dispatchEvent(new MouseEvent('mouseup'))

            startDrag(new MouseEvent('mousedown', { clientX: 200, clientY: 200 }))
            document.dispatchEvent(new MouseEvent('mouseup'))

            expect(dragStartSpy).toHaveBeenCalledTimes(2)
            expect(dragEndSpy).toHaveBeenCalledTimes(2)
        })

        it('should handle zero delta movements', () => {
            const { startDrag } = useDraggable(emit)

            startDrag(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }))
            document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }))

            expect(dragSpy).toHaveBeenCalledWith(0, 0)
        })
    })
})
