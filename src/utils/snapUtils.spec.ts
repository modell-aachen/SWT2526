import { describe, it, expect } from 'vitest'
import {
  getElementSnapPoints,
  findSnapPosition,
  calculateSnapResult,
} from './snapUtils'
import type { CanvasElement } from '@/types/Element'
import type { SnapPoint, SnapLine } from '@/types/snapping'
import { SNAP_THRESHOLD } from '@/types/snapping'

describe('snapUtils', () => {
  describe('getElementSnapPoints', () => {
    it('should extract all snap points from an element', () => {
      const element: CanvasElement = {
        id: 'test-1',
        type: 'shape',
        x: 100,
        y: 200,
        width: 50,
        height: 80,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        fill: '#000',
        outline: '#000',
        strokeWeight: 1,
      }

      const snapPoints = getElementSnapPoints(element)

      // Should have 6 snap points: left, right, top, bottom, center-x, center-y
      expect(snapPoints).toHaveLength(6)

      // Check each snap point
      expect(snapPoints).toContainEqual({
        value: 100,
        type: 'left',
        elementId: 'test-1',
      })
      expect(snapPoints).toContainEqual({
        value: 150, // x + width
        type: 'right',
        elementId: 'test-1',
      })
      expect(snapPoints).toContainEqual({
        value: 200,
        type: 'top',
        elementId: 'test-1',
      })
      expect(snapPoints).toContainEqual({
        value: 280, // y + height
        type: 'bottom',
        elementId: 'test-1',
      })
      expect(snapPoints).toContainEqual({
        value: 125, // x + width/2
        type: 'center-x',
        elementId: 'test-1',
      })
      expect(snapPoints).toContainEqual({
        value: 240, // y + height/2
        type: 'center-y',
        elementId: 'test-1',
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

    it('should snap exactly when position matches snap point', () => {
      const result = findSnapPosition(200, snapPoints, SNAP_THRESHOLD)
      expect(result).toEqual({
        snappedValue: 200,
        snapPoint: { value: 200, type: 'left', elementId: 'elem-2' },
      })
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
    const otherElements: CanvasElement[] = [
      {
        id: 'elem-1',
        type: 'shape',
        x: 200,
        y: 100,
        width: 100,
        height: 100,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        fill: '#000',
        outline: '#000',
        strokeWeight: 1,
      },
      {
        id: 'elem-2',
        type: 'shape',
        x: 400,
        y: 300,
        width: 80,
        height: 60,
        rotation: 0,
        zIndex: 1,
        shapeType: 'rectangle',
        fill: '#000',
        outline: '#000',
        strokeWeight: 1,
      },
    ]

    it('should snap to left edge of another element', () => {
      const draggedElement: CanvasElement = {
        id: 'dragged',
        type: 'shape',
        x: 197, // Within 5px of elem-1's left (200)
        y: 150,
        width: 50,
        height: 50,
        rotation: 0,
        zIndex: 2,
        shapeType: 'rectangle',
        fill: '#000',
        outline: '#000',
        strokeWeight: 1,
      }

      const result = calculateSnapResult(
        draggedElement,
        otherElements,
        SNAP_THRESHOLD
      )

      expect(result.x).toBe(200)
      expect(result.y).toBe(150) // Y unchanged
      // Should have vertical snap line for X alignment
      // May also have horizontal line if already aligned on Y axis
      expect(result.snapLines.length).toBeGreaterThanOrEqual(1)
      const verticalLine = result.snapLines.find(
        (l: SnapLine) => l.axis === 'vertical'
      )
      expect(verticalLine).toBeDefined()
      expect(verticalLine?.position).toBe(200)
    })

    it('should snap to top edge of another element', () => {
      const draggedElement: CanvasElement = {
        id: 'dragged',
        type: 'shape',
        x: 250,
        y: 103, // Within 5px of elem-1's top (100)
        width: 50,
        height: 50,
        rotation: 0,
        zIndex: 2,
        shapeType: 'rectangle',
        fill: '#000',
        outline: '#000',
        strokeWeight: 1,
      }

      const result = calculateSnapResult(
        draggedElement,
        otherElements,
        SNAP_THRESHOLD
      )

      expect(result.x).toBe(250) // X unchanged
      expect(result.y).toBe(100)
      // Should have horizontal snap line for Y alignment
      // May also have vertical line if already aligned on X axis
      expect(result.snapLines.length).toBeGreaterThanOrEqual(1)
      const horizontalLine = result.snapLines.find(
        (l: SnapLine) => l.axis === 'horizontal'
      )
      expect(horizontalLine).toBeDefined()
      expect(horizontalLine?.position).toBe(100)
    })

    it('should snap to center alignment', () => {
      const draggedElement: CanvasElement = {
        id: 'dragged',
        type: 'shape',
        x: 223, // Center would be at 248, elem-1 center is 250
        y: 150,
        width: 50,
        height: 50,
        rotation: 0,
        zIndex: 2,
        shapeType: 'rectangle',
        fill: '#000',
        outline: '#000',
        strokeWeight: 1,
      }

      const result = calculateSnapResult(
        draggedElement,
        otherElements,
        SNAP_THRESHOLD
      )

      // Center-x of dragged (225) snaps to center-x of elem-1 (250)
      expect(result.x).toBe(225)
      // Should have vertical snap line for center-x alignment
      // May also have horizontal line if already aligned on Y axis
      expect(result.snapLines.length).toBeGreaterThanOrEqual(1)
      const verticalLine = result.snapLines.find(
        (l: SnapLine) => l.axis === 'vertical'
      )
      expect(verticalLine).toBeDefined()
      expect(verticalLine?.position).toBe(250)
    })

    it('should snap to both axes simultaneously', () => {
      const draggedElement: CanvasElement = {
        id: 'dragged',
        type: 'shape',
        x: 197, // Near elem-1's left (200)
        y: 103, // Near elem-1's top (100)
        width: 50,
        height: 50,
        rotation: 0,
        zIndex: 2,
        shapeType: 'rectangle',
        fill: '#000',
        outline: '#000',
        strokeWeight: 1,
      }

      const result = calculateSnapResult(
        draggedElement,
        otherElements,
        SNAP_THRESHOLD
      )

      expect(result.x).toBe(200)
      expect(result.y).toBe(100)
      expect(result.snapLines).toHaveLength(2)
      expect(
        result.snapLines.some((l: SnapLine) => l.axis === 'vertical')
      ).toBe(true)
      expect(
        result.snapLines.some((l: SnapLine) => l.axis === 'horizontal')
      ).toBe(true)
    })

    it('should not snap when beyond threshold', () => {
      const draggedElement: CanvasElement = {
        id: 'dragged',
        type: 'shape',
        x: 140, // elem-1 left is 200, dragged right is 190, center is 165 - all >5px away
        y: 60, // elem-1 top is 100, dragged bottom is 110, center is 85 - all >5px away
        width: 50,
        height: 50,
        rotation: 0,
        zIndex: 2,
        shapeType: 'rectangle',
        fill: '#000',
        outline: '#000',
        strokeWeight: 1,
      }

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
      const draggedElement: CanvasElement = {
        id: 'elem-1', // Same ID as one of the other elements
        type: 'shape',
        x: 202, // Would snap to itself if not excluded
        y: 150,
        width: 50,
        height: 50,
        rotation: 0,
        zIndex: 2,
        shapeType: 'rectangle',
        fill: '#000',
        outline: '#000',
        strokeWeight: 1,
      }

      const result = calculateSnapResult(
        draggedElement,
        otherElements,
        SNAP_THRESHOLD
      )

      // Should not snap to itself, only consider elem-2
      expect(result.x).toBe(202) // No snap occurred
    })

    it('should handle empty other elements array', () => {
      const draggedElement: CanvasElement = {
        id: 'dragged',
        type: 'shape',
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        rotation: 0,
        zIndex: 0,
        shapeType: 'rectangle',
        fill: '#000',
        outline: '#000',
        strokeWeight: 1,
      }

      const result = calculateSnapResult(draggedElement, [], SNAP_THRESHOLD)

      expect(result.x).toBe(100)
      expect(result.y).toBe(100)
      expect(result.snapLines).toHaveLength(0)
    })

    it('should calculate snap line ranges correctly', () => {
      const draggedElement: CanvasElement = {
        id: 'dragged',
        type: 'shape',
        x: 197,
        y: 150,
        width: 50,
        height: 50,
        rotation: 0,
        zIndex: 2,
        shapeType: 'rectangle',
        fill: '#000',
        outline: '#000',
        strokeWeight: 1,
      }

      const result = calculateSnapResult(
        draggedElement,
        otherElements,
        SNAP_THRESHOLD
      )

      // Should have a vertical snap line
      const verticalLine = result.snapLines.find(
        (l: SnapLine) => l.axis === 'vertical'
      )
      expect(verticalLine).toBeDefined()
      expect(verticalLine?.position).toBe(200)
      // Line should span entire viewport
      expect(verticalLine?.start).toBe(0)
      expect(verticalLine?.end).toBe(10000)
    })
  })
})
