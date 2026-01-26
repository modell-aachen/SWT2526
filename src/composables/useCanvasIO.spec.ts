import { describe, it, expect, vi } from 'vitest'
import { useCanvasIO } from './useCanvasIO'
import type { Snapshot } from '@/stores/elements/elements'

describe('useCanvasIO', () => {
    const { saveToFile, loadFromFile } = useCanvasIO()

    it('saveToFile creates a link and clicks it', () => {
        const snapshot: Snapshot = {
            version: 1,
            timestamp: Date.now(),
            elements: [],
            nextId: 1,
        }

        const clickMock = vi.fn()
        const appendChildMock = vi.fn()
        const removeChildMock = vi.fn()
        const createElementMock = vi.fn().mockReturnValue({
            click: clickMock,
            style: {},
        })

        const originalCreateElement = document.createElement
        const originalAppendChild = document.body.appendChild
        const originalRemoveChild = document.body.removeChild

        document.createElement = createElementMock as any
        document.body.appendChild = appendChildMock as any
        document.body.removeChild = removeChildMock as any

        saveToFile(snapshot)

        expect(createElementMock).toHaveBeenCalledWith('a')
        expect(appendChildMock).toHaveBeenCalled()
        expect(clickMock).toHaveBeenCalled()
        expect(removeChildMock).toHaveBeenCalled()

        document.createElement = originalCreateElement
        document.body.appendChild = originalAppendChild
        document.body.removeChild = originalRemoveChild
    })

    it('loadFromFile reads and parses JSON', async () => {
        const snapshot: Snapshot = {
            version: 1,
            timestamp: 12345,
            elements: [],
            nextId: 5,
        }
        const file = new File([JSON.stringify(snapshot)], 'test.json', {
            type: 'application/json',
        })

        const result = await loadFromFile(file)
        expect(result).toEqual(snapshot)
    })
})
