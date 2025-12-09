import {
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    vi,
    type Mock,
} from 'vitest'
import { useResizable } from './useResizable'
import type { ResizeEvents } from '@/types/ResizeEvents'

describe('useResizable', () => {
    let emit: ResizeEvents
    let resizeStartSpy: Mock
    let resizeSpy: Mock
    let resizeEndSpy: Mock

    beforeEach(() => {
        resizeStartSpy = vi.fn()
        resizeSpy = vi.fn()
        resizeEndSpy = vi.fn()

        emit = ((event: string, ...args: any[]) => {
            switch (event) {
                case 'resizeStart':
                    resizeStartSpy(...args)
                    break
                case 'resize':
                    resizeSpy(...args)
                        +              break
                case 'resizeEnd':
                    resizeEndSpy()
                    break
            }
        }) as ResizeEvents
    })

    afterEach(() => {
        document.dispatchEvent(new MouseEvent('mouseup'))
        vi.clearAllMocks()
    })

    describe('startResize', () => {
        it('should work with different handle positions', () => {
            const { startResize } = useResizable(emit)
            const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

            handles.forEach((handle) => {
                const mockEvent = new MouseEvent('mousedown', {
                    clientX: 100,
                    clientY: 100,
                })
                startResize(handle, mockEvent)
            })

            expect(resizeStartSpy).toHaveBeenCalledTimes(handles.length)
        })
    })

    describe('resize movement', () => {
        it('should emit multiple resize events with correct deltas', () => {
            const { startResize } = useResizable(emit)
            const startEvent = new MouseEvent('mousedown', {
                clientX: 200,
                clientY: 200,
            })

            startResize('se', startEvent)

            document.dispatchEvent(
                new MouseEvent('mousemove', { clientX: 210, clientY: 215 })
            )
            expect(resizeSpy).toHaveBeenNthCalledWith(1, 'se', 10, 15)

            document.dispatchEvent(
                new MouseEvent('mousemove', { clientX: 215, clientY: 220 })
            )
            expect(resizeSpy).toHaveBeenNthCalledWith(2, 'se', 5, 5)

            expect(resizeSpy).toHaveBeenCalledTimes(2)
        })

        it('should handle negative deltas', () => {
            const { startResize } = useResizable(emit)
            const startEvent = new MouseEvent('mousedown', {
                clientX: 200,
                clientY: 200,
            })

            startResize('se', startEvent)

            const moveEvent = new MouseEvent('mousemove', {
                clientX: 180,
                clientY: 190,
            })
            document.dispatchEvent(moveEvent)

            expect(resizeSpy).toHaveBeenCalledWith('se', -20, -10)
        })
    })

    describe('resize end', () => {
        it('should emit resizeEnd when mouse is released', () => {
            const { startResize } = useResizable(emit)
            const startEvent = new MouseEvent('mousedown', {
                clientX: 200,
                clientY: 200,
            })

            startResize('se', startEvent)

            const upEvent = new MouseEvent('mouseup')
            document.dispatchEvent(upEvent)

            expect(resizeEndSpy).toHaveBeenCalledTimes(1)
        })

        it('should set isResizing to false on mouse release', () => {
            const { isResizing, startResize } = useResizable(emit)
            const startEvent = new MouseEvent('mousedown', {
                clientX: 200,
                clientY: 200,
            })

            startResize('se', startEvent)
            expect(isResizing.value).toBe(true)

            document.dispatchEvent(new MouseEvent('mouseup'))
            expect(isResizing.value).toBe(false)
        })

        it('should stop tracking mouse movement after resize ends', () => {
            const { startResize } = useResizable(emit)
            const startEvent = new MouseEvent('mousedown', {
                clientX: 200,
                clientY: 200,
            })

            startResize('se', startEvent)
            document.dispatchEvent(new MouseEvent('mouseup'))

            resizeSpy.mockClear()

            document.dispatchEvent(
                new MouseEvent('mousemove', { clientX: 300, clientY: 300 })
            )

            expect(resizeSpy).not.toHaveBeenCalled()
        })
    })

    describe('event listener cleanup', () => {
        it('should add event listeners when resize starts', () => {
            const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
            const { startResize } = useResizable(emit)

            const startEvent = new MouseEvent('mousedown', {
                clientX: 200,
                clientY: 200,
            })
            startResize('se', startEvent)

            expect(addEventListenerSpy).toHaveBeenCalledWith(
                'mousemove',
                expect.any(Function)
            )
            expect(addEventListenerSpy).toHaveBeenCalledWith(
                'mouseup',
                expect.any(Function)
            )
        })

        it('should remove listeners when resize ends', () => {
            const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
            const { startResize } = useResizable(emit)

            const startEvent = new MouseEvent('mousedown', {
                clientX: 200,
                clientY: 200,
            })
            startResize('se', startEvent)

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
        it('should handle switching between different handles', () => {
            const { startResize } = useResizable(emit)

            startResize(
                'se',
                new MouseEvent('mousedown', { clientX: 200, clientY: 200 })
            )
            document.dispatchEvent(
                new MouseEvent('mousemove', { clientX: 210, clientY: 210 })
            )
            expect(resizeSpy).toHaveBeenLastCalledWith('se', 10, 10)

            document.dispatchEvent(new MouseEvent('mouseup'))

            resizeSpy.mockClear()

            startResize(
                'nw',
                new MouseEvent('mousedown', { clientX: 100, clientY: 100 })
            )
            document.dispatchEvent(
                new MouseEvent('mousemove', { clientX: 90, clientY: 95 })
            )
            expect(resizeSpy).toHaveBeenLastCalledWith('nw', -10, -5)
        })

        it('should handle zero delta movements', () => {
            const { startResize } = useResizable(emit)

            startResize(
                'se',
                new MouseEvent('mousedown', { clientX: 200, clientY: 200 })
            )
            document.dispatchEvent(
                new MouseEvent('mousemove', { clientX: 200, clientY: 200 })
            )

            expect(resizeSpy).toHaveBeenCalledWith('se', 0, 0)
        })
    })
})
