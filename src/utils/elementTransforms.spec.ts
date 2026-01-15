import { describe, it, expect } from 'vitest'
import { calculateNewElementState } from './elementTransforms'

describe('elementTransforms', () => {
    it('resizes unrotated element (0 deg) - East handle', () => {
        const element = { x: 0, y: 0, width: 100, height: 100, rotation: 0 }
        const result = calculateNewElementState(element, 'e', 10, 0)

        expect(result.width).toBe(110)
        expect(result.height).toBe(100)
        expect(result.x).toBe(0)
        expect(result.y).toBe(0)
    })

    it('resizes unrotated element (0 deg) - West handle', () => {
        const element = { x: 0, y: 0, width: 100, height: 100, rotation: 0 }
        const result = calculateNewElementState(element, 'w', -10, 0)

        expect(result.width).toBe(110)
        expect(result.height).toBe(100)
        expect(result.x).toBe(-10) // Left side moves
        expect(result.y).toBe(0)
    })

    it('resizes 90 deg rotated element - East handle', () => {
        const element = { x: 0, y: 0, width: 100, height: 100, rotation: 90 }

        // At 90° rotation, dragging the East handle downward (deltaY=10)
        // should increase width (because that's "outward" in local space)
        const result = calculateNewElementState(element, 'e', 0, 10)

        expect(result.width).toBe(110)
        expect(result.height).toBe(100)
        expect(result.x).toBeCloseTo(-5)
        expect(result.y).toBeCloseTo(5)
    })
})
