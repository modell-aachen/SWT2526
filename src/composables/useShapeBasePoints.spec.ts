import { describe, it, expect } from 'vitest'
import { useShapeBasePoints } from './useShapeBasePoints'

describe('useShapeBasePoints', () => {
  const { getBasePoints } = useShapeBasePoints()

  it('returns correct base points for rectangle', () => {
    expect(getBasePoints('rectangle')).toBe('5,5 95,5 95,95 5,95')
  })

  it('returns correct base points for triangle', () => {
    expect(getBasePoints('triangle')).toBe('50,5 95,95 5,95')
  })

  it('returns correct base points for trapezoid', () => {
    expect(getBasePoints('trapezoid')).toBe('25,5 75,5 95,95 5,95')
  })

  it('returns default rectangle points for unknown shape type', () => {
    // @ts-expect-error Testing invalid shape type
    expect(getBasePoints('unknown')).toBe('5,5 95,5 95,95 5,95')
  })
})
