import { describe, it, expect } from 'vitest'
import { calculateNewElementState } from './elementTransforms'

describe('elementTransforms', () => {
  it('resizes element - East handle', () => {
    const element = { x: 0, y: 0, width: 100, height: 100 }
    const result = calculateNewElementState(element, 'e', 10, 0)

    expect(result.width).toBe(110)
    expect(result.height).toBe(100)
    expect(result.x).toBe(0)
    expect(result.y).toBe(0)
  })

  it('resizes element - West handle', () => {
    const element = { x: 0, y: 0, width: 100, height: 100 }
    const result = calculateNewElementState(element, 'w', -10, 0)

    expect(result.width).toBe(110)
    expect(result.height).toBe(100)
    expect(result.x).toBe(-10) // Left side moves
    expect(result.y).toBe(0)
  })

  it('resizes element - South handle', () => {
    const element = { x: 0, y: 0, width: 100, height: 100 }
    const result = calculateNewElementState(element, 's', 0, 20)

    expect(result.width).toBe(100)
    expect(result.height).toBe(120)
    expect(result.x).toBe(0)
    expect(result.y).toBe(0)
  })

  it('resizes element - North handle', () => {
    const element = { x: 0, y: 0, width: 100, height: 100 }
    const result = calculateNewElementState(element, 'n', 0, -15)

    expect(result.width).toBe(100)
    expect(result.height).toBe(115)
    expect(result.x).toBe(0)
    expect(result.y).toBe(-15) // Top side moves
  })

  it('resizes element - SE corner handle', () => {
    const element = { x: 0, y: 0, width: 100, height: 100 }
    const result = calculateNewElementState(element, 'se', 10, 20)

    expect(result.width).toBe(110)
    expect(result.height).toBe(120)
    expect(result.x).toBe(0)
    expect(result.y).toBe(0)
  })

  it('enforces minimum size', () => {
    const element = { x: 50, y: 50, width: 40, height: 40 }
    const result = calculateNewElementState(element, 'w', 50, 0)

    expect(result.width).toBe(30) // MIN_SIZE
    expect(result.x).toBe(60) // Adjusted
  })
})
