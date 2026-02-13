import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import {
  getElementSnapPoints,
  findSnapPosition,
  calculateSnapResult,
} from './snapUtils'
import type { CanvasElement } from '@/types/Element'
import type { SnapPoint, SnapLine } from '@/types/snapping'
import { SNAP_THRESHOLD } from '@/types/snapping'

/**
 * Helper to create a test element with default properties
 */
function createTestElement(props: {
  id: string
  x: number
  y: number
  width?: number
  height?: number
}): CanvasElement {
  return {
    id: props.id,
    type: 'shape',
    x: props.x,
    y: props.y,
    width: props.width ?? 50,
    height: props.height ?? 50,
    rotation: 0,
    zIndex: 0,
    shapeType: 'rectangle', // 'shapeType' matches our fixed snapping.ts
    fill: '#000',
    outline: '#000',
    strokeWeight: 1,
  }
}

describe('snapUtils', () => {
  describe('getElementSnapPoints', () => {
    it('should extract all snap points from an element', () => {
      const element = createTestElement({
        id: 'test-1',
        x: 100,
        y: 200,
        width: 50,
        height: 80,
      })
      const snapPoints = getElementSnapPoints(element)

      // Should have 6 snap points: left, right, top, bottom, center-x, center-y
      expect(snapPoints).toHaveLength(6)

      // Expected values
      const expected = [
        { value: 100, type: 'left', elementId: 'test-1' },
        { value: 150, type: 'right', elementId: 'test-1' },
        { value: 200, type: 'top', elementId: 'test-1' },
        { value: 280, type: 'bottom', elementId: 'test-1' },
        { value: 125, type: 'center-x', elementId: 'test-1' },
        { value: 240, type: 'center-y', elementId: 'test-1' },
      ]

      expected.forEach((point) => {
        expect(snapPoints).toContainEqual(point)
      })
    })
  })

  describe('findSnapPosition', () => {
    const snapPoints: SnapPoint[] = [
      { value: 100, type: 'left', elementId: 'elem-1' },
      { value: 200, type: 'left', elementId: 'elem-2' },
      { value: 350, type: 'center-x', elementId: 'elem-3' },
    ]

    it('should snap to nearest point within threshold', () => {
      const result = findSnapPosition(102, snapPoints, SNAP_THRESHOLD)
      expect(result).toEqual({
        snappedValue: 100,
        snapPoint: { value: 100, type: 'left', elementId: 'elem-1' },
      })
    })

    it('should not snap if no points within threshold', () => {
      const result = findSnapPosition(110, snapPoints, SNAP_THRESHOLD)
      expect(result).toBeNull()
    })

    it('should snap to the closest point when multiple are within threshold', () => {
      const closeSnapPoints: SnapPoint[] = [
        { value: 100, type: 'left', elementId: 'elem-1' },
        { value: 103, type: 'right', elementId: 'elem-2' },
      ]
      const result = findSnapPosition(101, closeSnapPoints, SNAP_THRESHOLD)
      expect(result?.snappedValue).toBe(100)
    })

    it('should handle negative coordinates', () => {
      const negativeSnapPoints: SnapPoint[] = [
        { value: -50, type: 'left', elementId: 'elem-1' },
      ]
      const result = findSnapPosition(-48, negativeSnapPoints, SNAP_THRESHOLD)
      expect(result?.snappedValue).toBe(-50)
    })
  })

  describe('calculateSnapResult', () => {
    beforeEach(() => {
      setActivePinia(createPinia())
    })

    // Shared elements for calculate tests
    const otherElements: CanvasElement[] = [
      createTestElement({
        id: 'elem-1',
        x: 200,
        y: 100,
        width: 100,
        height: 100,
      }),
      createTestElement({
        id: 'elem-2',
        x: 400,
        y: 300,
        width: 80,
        height: 60,
      }),
    ]

    // Helper to get vertical/horizontal lines quickly
    const getVerticalLine = (result: any) =>
      result.snapLines.find((l: SnapLine) => l.axis === 'vertical')

    const getHorizontalLine = (result: any) =>
      result.snapLines.find((l: SnapLine) => l.axis === 'horizontal')

    it('should snap to left edge of another element', () => {
      // Within 5px of elem-1's left (200)
      const draggedElement = createTestElement({
        id: 'dragged',
        x: 197,
        y: 150,
      })

      const result = calculateSnapResult(
        draggedElement,
        otherElements,
        SNAP_THRESHOLD
      )

      expect(result.x).toBe(200)
      expect(result.y).toBe(150) // Y unchanged
      expect(result.snapLines.length).toBeGreaterThanOrEqual(1)

      const verticalLine = getVerticalLine(result)
      expect(verticalLine).toBeDefined()
      expect(verticalLine?.position).toBe(200)
    })

    it('should snap to top edge of another element', () => {
      // Within 5px of elem-1's top (100)
      const draggedElement = createTestElement({
        id: 'dragged',
        x: 250,
        y: 103,
      })

      const result = calculateSnapResult(
        draggedElement,
        otherElements,
        SNAP_THRESHOLD
      )

      expect(result.x).toBe(250) // X unchanged
      expect(result.y).toBe(100)
      expect(result.snapLines.length).toBeGreaterThanOrEqual(1)

      const horizontalLine = getHorizontalLine(result)
      expect(horizontalLine).toBeDefined()
      expect(horizontalLine?.position).toBe(100)
    })

    it('should snap to center alignment', () => {
      // Center would be at 248 (223 + 25), elem-1 center is 250 (200 + 50)
      const draggedElement = createTestElement({
        id: 'dragged',
        x: 223,
        y: 150,
      })

      const result = calculateSnapResult(
        draggedElement,
        otherElements,
        SNAP_THRESHOLD
      )

      // Center-x of dragged snaps (225)
      expect(result.x).toBe(225)
      expect(result.snapLines.length).toBeGreaterThanOrEqual(1)

      const verticalLine = getVerticalLine(result)
      expect(verticalLine).toBeDefined()
      expect(verticalLine?.position).toBe(250)
    })

    it('should snap to both axes simultaneously', () => {
      // Near elem-1's left (200) and top (100)
      const draggedElement = createTestElement({
        id: 'dragged',
        x: 197,
        y: 103,
      })

      const result = calculateSnapResult(
        draggedElement,
        otherElements,
        SNAP_THRESHOLD
      )

      expect(result.x).toBe(200)
      expect(result.y).toBe(100)
      expect(result.snapLines).toHaveLength(2)
      expect(getVerticalLine(result)).toBeDefined()
      expect(getHorizontalLine(result)).toBeDefined()
    })

    it('should not snap when beyond threshold', () => {
      // Far away from elem-1 (left=200, top=100)
      const draggedElement = createTestElement({ id: 'dragged', x: 140, y: 60 })

      const result = calculateSnapResult(
        draggedElement,
        otherElements,
        SNAP_THRESHOLD
      )

      expect(result.x).toBe(140) // Unchanged
      expect(result.y).toBe(60) // Unchanged
      expect(result.snapLines).toHaveLength(0)
    })

    it('should exclude the dragged element from snap targets', () => {
      // ID matches elem-1 so it should be ignored
      const draggedElement = createTestElement({ id: 'elem-1', x: 202, y: 150 })

      const result = calculateSnapResult(
        draggedElement,
        otherElements,
        SNAP_THRESHOLD
      )

      expect(result.x).toBe(202) // No snap occurred
    })
  })
})
